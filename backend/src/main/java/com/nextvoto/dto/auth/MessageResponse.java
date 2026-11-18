package com.nextvoto.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse {
    private String message;
    private String detalle;

    public MessageResponse(String message) {
        this.message = message;
    }
}