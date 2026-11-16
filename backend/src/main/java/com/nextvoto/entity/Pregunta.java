package com.nextvoto.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "preguntas")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pregunta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pregunta")
    private Long idPregunta;

    @Column(nullable = false, length = 255)
    private String texto;

    @Column(nullable = false)
    private Integer orden;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "encuesta_id", nullable = false)
    private Encuesta encuesta;

    @OneToMany(mappedBy = "pregunta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Opcion> opciones = new ArrayList<>();
}