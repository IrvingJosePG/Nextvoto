package com.nextvoto.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Pattern(
        regexp = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#._-])[A-Za-z\\d@$!%*?&#._-]{8,}$",
        message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial"
    )
    private String password;

    @NotBlank(message = "El teléfono es obligatorio")
    @Pattern(
        regexp = "^\\+?[1-9]\\d{9,14}$",
        message = "Ingresa un número de teléfono válido con código de país (ej. +529512345678)"
    )
    private String telefono;
}