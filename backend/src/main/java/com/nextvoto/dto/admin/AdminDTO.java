package com.nextvoto.dto.admin;

import java.time.LocalDateTime;

import com.nextvoto.dto.auth.RegisterRequest;
import com.nextvoto.entity.Encuesta.TipoEncuesta;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

public class AdminDTO {

    public record Resumen(long usuariosRegistrados, long usuariosActivos,
            long encuestasTotales, long encuestasAbiertas, long votosEmitidos) {
    }

    public record UsuarioListado(Long idUsuario, String nombre, String email,
            String telefono, String rol, boolean activo) {
    }

    public record EncuestaListado(Long idEncuesta, String titulo, TipoEncuesta tipo,
            String moderador, String correoModerador, LocalDateTime fechaLimite, boolean activa, boolean abierta,
            long participantes) {
    }

    @Getter
    @Setter
    public static class NuevoUsuario extends RegisterRequest {
        @NotBlank(message = "Selecciona un rol")
        private String rol;
    }

    public record CambioRol(@NotBlank(message = "Selecciona un rol") String rol) {
    }

    public record CambioEstado(@NotNull(message = "Indica el estado de la cuenta") Boolean activo) {
    }
}
