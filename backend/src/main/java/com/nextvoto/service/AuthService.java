package com.nextvoto.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HexFormat;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;

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

    @Value("${app.mail.from:no-reply@nextvoto.com}")
    private String remitenteCorreo;

    // 12 caracteres de un alfabeto de 32 símbolos = 60 bits de entropía.
    private static final String ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom ALEATORIO_SEGURO = new SecureRandom();

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
    public void solicitarRecuperacion(RecuperarPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        var usuarioOpcional = usuarioRepository.findByEmail(email);

        // Respuesta indistinguible para correos registrados y no registrados.
        if (usuarioOpcional.isEmpty()) {
            return;
        }

        Usuario usuario = usuarioOpcional.get();
        String codigoRecuperacion = generarCodigoSeguro();

        // Revoca códigos anteriores y almacena únicamente el hash del nuevo código.
        tokenRepository.deleteByUsuarioAndTipo(usuario, TipoToken.RECUPERACION);
        Token tokenRec = Token.builder()
                .token(hashCodigo(codigoRecuperacion))
                .tipo(TipoToken.RECUPERACION)
                .expiracion(LocalDateTime.now().plusMinutes(15))
                .usuario(usuario)
                .build();
        tokenRepository.saveAndFlush(tokenRec);

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(remitenteCorreo);
            message.setTo(usuario.getEmail());
            message.setSubject("Recuperación de contraseña - NextVoto");
            message.setText("Hola " + usuario.getNombre()
                    + ",\n\nTu código de recuperación es: " + codigoRecuperacion
                    + "\nEste código expira en 15 minutos. Si no lo solicitaste, ignora este correo.");
            mailSender.send(message);
        } catch (MailException e) {
            // Si el SMTP falla, NO conservar un código no entregado y NO mostrarlo en logs.
            log.warn("No se pudo enviar el correo de recuperación (revisar SMTP): {}",
                    e.getClass().getSimpleName());
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        }
    }

    @Transactional
    public void restablecerPassword(RestablecerPasswordRequest request) {
        String codigo = request.getToken().trim().toUpperCase(Locale.ROOT);
        Token tokenValido = tokenRepository
                .findByTokenAndTipoAndExpiracionAfter(
                        hashCodigo(codigo), TipoToken.RECUPERACION, LocalDateTime.now())
                .orElseThrow(() -> new BusinessException("El código de recuperación es inválido o ha expirado"));

        Usuario usuario = tokenValido.getUsuario();
        usuario.setPassword(passwordEncoder.encode(request.getNuevaPassword()));
        usuarioRepository.save(usuario);

        // El código es de un solo uso. También se invalidan los anteriores.
        tokenRepository.deleteByUsuarioAndTipo(usuario, TipoToken.RECUPERACION);
    }

    private String generarCodigoSeguro() {
        StringBuilder codigo = new StringBuilder(12);
        for (int i = 0; i < 12; i++) {
            codigo.append(ALFABETO_CODIGO.charAt(ALEATORIO_SEGURO.nextInt(ALFABETO_CODIGO.length())));
        }
        return codigo.toString();
    }

    private String hashCodigo(String codigo) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(codigo.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no está disponible", e);
        }
    }
}
