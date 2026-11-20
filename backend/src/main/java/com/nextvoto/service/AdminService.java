package com.nextvoto.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextvoto.dto.admin.AdminDTO.EncuestaListado;
import com.nextvoto.dto.admin.AdminDTO.NuevoUsuario;
import com.nextvoto.dto.admin.AdminDTO.Resumen;
import com.nextvoto.dto.admin.AdminDTO.UsuarioListado;
import com.nextvoto.entity.Encuesta;
import com.nextvoto.entity.Participacion.EstadoParticipacion;
import com.nextvoto.entity.Usuario;
import com.nextvoto.exception.BusinessException;
import com.nextvoto.exception.ResourceNotFoundException;
import com.nextvoto.repository.EncuestaRepository;
import com.nextvoto.repository.ParticipacionRepository;
import com.nextvoto.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminService {

    private final UsuarioRepository usuarioRepository;
    private final EncuestaRepository encuestaRepository;
    private final ParticipacionRepository participacionRepository;
    private final AuthService authService;

    public Resumen obtenerResumen() {
        return new Resumen(
                usuarioRepository.count(),
                usuarioRepository.countByActivoTrue(),
                encuestaRepository.count(),
                encuestaRepository.countByActivaTrueAndFechaLimiteAfter(LocalDateTime.now()),
                participacionRepository.countByEstado(EstadoParticipacion.COMPLETADA));
    }

    public List<UsuarioListado> listarUsuarios() {
        return usuarioRepository.findAll(Sort.by("nombre", "idUsuario"))
                .stream().map(this::datosUsuario).toList();
    }

    @Transactional
    public UsuarioListado crearUsuario(NuevoUsuario datos) {
        validarRolAsignable(datos.getRol());
        return datosUsuario(authService.crearUsuario(datos, datos.getRol()));
    }

    @Transactional
    public void cambiarRol(Long id, String rol, String correoAdmin) {
        validarRolAsignable(rol);
        Usuario usuario = usuarioParaAdministrar(id, correoAdmin);
        usuario.setRol(authService.buscarRol(rol));
    }

    @Transactional
    public void cambiarEstado(Long id, boolean activo, String correoAdmin) {
        Usuario usuario = usuarioParaAdministrar(id, correoAdmin);
        usuario.setActivo(activo);
    }

    @Transactional
    public void eliminarUsuario(Long id, String correoAdmin) {
        Usuario usuario = usuarioParaAdministrar(id, correoAdmin);

        if (encuestaRepository.existsByModeradorIdUsuario(id)
                || participacionRepository.existsByUsuarioIdUsuarioAndEstado(id, EstadoParticipacion.COMPLETADA)) {
            throw new BusinessException("Esta cuenta tiene encuestas creadas o votos emitidos. Puedes suspenderla.");
        }

        usuarioRepository.delete(usuario);
    }

    public List<EncuestaListado> listarEncuestas() {
        LocalDateTime ahora = LocalDateTime.now();

        return encuestaRepository.findAllByOrderByIdEncuestaDesc().stream()
                .map(encuesta -> new EncuestaListado(
                        encuesta.getIdEncuesta(), encuesta.getTitulo(), encuesta.getTipo(),
                        encuesta.getModerador().getNombre(), encuesta.getModerador().getEmail(),
                        encuesta.getFechaLimite(), encuesta.getActiva(),
                        encuesta.estaAbierta(ahora), participacionRepository.countByEncuestaIdEncuestaAndEstado(
                                encuesta.getIdEncuesta(), EstadoParticipacion.COMPLETADA)))
                .toList();
    }

    @Transactional
    public void cerrarEncuesta(Long id) {
        buscarEncuestaParaEditar(id).setActiva(false);
    }

    @Transactional
    public void eliminarEncuesta(Long id) {
        encuestaRepository.delete(buscarEncuestaParaEditar(id));
    }

    private UsuarioListado datosUsuario(Usuario usuario) {
        return new UsuarioListado(usuario.getIdUsuario(), usuario.getNombre(), usuario.getEmail(),
                usuario.getTelefono(), usuario.getRol().getNombre(), usuario.getActivo());
    }

    private void validarRolAsignable(String rol) {
        if (!"VOTANTE".equals(rol) && !"MODERADOR".equals(rol)) {
            throw new BusinessException("Solo puedes asignar el rol VOTANTE o MODERADOR.");
        }
    }

    private Usuario usuarioParaAdministrar(Long id, String correoAdmin) {
        List<Usuario> cuentas = usuarioRepository.buscarParaAdministrar(id, correoAdmin);
        boolean adminActivo = cuentas.stream().anyMatch(cuenta -> cuenta.getEmail().equals(correoAdmin)
                && cuenta.getActivo() && "ADMIN".equals(cuenta.getRol().getNombre()));
        if (!adminActivo) {
            throw new AccessDeniedException("Se requiere una cuenta de administrador activa");
        }

        Usuario usuario = cuentas.stream().filter(cuenta -> cuenta.getIdUsuario().equals(id)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (usuario.getEmail().equals(correoAdmin)) {
            throw new BusinessException("No puedes cambiar el estado o rol de tu propia cuenta ni eliminarla.");
        }
        return usuario;
    }

    private Encuesta buscarEncuestaParaEditar(Long id) {
        return encuestaRepository.buscarParaEditar(id)
                .orElseThrow(() -> new ResourceNotFoundException("Encuesta no encontrada"));
    }
}
