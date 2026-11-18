package com.nextvoto.dto.votante;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ParticipacionDTO {
    private Long idParticipacion;
    private Long idEncuesta;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String codigoPin;
    private String estado;
    private Boolean activa;
    private LocalDateTime fechaLimite;
    private LocalDateTime fechaVoto;
}