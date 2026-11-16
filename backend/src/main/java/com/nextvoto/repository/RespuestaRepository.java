package com.nextvoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Respuesta;

public interface RespuestaRepository extends JpaRepository<Respuesta, Long> {
    long countByOpcionIdOpcion(Long opcionId);
}