package com.nextvoto.dto.votante;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EncuestaVotanteDTO {
    private Long idEncuesta;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String codigoPin;
    private LocalDateTime fechaLimite;
    private List<PreguntaItemDTO> preguntas;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PreguntaItemDTO {
        private Long idPregunta;
        private String texto;
        private Integer orden;
        private List<OpcionItemDTO> opciones;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpcionItemDTO {
        private Long idOpcion;
        private String texto;
    }
}