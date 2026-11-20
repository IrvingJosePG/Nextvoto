package com.nextvoto.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextvoto.dto.auth.AuthResponse;
import com.nextvoto.dto.auth.LoginRequest;
import com.nextvoto.dto.auth.MessageResponse;
import com.nextvoto.dto.auth.RecuperarPasswordRequest;
import com.nextvoto.dto.auth.RegisterRequest;
import com.nextvoto.dto.auth.RestablecerPasswordRequest;
import com.nextvoto.service.AuthService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        authService.logout(authHeader);
        return ResponseEntity.ok(new MessageResponse("Sesión cerrada correctamente"));
    }

    @PostMapping("/recuperar")
    public ResponseEntity<MessageResponse> recuperarPassword(
            @Valid @RequestBody RecuperarPasswordRequest request
    ) {
        String codigo = authService.solicitarRecuperacion(request);
        String mensaje = (request.getEmail() != null && !request.getEmail().isBlank())
                ? "Hemos enviado un código de verificación a tu correo electrónico"
                : "Hemos enviado un código de verificación a tu WhatsApp";
        return ResponseEntity.ok(new MessageResponse(mensaje, codigo));
    }

    @PostMapping("/restablecer")
    public ResponseEntity<MessageResponse> restablecerPassword(
            @Valid @RequestBody RestablecerPasswordRequest request
    ) {
        authService.restablecerPassword(request);
        return ResponseEntity.ok(new MessageResponse("Contraseña actualizada correctamente"));
    }
}