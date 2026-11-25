package com.nextvoto.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nextvoto.dto.auth.AuthResponse;
import com.nextvoto.dto.auth.GoogleLoginRequest;
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

    // 12 caracteres de un alfabeto de 32 símbolos = 60 bits de entropía.
    private static final String ALFABETO_CODIGO = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom ALEATORIO_SEGURO = new SecureRandom();

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final TokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final NotificacionService notificacionService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final HttpClient httpClient = HttpClient.newHttpClient();

    @Value("${google.client.id}")
    private String googleClientId;

    // =========================================================================
    // Flujos públicos de autenticación
    // =========================================================================

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

    @Transactional
    public AuthResponse loginConGoogle(GoogleLoginRequest request) {
        JsonNode payload = verificarTokenGoogle(request.getCredential());

        String email = payload.path("email").asText("").trim().toLowerCase(Locale.ROOT);
        if (email.isEmpty()) {
            throw new BusinessException("Google no proporcionó un correo electrónico válido");
        }

        String nombreGoogle = payload.path("name").asText("").trim();
        if (nombreGoogle.isEmpty()) {
            nombreGoogle = email.substring(0, email.indexOf('@'));
        }
        if (nombreGoogle.length() > 100) {
            nombreGoogle = nombreGoogle.substring(0, 100);
        }

        final String nombreFinal = nombreGoogle;
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseGet(() -> registrarUsuarioGoogle(nombreFinal, email));

        if (!usuario.getActivo()) {
            throw new BusinessException("Tu cuenta se encuentra desactivada. Contacta al administrador.");
        }

        return crearSesion(usuario);
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
        boolean tieneEmail = request.getEmail() != null && !request.getEmail().isBlank();
        boolean tieneTelefono = request.getTelefono() != null && !request.getTelefono().isBlank();

        if (!tieneEmail && !tieneTelefono) {
            throw new BusinessException("Debes proporcionar un correo electrónico o un número telefónico");
        }

        Optional<Usuario> usuarioOpcional;
        if (tieneEmail) {
            String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
            usuarioOpcional = usuarioRepository.findByEmail(email);
        } else {
            String telLimpio = request.getTelefono().replaceAll("\\s+", "");
            usuarioOpcional = usuarioRepository.findByTelefono(telLimpio)
                    .or(() -> usuarioRepository.findByTelefono("+52" + telLimpio));
        }

        // Respuesta indistinguible para cuentas registradas y no registradas.
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

        if (tieneEmail) {
            notificacionService.enviarPinCorreo(usuario.getEmail(), usuario.getNombre(), codigoRecuperacion);
        } else {
            notificacionService.enviarPinWhatsApp(usuario.getTelefono(), usuario.getNombre(), codigoRecuperacion);
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

    // =========================================================================
    // Métodos internos y auxiliares
    // =========================================================================

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

    private Usuario registrarUsuarioGoogle(String nombre, String email) {
        Usuario nuevo = Usuario.builder()
                .nombre(nombre)
                .email(email)
                .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                .telefono("0000000000")
                .activo(true)
                .rol(buscarRol("VOTANTE"))
                .build();

        try {
            return usuarioRepository.saveAndFlush(nuevo);
        } catch (DataIntegrityViolationException e) {
            return usuarioRepository.findByEmail(email)
                    .orElseThrow(() -> new BusinessException("No se pudo registrar la cuenta de Google"));
        }
    }

    private JsonNode verificarTokenGoogle(String accessToken) {
        try {
            String tokenInfoUrl = "https://oauth2.googleapis.com/tokeninfo?access_token="
                    + URLEncoder.encode(accessToken, StandardCharsets.UTF_8);

            HttpRequest tokenInfoReq = HttpRequest.newBuilder()
                    .uri(URI.create(tokenInfoUrl))
                    .GET()
                    .build();

            HttpResponse<String> tokenInfoRes = httpClient.send(tokenInfoReq, HttpResponse.BodyHandlers.ofString());
            if (tokenInfoRes.statusCode() != 200) {
                throw new BusinessException("El token de Google es inválido o ha expirado");
            }

            JsonNode tokenInfo = objectMapper.readTree(tokenInfoRes.body());
            String audiencia = tokenInfo.path("aud").asText("");
            JsonNode verifiedNode = tokenInfo.get("email_verified");
            boolean emailVerificado = verifiedNode != null
                    && ("true".equalsIgnoreCase(verifiedNode.asText()) || verifiedNode.asBoolean(false));

            if (!googleClientId.equals(audiencia) || !emailVerificado) {
                throw new BusinessException("La cuenta de Google no pudo ser verificada para NextVoto");
            }

            HttpRequest userInfoReq = HttpRequest.newBuilder()
                    .uri(URI.create("https://www.googleapis.com/oauth2/v3/userinfo"))
                    .header("Authorization", "Bearer " + accessToken)
                    .GET()
                    .build();

            HttpResponse<String> userInfoRes = httpClient.send(userInfoReq, HttpResponse.BodyHandlers.ofString());
            if (userInfoRes.statusCode() == 200) {
                return objectMapper.readTree(userInfoRes.body());
            }

            return tokenInfo;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("Error verificando token de Google: {}", e.getMessage());
            throw new BusinessException("Error al comunicarse con Google para iniciar sesión");
        }
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