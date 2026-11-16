package com.nextvoto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "encuestas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Encuesta {

    public enum TipoEncuesta {
        VOTACION, ENCUESTA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_encuesta")
    private Long idEncuesta;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEncuesta tipo;

    @Column(name = "codigo_pin", nullable = false, unique = true, length = 10)
    private String codigoPin;

    @Column(name = "fecha_limite", nullable = false)
    private LocalDateTime fechaLimite;

    @Column(nullable = false)
    private Boolean activa = true;

    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "moderador_id", nullable = false)
    private Usuario moderador;

    @OneToMany(mappedBy = "encuesta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("orden ASC")
    @Builder.Default
    private List<Pregunta> preguntas = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.creadoEn == null) this.creadoEn = LocalDateTime.now();
        if (this.activa == null) this.activa = true;
    }
}