package com.nextvoto.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.nextvoto.entity.Participacion;
import com.nextvoto.entity.Participacion.EstadoParticipacion;

public interface ParticipacionRepository extends JpaRepository<Participacion, Long> {
    Optional<Participacion> findByUsuarioIdUsuarioAndEncuestaIdEncuesta(Long usuarioId, Long encuestaId);
    boolean existsByUsuarioIdUsuarioAndEncuestaIdEncuesta(Long usuarioId, Long encuestaId);
    List<Participacion> findByUsuarioIdUsuarioAndEstado(Long usuarioId, EstadoParticipacion estado);
    List<Participacion> findByUsuarioIdUsuarioAndEstadoOrderByIdParticipacionDesc(Long usuarioId, EstadoParticipacion estado);
    Page<Participacion> findByUsuarioIdUsuarioAndEstado(Long usuarioId, EstadoParticipacion estado, Pageable pageable);
    long countByEncuestaIdEncuestaAndEstado(Long encuestaId, EstadoParticipacion estado);
    long countByEstado(EstadoParticipacion estado);
    boolean existsByUsuarioIdUsuarioAndEstado(Long usuarioId, EstadoParticipacion estado);
}
