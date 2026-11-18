package com.nextvoto.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextvoto.dto.votante.EncuestaVotanteDTO;
import com.nextvoto.dto.votante.EncuestaVotanteDTO.OpcionItemDTO;
import com.nextvoto.dto.votante.EncuestaVotanteDTO.PreguntaItemDTO;
import com.nextvoto.dto.votante.EnviarVotoRequest;
import com.nextvoto.dto.votante.EnviarVotoRequest.SeleccionRespuesta;
import com.nextvoto.dto.votante.ParticipacionDTO;
import com.nextvoto.dto.votante.ResultadoVotanteDTO;
import com.nextvoto.dto.votante.ResultadoVotanteDTO.OpcionResultadoDTO;
import com.nextvoto.dto.votante.ResultadoVotanteDTO.PreguntaResultadoDTO;
import com.nextvoto.dto.votante.UnirsePinRequest;
import com.nextvoto.entity.Encuesta;
import com.nextvoto.entity.Opcion;
import com.nextvoto.entity.Participacion;
import com.nextvoto.entity.Participacion.EstadoParticipacion;
import com.nextvoto.entity.Pregunta;
import com.nextvoto.entity.Respuesta;
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
public class VotanteService {

    private final UsuarioRepository usuarioRepository;
    private final EncuestaRepository encuestaRepository;
    private final ParticipacionRepository participacionRepository;
    private final PreguntaRepository preguntaRepository;
    private final OpcionRepository opcionRepository;
    private final RespuestaRepository respuestaRepository;

