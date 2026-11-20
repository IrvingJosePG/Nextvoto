package com.nextvoto.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.nextvoto.dto.auth.AuthResponse;
import com.nextvoto.dto.auth.LoginRequest;
import com.nextvoto.dto.auth.RecuperarPasswordRequest;
import com.nextvoto.dto.auth.RegisterRequest;
import com.nextvoto.dto.auth.RestablecerPasswordRequest;
import com.nextvoto.entity.Rol;
import com.nextvoto.entity.Token;
import com.nextvoto.entity.Token.TipoToken;
import com.nextvoto.entity.Usuario;
import com.nextvoto.exception.BusinessException;
import com.nextvoto.exception.ResourceNotFoundException;
import com.nextvoto.repository.RolRepository;
import com.nextvoto.repository.TokenRepository;
import com.nextvoto.repository.UsuarioRepository;
import com.nextvoto.security.JwtService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!usuario.getActivo()) {
            throw new BusinessException("Tu cuenta se encuentra desactivada. Contacta al administrador.");
        }

        return crearSesion(usuario);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        return crearSesion(crearUsuario(request, "VOTANTE"));
    }

    Usuario crearUsuario(RegisterRequest request, String rol) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (usuarioRepository.existsByEmail(email)) {
            throw new BusinessException("El correo electrónico ya está registrado");
        }

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono().trim())
                .activo(true)
                .rol(buscarRol(rol))
                .build();

        try {
            return usuarioRepository.saveAndFlush(nuevoUsuario);
        } catch (DataIntegrityViolationException e) {
            throw new BusinessException("El correo electrónico ya está registrado");
        }
    }

    Rol buscarRol(String rol) {
        return rolRepository.findByNombre(rol)
                .orElseThrow(() -> new ResourceNotFoundException("Rol " + rol + " no configurado"));
    }

    private AuthResponse crearSesion(Usuario usuario) {
        return AuthResponse.builder()
                .token(jwtService.generateToken(usuario))
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().getNombre())
                .build();
    }

    @Transactional
    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BusinessException("Token de autorización no proporcionado");
        }

        String jwt = authHeader.substring(7);
        String email = jwtService.extractUsername(jwt);
        Date expDate = jwtService.extractExpiration(jwt);

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!tokenRepository.existsByTokenAndTipo(jwt, TipoToken.BLACKLIST)) {
            Token blacklisted = Token.builder()
                    .token(jwt)
                    .tipo(TipoToken.BLACKLIST)
                    .expiracion(expDate.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime())
                    .usuario(usuario)
                    .build();
            tokenRepository.save(blacklisted);
        }
    }

    @Transactional
    public String solicitarRecuperacion(RecuperarPasswordRequest request) {
        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("No existe una cuenta asociada a ese correo"));

        String codigoRecuperacion = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Token tokenRec = Token.builder()
                .token(codigoRecuperacion)
                .tipo(TipoToken.RECUPERACION)
                .expiracion(LocalDateTime.now().plusMinutes(15))
                .usuario(usuario)
                .build();
        tokenRepository.save(tokenRec);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("no-reply@nextvoto.com");
            message.setTo(usuario.getEmail());
            message.setSubject("Recuperación de contraseña - NextVoto");
            message.setText("Hola " + usuario.getNombre() + ",\n\nTu código de recuperación es: " + codigoRecuperacion +
                    "\nEste código expira en 15 minutos.");
            mailSender.send(message);
        } catch (Exception e) {
            log.warn("No se pudo enviar correo SMTP en entorno local. Código generado para {}: {}", usuario.getEmail(), codigoRecuperacion);
        }

        return codigoRecuperacion;
    }

    @Transactional
    public void restablecerPassword(RestablecerPasswordRequest request) {
        Token tokenValido = tokenRepository
                .findByTokenAndTipoAndExpiracionAfter(request.getToken().trim(), TipoToken.RECUPERACION, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException("El código de recuperación es inválido o ha expirado"));

        Usuario usuario = tokenValido.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);

        // Invalidar el token usado eliminándolo
        tokenRepository.delete(tokenValido);
    }
}
