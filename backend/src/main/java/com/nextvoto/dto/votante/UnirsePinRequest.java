package com.nextvoto.dto.votante;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UnirsePinRequest {

    @NotBlank(message = "El código PIN es obligatorio")
    @Size(min = 4, max = 10, message = "El código PIN debe tener entre 4 y 10 caracteres")
    private String codigoPin;
}