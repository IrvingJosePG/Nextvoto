package com.nextvoto.service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.nextvoto.security.CustomUserDetailsService;
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
    private final CustomUserDetailsService userDetailsService;
    private final NotificacionService notificacionService;

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!usuario.getActivo()) {
            throw new BusinessException("Tu cuenta se encuentra desactivada. Contacta al administrador.");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(usuario.getEmail());
        String jwt = jwtService.generateToken(userDetails, usuario.getRol().getNombre(), usuario.getNombre());

        return AuthResponse.builder()
                .token(jwt)
                .idUsuario(usuario.getIdUsuario())
                .nombre(usuario.getNombre())
                .email(usuario.getEmail())
                .rol(usuario.getRol().getNombre())
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El correo electrónico ya está registrado");
        }

        Rol rolVotante = rolRepository.findByNombre("VOTANTE")
                .orElseThrow(() -> new ResourceNotFoundException("Rol VOTANTE no configurado en la base de datos"));

        Usuario nuevoUsuario = Usuario.builder()
                .nombre(request.getNombre().trim())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .telefono(request.getTelefono().trim())
                .activo(true)
                .rol(rolVotante)
                .build();

        Usuario guardado = usuarioRepository.save(nuevoUsuario);

        UserDetails userDetails = userDetailsService.loadUserByUsername(guardado.getEmail());
        String jwt = jwtService.generateToken(userDetails, guardado.getRol().getNombre(), guardado.getNombre());

        return AuthResponse.builder()
                .token(jwt)
                .idUsuario(guardado.getIdUsuario())
                .nombre(guardado.getNombre())
                .email(guardado.getEmail())
                .rol(guardado.getRol().getNombre())
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
        boolean tieneEmail = request.getEmail() != null && !request.getEmail().isBlank();
        boolean tieneTelefono = request.getTelefono() != null && !request.getTelefono().isBlank();

        if (!tieneEmail && !tieneTelefono) {
            throw new BusinessException("Debes proporcionar un correo electrónico o un número telefónico");
        }

        Usuario usuario;
        if (tieneEmail) {
            usuario = usuarioRepository.findByEmail(request.getEmail().trim().toLowerCase())
                    .orElseThrow(() -> new ResourceNotFoundException("No existe una cuenta asociada a ese correo electrónico"));
        } else {
            String telLimpio = request.getTelefono().replaceAll("\\s+", "");
            usuario = usuarioRepository.findByTelefono(telLimpio)
                    .or(() -> usuarioRepository.findByTelefono("+52" + telLimpio))
                    .orElseThrow(() -> new ResourceNotFoundException("No existe una cuenta asociada a ese número telefónico"));
        }

        String codigoRecuperacion = String.format("%06d", new SecureRandom().nextInt(1_000_000));

        Token tokenRec = Token.builder()
                .token(codigoRecuperacion)
                .tipo(TipoToken.RECUPERACION)
                .expiracion(LocalDateTime.now().plusMinutes(15))
                .usuario(usuario)
                .build();
        tokenRepository.save(tokenRec);

        if (tieneEmail) {
            notificacionService.enviarPinCorreo(usuario.getEmail(), usuario.getNombre(), codigoRecuperacion);
        } else {
            notificacionService.enviarPinWhatsApp(usuario.getTelefono(), usuario.getNombre(), codigoRecuperacion);
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

        tokenRepository.delete(tokenValido);
    }
}