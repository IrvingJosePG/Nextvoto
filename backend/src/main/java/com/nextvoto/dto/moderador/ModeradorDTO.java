package com.nextvoto.dto.moderador;

import java.time.LocalDateTime;
import java.util.List;

import com.nextvoto.dto.moderador.ModeradorDTO.PreguntaResultado;
import com.nextvoto.entity.Encuesta.TipoEncuesta;
import com.nextvoto.entity.Participacion.EstadoParticipacion;
import com.nextvoto.entity.TipoRespuesta;
import com.nextvoto.entity.TipoVoto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
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
            long participantes, long pendientes, int totalPreguntas, Integer maxParticipantes) {
    }

    public record OpcionResultado(Long idOpcion, String texto, long votos, double porcentaje) {
    }

    public record PreguntaResultado(Long idPregunta, String texto, List<OpcionResultado> opciones) {
    }

    public record Resultados(Long idEncuesta, String titulo, TipoEncuesta tipo, String tipoGrafica,
            String codigoPin, LocalDateTime fechaLimite, boolean activa, boolean abierta,
            long totalParticipantes, List<PreguntaResultado> preguntas) {
    }

    // Una fila = una persona dentro de un cuestionario del moderador.
    // Nunca incluye la opción elegida: el voto es privado.
    public record Participante(Long idParticipacion, Long idUsuario, String nombre, String email,
            boolean cuentaActiva, Long idEncuesta, String tituloEncuesta, TipoEncuesta tipoEncuesta,
            EstadoParticipacion estado, LocalDateTime fechaVoto) {
    }

    // ---------- Peticiones ----------

    public record NuevaPregunta(
            @NotBlank(message = "Escribe el enunciado de la pregunta")
            @Size(max = 255, message = "El enunciado no puede pasar de 255 caracteres")
            String texto,

            @NotNull(message = "Agrega las opciones de la pregunta")
            @Size(min = 2, max = 10, message = "Cada pregunta necesita entre 2 y 10 opciones")
            List<@NotBlank(message = "Las opciones no pueden estar vacías")
                 @Size(max = 200, message = "Cada opción admite máximo 200 caracteres") String> opciones,

            @NotNull(message = "Elige si la pregunta es de opción única o múltiple")
            TipoRespuesta tipoRespuesta,

            @Min(value = 1, message = "El mínimo de selecciones debe ser al menos 1")
            Integer minSelecciones,

            @Min(value = 1, message = "El máximo de selecciones debe ser al menos 1")
            Integer maxSelecciones) {
    }

    public record NuevaEncuesta(
            @NotBlank(message = "El título es obligatorio")
            @Size(max = 200, message = "El título no puede pasar de 200 caracteres")
            String titulo,

            @Size(max = 2000, message = "La descripción no puede pasar de 2000 caracteres")
            String descripcion,

            @NotNull(message = "Selecciona el tipo: votación o encuesta")
            TipoEncuesta tipo,

            @Size(max = 150, message = "El campo «dirigido a» no puede pasar de 150 caracteres")
            String dirigidoA,

            @NotNull(message = "Elige si el voto es anónimo o identificado")
            TipoVoto tipoVoto,

            @NotNull(message = "Indica si se permiten comentarios")
            Boolean permiteComentarios,

            @Min(value = 1, message = "El máximo de participantes debe ser al menos 1")
            Integer maxParticipantes,

            @NotNull(message = "Indica si solo votan usuarios con cuenta")
            Boolean soloRegistrados,

            @NotNull(message = "La fecha de inicio es obligatoria")
            LocalDateTime fechaInicio,

            @NotNull(message = "La fecha límite es obligatoria")
            @Future(message = "La fecha límite debe ser posterior al momento actual")
            LocalDateTime fechaLimite,

            @NotBlank(message = "Elige el tipo de gráfica")
            String tipoGrafica,

            @NotEmpty(message = "Agrega al menos una pregunta")
            @Size(max = 15, message = "Una encuesta admite máximo 15 preguntas")
            @Valid
            List<NuevaPregunta> preguntas) {
    }
}