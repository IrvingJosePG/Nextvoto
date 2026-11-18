package com.nextvoto.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nextvoto.dto.auth.MessageResponse;
import com.nextvoto.dto.votante.EncuestaVotanteDTO;
import com.nextvoto.dto.votante.EnviarVotoRequest;
import com.nextvoto.dto.votante.ParticipacionDTO;
import com.nextvoto.dto.votante.ResultadoVotanteDTO;
import com.nextvoto.dto.votante.UnirsePinRequest;
import com.nextvoto.service.VotanteService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/votante")
@RequiredArgsConstructor
public class VotanteController {

    private final VotanteService votanteService;

    @PostMapping("/unirse")
    public ResponseEntity<ParticipacionDTO> unirsePorPin(
            Authentication authentication,
            @Valid @RequestBody UnirsePinRequest request
    ) {
        ParticipacionDTO participacion = votanteService.unirsePorPin(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(participacion);
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<ParticipacionDTO>> listarPendientes(Authentication authentication) {
        return ResponseEntity.ok(votanteService.obtenerPendientes(authentication.getName()));
    }

    @GetMapping("/historial")
    public ResponseEntity<Page<ParticipacionDTO>> listarHistorial(
            Authentication authentication,
            @PageableDefault(size = 10, sort = "fechaVoto", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(votanteService.obtenerHistorial(authentication.getName(), pageable));
    }

    @GetMapping("/encuestas/{id}")
    public ResponseEntity<EncuestaVotanteDTO> obtenerBoleta(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(votanteService.obtenerBoletaEncuesta(authentication.getName(), id));
    }

    @PostMapping("/encuestas/{id}/votar")
    public ResponseEntity<MessageResponse> emitirVoto(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody EnviarVotoRequest request
    ) {
        votanteService.emitirVoto(authentication.getName(), id, request);
        return ResponseEntity.ok(new MessageResponse("Tu voto ha sido registrado exitosamente"));
    }

    @GetMapping("/encuestas/{id}/resultados")
    public ResponseEntity<ResultadoVotanteDTO> verResultados(
            Authentication authentication,
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(votanteService.obtenerResultados(authentication.getName(), id));
    }
}