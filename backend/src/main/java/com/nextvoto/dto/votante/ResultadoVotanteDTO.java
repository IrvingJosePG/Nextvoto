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
public class ResultadoVotanteDTO {
    private Long idEncuesta;
    private String titulo;
    private String descripcion;
    private String tipoGrafica;
    private long totalParticipantes;
    private List<PreguntaResultadoDTO> preguntas;
    private LocalDateTime fechaLimite;
    private LocalDateTime fechaVoto;
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PreguntaResultadoDTO {
        private Long idPregunta;
        private String texto;
        private List<OpcionResultadoDTO> opciones;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OpcionResultadoDTO {
        private Long idOpcion;
        private String texto;
        private long votos;
        private double porcentaje;
    }
}