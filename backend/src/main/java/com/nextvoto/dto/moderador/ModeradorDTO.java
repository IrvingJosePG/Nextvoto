package com.nextvoto.dto.moderador;

import java.time.LocalDateTime;
import java.util.List;

import com.nextvoto.entity.Encuesta.TipoEncuesta;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ModeradorDTO {

    // ---------- Respuestas ----------

    public record Resumen(long encuestasActivas, long encuestasTotales,
            long votosEmitidos, long tasaParticipacion) {
    }

    public record EncuestaResumen(Long idEncuesta, String titulo, String descripcion, TipoEncuesta tipo,
            String codigoPin, LocalDateTime fechaLimite, boolean activa, boolean abierta,
            long participantes, long pendientes, int totalPreguntas) {
    }

    public record OpcionResultado(Long idOpcion, String texto, long votos, double porcentaje) {
    }

    public record PreguntaResultado(Long idPregunta, String texto, List<OpcionResultado> opciones) {
    }

    public record Resultados(Long idEncuesta, String titulo, TipoEncuesta tipo, String codigoPin,
            LocalDateTime fechaLimite, boolean activa, boolean abierta, long totalParticipantes,
            List<PreguntaResultado> preguntas) {
    }

    // ---------- Peticiones ----------

    public record NuevaPregunta(
            @NotBlank(message = "Escribe el enunciado de la pregunta")
            @Size(max = 255, message = "El enunciado no puede pasar de 255 caracteres")
            String texto,

            @NotNull(message = "Agrega las opciones de la pregunta")
            @Size(min = 2, max = 10, message = "Cada pregunta necesita entre 2 y 10 opciones")
            List<@NotBlank(message = "Las opciones no pueden estar vacías")
                 @Size(max = 200, message = "Cada opción admite máximo 200 caracteres") String> opciones) {
    }

    public record NuevaEncuesta(
            @NotBlank(message = "El título es obligatorio")
            @Size(max = 200, message = "El título no puede pasar de 200 caracteres")
            String titulo,

            @Size(max = 2000, message = "La descripción no puede pasar de 2000 caracteres")
            String descripcion,

            @NotNull(message = "Selecciona el tipo: votación o encuesta")
            TipoEncuesta tipo,

            @NotNull(message = "La fecha límite es obligatoria")
            @Future(message = "La fecha límite debe ser posterior al momento actual")
            LocalDateTime fechaLimite,

            @NotEmpty(message = "Agrega al menos una pregunta")
            @Size(max = 15, message = "Un cuestionario admite máximo 15 preguntas")
            @Valid
            List<NuevaPregunta> preguntas) {
    }
}