package com.nextvoto.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RestablecerPasswordRequest {

    @NotBlank(message = "El token de recuperación es obligatorio")
    private String token;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#._-])[A-Za-z\\d@$!%*?&#._-]{8,}$",
        message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial"
    )
    private String nuevaPassword;
}