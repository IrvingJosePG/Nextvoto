package com.nextvoto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "participaciones", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "encuesta_id"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Participacion {

    public enum EstadoParticipacion {
        PENDIENTE, COMPLETADA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_participacion")
    private Long idParticipacion;

    @Column(name = "fecha_voto")
    private LocalDateTime fechaVoto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private EstadoParticipacion estado = EstadoParticipacion.PENDIENTE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encuesta_id", nullable = false)
    private Encuesta encuesta;

    @OneToMany(mappedBy = "participacion", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Respuesta> respuestas = new ArrayList<>();
}