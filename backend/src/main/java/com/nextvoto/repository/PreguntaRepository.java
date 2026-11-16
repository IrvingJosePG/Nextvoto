package com.nextvoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Pregunta;

public interface PreguntaRepository extends JpaRepository<Pregunta, Long> {
}