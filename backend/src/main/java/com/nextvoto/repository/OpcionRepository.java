package com.nextvoto.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Opcion;

public interface OpcionRepository extends JpaRepository<Opcion, Long> {
    List<Opcion> findByPreguntaIdPreguntaOrderByIdOpcionAsc(Long idPregunta);
}