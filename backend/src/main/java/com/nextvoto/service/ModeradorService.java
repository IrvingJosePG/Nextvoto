package com.nextvoto.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextvoto.dto.moderador.ModeradorDTO.EncuestaResumen;
import com.nextvoto.dto.moderador.ModeradorDTO.NuevaEncuesta;
import com.nextvoto.dto.moderador.ModeradorDTO.NuevaPregunta;
import com.nextvoto.dto.moderador.ModeradorDTO.OpcionResultado;
import com.nextvoto.dto.moderador.ModeradorDTO.PreguntaResultado;
import com.nextvoto.dto.moderador.ModeradorDTO.Resultados;
import com.nextvoto.dto.moderador.ModeradorDTO.Resumen;
import com.nextvoto.entity.Encuesta;
import com.nextvoto.entity.Encuesta.TipoEncuesta;
import com.nextvoto.entity.Opcion;
import com.nextvoto.entity.Participacion.EstadoParticipacion;
import com.nextvoto.entity.Pregunta;
import com.nextvoto.entity.Usuario;
import com.nextvoto.exception.BusinessException;
import com.nextvoto.exception.ResourceNotFoundException;
import com.nextvoto.repository.EncuestaRepository;
import com.nextvoto.repository.OpcionRepository;
import com.nextvoto.repository.ParticipacionRepository;
import com.nextvoto.repository.PreguntaRepository;
import com.nextvoto.repository.RespuestaRepository;
import com.nextvoto.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ModeradorService {

    private static final SecureRandom ALEATORIO = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final EncuestaRepository encuestaRepository;
    private final ParticipacionRepository participacionRepository;
    private final PreguntaRepository preguntaRepository;
    private final OpcionRepository opcionRepository;
    private final RespuestaRepository respuestaRepository;

    // ---------- Inicio ----------

    public Resumen obtenerResumen(String email) {
        LocalDateTime ahora = LocalDateTime.now();
        List<Encuesta> encuestas = encuestasDe(email);

        long completadas = 0;
        long pendientes = 0;
        for (Encuesta encuesta : encuestas) {
            completadas += contar(encuesta, EstadoParticipacion.COMPLETADA);
            pendientes += contar(encuesta, EstadoParticipacion.PENDIENTE);
        }

        long unidos = completadas + pendientes;
        long tasa = unidos == 0 ? 0 : Math.round(completadas * 100.0 / unidos);
        long activas = encuestas.stream().filter(encuesta -> encuesta.estaAbierta(ahora)).count();

        return new Resumen(activas, encuestas.size(), completadas, tasa);
    }

    // ---------- Mis encuestas ----------

    public List<EncuestaResumen> listarEncuestas(String email) {
        LocalDateTime ahora = LocalDateTime.now();
        return encuestasDe(email).stream()
                .map(encuesta -> aResumen(encuesta, ahora))
                .toList();
    }

    // ---------- Crear ----------

    @Transactional
    public EncuestaResumen crearEncuesta(String email, NuevaEncuesta datos) {
        Usuario moderador = buscarModerador(email);
        validarEstructura(datos);

        Encuesta encuesta = Encuesta.builder()
                .titulo(datos.titulo().trim())
                .descripcion(limpiar(datos.descripcion()))
                .tipo(datos.tipo())
                .codigoPin(generarPinUnico())
                .fechaLimite(datos.fechaLimite())
                .activa(true)
                .moderador(moderador)
                .build();

        int orden = 1;
        for (NuevaPregunta nueva : datos.preguntas()) {
            Pregunta pregunta = Pregunta.builder()
                    .texto(nueva.texto().trim())
                    .orden(orden++)
                    .encuesta(encuesta)
                    .build();

            for (String textoOpcion : nueva.opciones()) {
                pregunta.getOpciones().add(Opcion.builder()
                        .texto(textoOpcion.trim())
                        .pregunta(pregunta)
                        .build());
            }
            encuesta.getPreguntas().add(pregunta);
        }

        return aResumen(encuestaRepository.save(encuesta), LocalDateTime.now());
    }

    // ---------- Resultados ----------

    public Resultados obtenerResultados(String email, Long idEncuesta) {
        Encuesta encuesta = encuestaDelModerador(idEncuesta, email, false);
        List<PreguntaResultado> preguntas = new ArrayList<>();

        for (Pregunta pregunta : preguntaRepository.findByEncuestaIdEncuestaOrderByOrdenAsc(idEncuesta)) {
            List<Opcion> opciones = opcionRepository
                    .findByPreguntaIdPreguntaOrderByIdOpcionAsc(pregunta.getIdPregunta());

            long[] conteos = new long[opciones.size()];
            long totalPregunta = 0;
            for (int i = 0; i < opciones.size(); i++) {
                conteos[i] = respuestaRepository.countByOpcionIdOpcion(opciones.get(i).getIdOpcion());
                totalPregunta += conteos[i];
            }

            List<OpcionResultado> resultadosOpciones = new ArrayList<>();
            for (int i = 0; i < opciones.size(); i++) {
                double porcentaje = totalPregunta > 0
                        ? Math.round((conteos[i] * 1000.0) / totalPregunta) / 10.0
                        : 0.0;
                resultadosOpciones.add(new OpcionResultado(
                        opciones.get(i).getIdOpcion(), opciones.get(i).getTexto(), conteos[i], porcentaje));
            }

            preguntas.add(new PreguntaResultado(pregunta.getIdPregunta(), pregunta.getTexto(), resultadosOpciones));
        }

        return new Resultados(
                encuesta.getIdEncuesta(), encuesta.getTitulo(), encuesta.getTipo(), encuesta.getCodigoPin(),
                encuesta.getFechaLimite(), Boolean.TRUE.equals(encuesta.getActiva()),
                encuesta.estaAbierta(LocalDateTime.now()),
                contar(encuesta, EstadoParticipacion.COMPLETADA), preguntas);
    }

    // ---------- Cerrar y eliminar ----------

    @Transactional
    public void cerrarEncuesta(String email, Long idEncuesta) {
        Encuesta encuesta = encuestaDelModerador(idEncuesta, email, true);
        if (!Boolean.TRUE.equals(encuesta.getActiva())) {
            throw new BusinessException("Esta encuesta ya está cerrada.");
        }
        encuesta.setActiva(false);
    }

    @Transactional
    public void eliminarEncuesta(String email, Long idEncuesta) {
        encuestaRepository.delete(encuestaDelModerador(idEncuesta, email, true));
    }

    // ---------- Utilidades ----------

    private Usuario buscarModerador(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    // Se filtra en Java para no modificar los repositorios del resto del equipo.
    private List<Encuesta> encuestasDe(String email) {
        Long idModerador = buscarModerador(email).getIdUsuario();
        return encuestaRepository.findAllByOrderByIdEncuestaDesc().stream()
                .filter(encuesta -> encuesta.getModerador().getIdUsuario().equals(idModerador))
                .toList();
    }

    // Si la encuesta existe pero es de otro moderador, se responde "no encontrada".
    private Encuesta encuestaDelModerador(Long idEncuesta, String email, boolean paraEditar) {
        Optional<Encuesta> encuesta = paraEditar
                ? encuestaRepository.buscarParaEditar(idEncuesta)
                : encuestaRepository.findById(idEncuesta);

        return encuesta
                .filter(e -> e.getModerador().getEmail().equalsIgnoreCase(email))
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada"));
    }

    private void validarEstructura(NuevaEncuesta datos) {
        if (datos.tipo() == TipoEncuesta.VOTACION && datos.preguntas().size() != 1) {
            throw new BusinessException(
                    "Una votación tiene exactamente 1 pregunta. Si necesitas varias, crea una encuesta.");
        }

        for (NuevaPregunta pregunta : datos.preguntas()) {
            Set<String> vistas = new HashSet<>();
            for (String opcion : pregunta.opciones()) {
                if (!vistas.add(opcion.trim().toLowerCase())) {
                    throw new BusinessException(
                            "Hay opciones repetidas en la pregunta «" + pregunta.texto().trim() + "».");
                }
            }
        }
    }

    private String generarPinUnico() {
        for (int intento = 0; intento < 30; intento++) {
            String pin = "NV-" + (1000 + ALEATORIO.nextInt(9000));
            if (!encuestaRepository.existsByCodigoPin(pin)) {
                return pin;
            }
        }
        throw new BusinessException("No se pudo generar un PIN único. Intenta de nuevo.");
    }

    private long contar(Encuesta encuesta, EstadoParticipacion estado) {
        return participacionRepository.countByEncuestaIdEncuestaAndEstado(encuesta.getIdEncuesta(), estado);
    }

    private EncuestaResumen aResumen(Encuesta encuesta, LocalDateTime ahora) {
        return new EncuestaResumen(
                encuesta.getIdEncuesta(), encuesta.getTitulo(), encuesta.getDescripcion(), encuesta.getTipo(),
                encuesta.getCodigoPin(), encuesta.getFechaLimite(),
                Boolean.TRUE.equals(encuesta.getActiva()), encuesta.estaAbierta(ahora),
                contar(encuesta, EstadoParticipacion.COMPLETADA),
                contar(encuesta, EstadoParticipacion.PENDIENTE),
                encuesta.getPreguntas().size());
    }

    private String limpiar(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}