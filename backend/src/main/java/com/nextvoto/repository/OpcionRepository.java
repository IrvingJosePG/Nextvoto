package com.nextvoto.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Opcion;

public interface OpcionRepository extends JpaRepository<Opcion, Long> {
}