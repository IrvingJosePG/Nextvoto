CREATE TABLE roles (
    id_rol BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rol_id BIGINT NOT NULL,
    CONSTRAINT fk_usuarios_rol FOREIGN KEY (rol_id) REFERENCES roles(id_rol)
) ENGINE=InnoDB;

CREATE TABLE tokens (
    id_token BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(500) NOT NULL,
    tipo ENUM('RECUPERACION', 'BLACKLIST') NOT NULL,
    expiracion DATETIME NOT NULL,
    usuario_id BIGINT NOT NULL,
    CONSTRAINT fk_tokens_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE encuestas (
    id_encuesta BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('VOTACION', 'ENCUESTA') NOT NULL,
    codigo_pin VARCHAR(10) NOT NULL UNIQUE,
    fecha_limite DATETIME NOT NULL,
    activa TINYINT(1) NOT NULL DEFAULT 1,
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    moderador_id BIGINT NOT NULL,
    CONSTRAINT fk_encuestas_moderador FOREIGN KEY (moderador_id) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE preguntas (
    id_pregunta BIGINT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(255) NOT NULL,
    orden INT NOT NULL,
    encuesta_id BIGINT NOT NULL,
    CONSTRAINT fk_preguntas_encuesta FOREIGN KEY (encuesta_id) REFERENCES encuestas(id_encuesta) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE opciones (
    id_opcion BIGINT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(200) NOT NULL,
    pregunta_id BIGINT NOT NULL,
    CONSTRAINT fk_opciones_pregunta FOREIGN KEY (pregunta_id) REFERENCES preguntas(id_pregunta) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE participaciones (
    id_participacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    fecha_voto DATETIME NULL,
    estado ENUM('PENDIENTE', 'COMPLETADA') NOT NULL DEFAULT 'PENDIENTE',
    usuario_id BIGINT NOT NULL,
    encuesta_id BIGINT NOT NULL,
    CONSTRAINT uq_usuario_encuesta UNIQUE (usuario_id, encuesta_id),
    CONSTRAINT fk_participaciones_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_participaciones_encuesta FOREIGN KEY (encuesta_id) REFERENCES encuestas(id_encuesta) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE respuestas (
    id_respuesta BIGINT AUTO_INCREMENT PRIMARY KEY,
    participacion_id BIGINT NOT NULL,
    pregunta_id BIGINT NOT NULL,
    opcion_id BIGINT NOT NULL,
    CONSTRAINT uq_participacion_pregunta UNIQUE (participacion_id, pregunta_id),
    CONSTRAINT fk_respuestas_participacion FOREIGN KEY (participacion_id) REFERENCES participaciones(id_participacion) ON DELETE CASCADE,
    CONSTRAINT fk_respuestas_pregunta FOREIGN KEY (pregunta_id) REFERENCES preguntas(id_pregunta) ON DELETE CASCADE,
    CONSTRAINT fk_respuestas_opcion FOREIGN KEY (opcion_id) REFERENCES opciones(id_opcion) ON DELETE CASCADE
) ENGINE=InnoDB;