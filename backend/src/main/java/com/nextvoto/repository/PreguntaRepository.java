package com.nextvoto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Pregunta;

public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
    List<Pregunta> findByEncuestaIdEncuestaOrderByOrdenAsc(Long idEncuesta);
}