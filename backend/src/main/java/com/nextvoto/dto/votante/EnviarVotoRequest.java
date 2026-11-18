package com.nextvoto.dto.votante;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EnviarVotoRequest {

    @NotEmpty(message = "Debes responder al menos una pregunta para enviar tu voto")
    @Valid
    private List<SeleccionRespuesta> respuestas;

    @Data
    public static class SeleccionRespuesta {
        @NotNull(message = "El ID de la pregunta es obligatorio")
        private Long idPregunta;

        @NotNull(message = "Debes seleccionar una opción para cada pregunta")
        private Long idOpcion;
    }
}