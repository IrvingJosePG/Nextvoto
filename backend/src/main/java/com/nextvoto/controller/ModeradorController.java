package com.nextvoto.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.nextvoto.dto.moderador.ModeradorDTO.EncuestaResumen;
import com.nextvoto.dto.moderador.ModeradorDTO.NuevaEncuesta;
import com.nextvoto.dto.moderador.ModeradorDTO.Resultados;
import com.nextvoto.dto.moderador.ModeradorDTO.Resumen;
import com.nextvoto.service.ModeradorService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/moderador")
@RequiredArgsConstructor
public class ModeradorController {

    private final ModeradorService moderadorService;

    @GetMapping("/resumen")
    public Resumen resumen(Principal moderador) {
        return moderadorService.obtenerResumen(moderador.getName());
    }

    @GetMapping("/encuestas")
    public List<EncuestaResumen> encuestas(Principal moderador) {
        return moderadorService.listarEncuestas(moderador.getName());
    }

    @PostMapping("/encuestas")
    @ResponseStatus(HttpStatus.CREATED)
    public EncuestaResumen crear(@Valid @RequestBody NuevaEncuesta datos, Principal moderador) {
        return moderadorService.crearEncuesta(moderador.getName(), datos);
    }

    @GetMapping("/encuestas/{id}/resultados")
    public Resultados resultados(@PathVariable Long id, Principal moderador) {
        return moderadorService.obtenerResultados(moderador.getName(), id);
    }

    @PatchMapping("/encuestas/{id}/cerrar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cerrar(@PathVariable Long id, Principal moderador) {
        moderadorService.cerrarEncuesta(moderador.getName(), id);
    }

    @DeleteMapping("/encuestas/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable Long id, Principal moderador) {
        moderadorService.eliminarEncuesta(moderador.getName(), id);
    }
}