    private Usuario getUsuarioPorEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }

    private void validarEncuestaVigente(Encuesta encuesta) {
        if (!Boolean.TRUE.equals(encuesta.getActiva()) || encuesta.getFechaLimite().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Esta encuesta o votación ya se encuentra cerrada o ha expirado");
        }
    }

    @Transactional
    public ParticipacionDTO unirsePorPin(String email, UnirsePinRequest request) {
        Usuario usuario = getUsuarioPorEmail(email);
        String pinNormalizado = request.getCodigoPin().trim().toUpperCase();

        Encuesta encuesta = encuestaRepository.findByCodigoPin(pinNormalizado)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontró ninguna encuesta con el PIN: " + pinNormalizado));

        validarEncuestaVigente(encuesta);

        Optional<Participacion> existente = participacionRepository
                .findByUsuarioIdUsuarioAndEncuestaIdEncuesta(usuario.getIdUsuario(), encuesta.getIdEncuesta());

        if (existente.isPresent()) {
            Participacion p = existente.get();
            if (p.getEstado() == EstadoParticipacion.COMPLETADA) {
                throw new BusinessException("Ya emitiste tu voto en esta encuesta");
            }
            return toParticipacionDTO(p);
        }

        Participacion nueva = Participacion.builder()
                .usuario(usuario)
                .encuesta(encuesta)
                .estado(EstadoParticipacion.PENDIENTE)
                .build();

        return toParticipacionDTO(participacionRepository.save(nueva));
    }

    @Transactional(readOnly = true)
    public List<ParticipacionDTO> obtenerPendientes(String email) {
        Usuario usuario = getUsuarioPorEmail(email);
        List<Participacion> pendientes = participacionRepository
                .findByUsuarioIdUsuarioAndEstadoOrderByIdParticipacionDesc(usuario.getIdUsuario(), EstadoParticipacion.PENDIENTE);

        List<ParticipacionDTO> resultado = new ArrayList<>();
        for (Participacion p : pendientes) {
            resultado.add(toParticipacionDTO(p));
        }
        return resultado;
    }

    @Transactional(readOnly = true)
    public Page<ParticipacionDTO> obtenerHistorial(String email, Pageable pageable) {
        Usuario usuario = getUsuarioPorEmail(email);
        Page<Participacion> completadas = participacionRepository
                .findByUsuarioIdUsuarioAndEstado(usuario.getIdUsuario(), EstadoParticipacion.COMPLETADA, pageable);

        return completadas.map(this::toParticipacionDTO);
    }

    @Transactional(readOnly = true)
    public EncuestaVotanteDTO obtenerBoletaEncuesta(String email, Long idEncuesta) {
        Usuario usuario = getUsuarioPorEmail(email);
        Encuesta encuesta = encuestaRepository.findById(idEncuesta)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada"));

        Participacion participacion = participacionRepository
                .findByUsuarioIdUsuarioAndEncuestaIdEncuesta(usuario.getIdUsuario(), idEncuesta)
                .orElseThrow(() -> new BusinessException("Debes canjear el código PIN antes de acceder a esta encuesta"));

        if (participacion.getEstado() == EstadoParticipacion.COMPLETADA) {
            throw new BusinessException("Ya completaste tu participación en esta encuesta");
        }

        validarEncuestaVigente(encuesta);

        List<Pregunta> preguntas = preguntaRepository.findByEncuestaIdEncuestaOrderByOrdenAsc(idEncuesta);
        List<PreguntaItemDTO> preguntasDTO = new ArrayList<>();

        for (Pregunta preg : preguntas) {
            List<Opcion> opciones = opcionRepository.findByPreguntaIdPreguntaOrderByIdOpcionAsc(preg.getIdPregunta());
            List<OpcionItemDTO> opcionesDTO = new ArrayList<>();

            for (Opcion op : opciones) {
                opcionesDTO.add(OpcionItemDTO.builder()
                        .idOpcion(op.getIdOpcion())
                        .texto(op.getTexto())
                        .build());
            }

            preguntasDTO.add(PreguntaItemDTO.builder()
                    .idPregunta(preg.getIdPregunta())
                    .texto(preg.getTexto())
                    .orden(preg.getOrden())
                    .opciones(opcionesDTO)
                    .build());
        }

        return EncuestaVotanteDTO.builder()
                .idEncuesta(encuesta.getIdEncuesta())
                .titulo(encuesta.getTitulo())
                .descripcion(encuesta.getDescripcion())
                .tipo(encuesta.getTipo().name())
                .codigoPin(encuesta.getCodigoPin())
                .fechaLimite(encuesta.getFechaLimite())
                .preguntas(preguntasDTO)
                .build();
    }

    @Transactional
    public void emitirVoto(String email, Long idEncuesta, EnviarVotoRequest request) {
        Usuario usuario = getUsuarioPorEmail(email);
        Encuesta encuesta = encuestaRepository.findById(idEncuesta)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada"));

        Participacion participacion = participacionRepository
                .findByUsuarioIdUsuarioAndEncuestaIdEncuesta(usuario.getIdUsuario(), idEncuesta)
                .orElseThrow(() -> new BusinessException("No tienes una participación registrada para esta encuesta"));

        if (participacion.getEstado() == EstadoParticipacion.COMPLETADA) {
            throw new BusinessException("Tu voto ya fue registrado anteriormente. No se permite votar dos veces");
        }

        validarEncuestaVigente(encuesta);

        List<Pregunta> preguntasEncuesta = preguntaRepository.findByEncuestaIdEncuestaOrderByOrdenAsc(idEncuesta);
        if (request.getRespuestas().size() != preguntasEncuesta.size()) {
            throw new BusinessException("Debes responder todas las preguntas de la encuesta (" + preguntasEncuesta.size() + " en total)");
        }

        Set<Long> preguntasRespondidas = new HashSet<>();

        for (SeleccionRespuesta item : request.getRespuestas()) {
            if (!preguntasRespondidas.add(item.getIdPregunta())) {
                throw new BusinessException("No puedes enviar respuestas duplicadas para la misma pregunta");
            }

            Pregunta pregunta = preguntaRepository.findById(item.getIdPregunta())
                    .orElseThrow(() -> new ResourceNotFoundException("Pregunta no encontrada: " + item.getIdPregunta()));

            if (!pregunta.getEncuesta().getIdEncuesta().equals(idEncuesta)) {
                throw new BusinessException("La pregunta " + item.getIdPregunta() + " no pertenece a esta encuesta");
            }

            Opcion opcion = opcionRepository.findById(item.getIdOpcion())
                    .orElseThrow(() -> new ResourceNotFoundException("Opción no encontrada: " + item.getIdOpcion()));

            if (!opcion.getPregunta().getIdPregunta().equals(pregunta.getIdPregunta())) {
                throw new BusinessException("La opción seleccionada no corresponde a la pregunta indicada");
            }

            Respuesta respuesta = Respuesta.builder()
                    .participacion(participacion)
                    .pregunta(pregunta)
                    .opcion(opcion)
                    .build();

            respuestaRepository.save(respuesta);
        }

        participacion.setEstado(EstadoParticipacion.COMPLETADA);
        participacion.setFechaVoto(LocalDateTime.now());
        participacionRepository.save(participacion);
    }

    @Transactional(readOnly = true)
    public ResultadoVotanteDTO obtenerResultados(String email, Long idEncuesta) {
        Usuario usuario = getUsuarioPorEmail(email);
        Encuesta encuesta = encuestaRepository.findById(idEncuesta)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada"));

        Participacion participacion = participacionRepository
                .findByUsuarioIdUsuarioAndEncuestaIdEncuesta(usuario.getIdUsuario(), idEncuesta)
                .orElseThrow(() -> new BusinessException("No has participado en esta encuesta"));

        if (participacion.getEstado() != EstadoParticipacion.COMPLETADA) {
            throw new BusinessException("Debes emitir tu voto antes de consultar los resultados");
        }

        long totalParticipantes = participacionRepository
                .countByEncuestaIdEncuestaAndEstado(idEncuesta, EstadoParticipacion.COMPLETADA);

        List<Pregunta> preguntas = preguntaRepository.findByEncuestaIdEncuestaOrderByOrdenAsc(idEncuesta);
        List<PreguntaResultadoDTO> preguntasRes = new ArrayList<>();

        for (Pregunta preg : preguntas) {
            List<Opcion> opciones = opcionRepository.findByPreguntaIdPreguntaOrderByIdOpcionAsc(preg.getIdPregunta());
            List<OpcionResultadoDTO> opcionesRes = new ArrayList<>();

            long totalVotosPregunta = 0;
            List<Long> conteos = new ArrayList<>();

            for (Opcion op : opciones) {
                long votos = respuestaRepository.countByOpcionIdOpcion(op.getIdOpcion());
                conteos.add(votos);
                totalVotosPregunta += votos;
            }

            for (int i = 0; i < opciones.size(); i++) {
                Opcion op = opciones.get(i);
                long votos = conteos.get(i);
                double porcentaje = totalVotosPregunta > 0
                        ? Math.round((votos * 1000.0) / totalVotosPregunta) / 10.0
                        : 0.0;

                opcionesRes.add(OpcionResultadoDTO.builder()
                        .idOpcion(op.getIdOpcion())
                        .texto(op.getTexto())
                        .votos(votos)
                        .porcentaje(porcentaje)
                        .build());
            }

            preguntasRes.add(PreguntaResultadoDTO.builder()
                    .idPregunta(preg.getIdPregunta())
                    .texto(preg.getTexto())
                    .opciones(opcionesRes)
                    .build());
        }

        return ResultadoVotanteDTO.builder()
                .idEncuesta(encuesta.getIdEncuesta())
                .titulo(encuesta.getTitulo())
                .tipo(encuesta.getTipo().name())
                .totalParticipantes(totalParticipantes)
                .preguntas(preguntasRes)
                .build();
    }

    private ParticipacionDTO toParticipacionDTO(Participacion p) {
        Encuesta e = p.getEncuesta();
        return ParticipacionDTO.builder()
                .idParticipacion(p.getIdParticipacion())
                .idEncuesta(e.getIdEncuesta())
                .titulo(e.getTitulo())
                .descripcion(e.getDescripcion())
                .tipo(e.getTipo().name())
                .codigoPin(e.getCodigoPin())
                .estado(p.getEstado().name())
                .activa(e.getActiva())
                .fechaLimite(e.getFechaLimite())
                .fechaVoto(p.getFechaVoto())
                .build();
    }
}