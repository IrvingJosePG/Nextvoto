package com.nextvoto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.nextvoto.entity.Usuario;

import jakarta.persistence.LockModeType;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    Optional<Usuario> findByTelefono(String telefono);
    boolean existsByEmail(String email);
    long countByActivoTrue();

    @Lock(LockModeType.PESSIMISTIC_READ)
    @Query("SELECT u FROM Usuario u WHERE u.email = :email")
    Optional<Usuario> buscarParaParticipar(@Param("email") String email);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT u FROM Usuario u WHERE u.idUsuario = :id OR u.email = :email ORDER BY u.idUsuario")
    List<Usuario> buscarParaAdministrar(@Param("id") Long id, @Param("email") String email);

    @Query("SELECT u FROM Usuario u WHERE " +
           "(:busqueda IS NULL OR LOWER(u.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :busqueda, '%'))) AND " +
           "(:rol IS NULL OR u.rol.nombre = :rol)")
    Page<Usuario> buscarConFiltros(@Param("busqueda") String busqueda, @Param("rol") String rol, Pageable pageable);
}
