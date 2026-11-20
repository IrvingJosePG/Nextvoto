package com.nextvoto.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RecuperarPasswordRequest {

    @Email(message = "El formato del correo electrónico no es válido")
    private String email;

    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "El formato del número telefónico no es válido")
    private String telefono;
}