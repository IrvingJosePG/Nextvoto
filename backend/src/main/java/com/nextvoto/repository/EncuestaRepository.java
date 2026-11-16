package com.nextvoto.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nextvoto.entity.Encuesta;

public interface EncuestaRepository extends JpaRepository<Encuesta, Long> {
    Optional<Encuesta> findByCodigoPin(String codigoPin);
    boolean existsByCodigoPin(String codigoPin);

    @Query("SELECT e FROM Encuesta e WHERE e.moderador.idUsuario = :moderadorId AND " +
           "(:titulo IS NULL OR LOWER(e.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))) AND " +
           "(:activa IS NULL OR e.activa = :activa)")
    Page<Encuesta> buscarPorModeradorConFiltros(
            @Param("moderadorId") Long moderadorId,
            @Param("titulo") String titulo,
            @Param("activa") Boolean activa,
            Pageable pageable);

    @Query("SELECT e FROM Encuesta e WHERE " +
           "(:titulo IS NULL OR LOWER(e.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))) AND " +
           "(:activa IS NULL OR e.activa = :activa)")
    Page<Encuesta> buscarTodasConFiltros(
            @Param("titulo") String titulo,
            @Param("activa") Boolean activa,
            Pageable pageable);
}