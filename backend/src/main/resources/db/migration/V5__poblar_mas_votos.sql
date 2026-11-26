-- ============================================================================
-- V5: Ampliación de usuarios votantes, gráficas de pastel y volumen de votos
-- Contraseña de todos los usuarios nuevos: NextVoto2026!
-- ============================================================================

-- 1. Nuevos usuarios con rol VOTANTE (rol_id = 3)
INSERT IGNORE INTO usuarios (nombre, email, password, telefono, activo, rol_id) VALUES
('Mateo Castellanos Ruiz', 'mateo.castellanos@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000051', 1, 3),
('Valeria Montiel Soto', 'valeria.montiel@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000052', 1, 3),
('Santiago Solís Herrera', 'santiago.solis@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000053', 1, 3),
('Camila Domínguez Lara', 'camila.dominguez@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000054', 1, 3),
('Sebastián Trejo Paredes', 'sebastian.trejo@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000055', 1, 3),
('Regina Pacheco Campos', 'regina.pacheco@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000056', 1, 3),
('Nicolás Cárdenas Vega', 'nicolas.cardenas@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000057', 1, 3),
('Renata Bravo Mendoza', 'renata.bravo@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000058', 1, 3),
('Emiliano Roldán Cruz', 'emiliano.roldan@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000059', 1, 3),
('Mariana Ibarra Flores', 'mariana.ibarra@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000060', 1, 3),
('Diego Tapia Orozco', 'diego.tapia@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000061', 1, 3),
('Sofía Galván Beltrán', 'sofia.galvan@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000062', 1, 3),
('Andrés Ponce Morales', 'andres.ponce@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000063', 1, 3),
('Ximena Téllez Navarro', 'ximena.tellez@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000064', 1, 3),
('Leonardo Acosta Gil', 'leonardo.acosta@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000065', 1, 3),
('Paula Serrano Rivas', 'paula.serrano@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000066', 1, 3),
('Rodrigo Miranda Luna', 'rodrigo.miranda@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000067', 1, 3),
('Fernanda Coronado Díaz', 'fernanda.coronado@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000068', 1, 3),
('Alejandro Zamora Ortiz', 'alejandro.zamora@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000069', 1, 3),
('Gabriela Escamilla León', 'gabriela.escamilla@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000070', 1, 3),
('Iván Valenzuela Pardo', 'ivan.valenzuela@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000071', 1, 3),
('Daniela Rosas Cabrera', 'daniela.rosas@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000072', 1, 3),
('Fernando Mejía Silva', 'fernando.mejia@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000073', 1, 3),
('Natalia Barrios Peña', 'natalia.barrios@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000074', 1, 3),
('Eduardo Fuentes Castro', 'eduardo.fuentes@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000075', 1, 3),
('Melissa Guzmán Torres', 'melissa.guzman@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000076', 1, 3),
('Óscar Chávez Delgado', 'oscar.chavez@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000077', 1, 3),
('Andrea Lozano Herrera', 'andrea.lozano@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000078', 1, 3),
('Mauricio Cortés Reyes', 'mauricio.cortes@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000079', 1, 3),
('Karla Espinoza Vargas', 'karla.espinoza@nextvoto.com', '$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y', '+525520000080', 1, 3);

-- 2. Activar gráfica de PASTEL en varias encuestas existentes
UPDATE encuestas
SET tipo_grafica = 'PASTEL'
WHERE id_encuesta IN (2, 3, 5, 7, 10, 12, 13, 16, 18, 21, 24, 26, 29, 32, 33, 36, 38, 40, 42, 46);

-- 3. Generar participaciones COMPLETADAS masivas (se excluye id_usuario = 5 para conservar sus pendientes demo)
INSERT IGNORE INTO participaciones (fecha_voto, estado, usuario_id, encuesta_id)
SELECT
    DATE_SUB('2026-11-26 01:30:00', INTERVAL (MOD(u.id_usuario * 17 + e.id_encuesta * 11, 240)) HOUR),
    'COMPLETADA',
    u.id_usuario,
    e.id_encuesta
FROM usuarios u
JOIN encuestas e ON e.id_encuesta BETWEEN 1 AND 50
WHERE u.rol_id = 3
  AND u.activo = 1
  AND u.id_usuario <> 5
  AND (
      (e.id_encuesta BETWEEN 1 AND 15 AND MOD(u.id_usuario + e.id_encuesta, 5) <> 0)
      OR
      (e.id_encuesta BETWEEN 16 AND 50 AND MOD(u.id_usuario * 3 + e.id_encuesta, 3) <> 0)
  );

-- 4A. Respuestas para preguntas de encuestas 1 a 10 (preguntas 1 a 14)

-- Pregunta 1 (Encuesta 1: opciones 1, 2, 3)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 1,
    CASE MOD(p.usuario_id * 7, 10)
        WHEN 0 THEN 1 WHEN 1 THEN 1 WHEN 2 THEN 1 WHEN 3 THEN 1 WHEN 4 THEN 1
        WHEN 5 THEN 2 WHEN 6 THEN 2 WHEN 7 THEN 2
        ELSE 3
    END
FROM participaciones p
WHERE p.encuesta_id = 1 AND p.estado = 'COMPLETADA';

-- Pregunta 2 (Encuesta 2: opciones 4, 5, 6)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 2,
    CASE MOD(p.usuario_id * 11, 10)
        WHEN 0 THEN 6 WHEN 1 THEN 6 WHEN 2 THEN 6 WHEN 3 THEN 6 WHEN 4 THEN 6 WHEN 5 THEN 6
        WHEN 6 THEN 4 WHEN 7 THEN 4
        ELSE 5
    END
FROM participaciones p
WHERE p.encuesta_id = 2 AND p.estado = 'COMPLETADA';

-- Pregunta 3 (Encuesta 2: opciones 7, 8)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 3,
    CASE WHEN MOD(p.usuario_id * 5, 10) < 6 THEN 8 ELSE 7 END
FROM participaciones p
WHERE p.encuesta_id = 2 AND p.estado = 'COMPLETADA';

-- Pregunta 4 (Encuesta 3: opciones 9, 10, 11)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 4,
    CASE MOD(p.usuario_id * 13, 10)
        WHEN 0 THEN 10 WHEN 1 THEN 10 WHEN 2 THEN 10 WHEN 3 THEN 10 WHEN 4 THEN 10
        WHEN 5 THEN 11 WHEN 6 THEN 11 WHEN 7 THEN 11
        ELSE 9
    END
FROM participaciones p
WHERE p.encuesta_id = 3 AND p.estado = 'COMPLETADA';

-- Pregunta 5 (Encuesta 3: opciones 12, 13)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 5,
    CASE WHEN MOD(p.usuario_id * 3, 10) < 7 THEN 12 ELSE 13 END
FROM participaciones p
WHERE p.encuesta_id = 3 AND p.estado = 'COMPLETADA';

-- Pregunta 6 (Encuesta 4: opciones 14, 15)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 6,
    CASE WHEN MOD(p.usuario_id * 7, 10) < 6 THEN 14 ELSE 15 END
FROM participaciones p
WHERE p.encuesta_id = 4 AND p.estado = 'COMPLETADA';

-- Pregunta 7 (Encuesta 5: opciones 16, 17, 18)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 7,
    CASE MOD(p.usuario_id * 9, 10)
        WHEN 0 THEN 17 WHEN 1 THEN 17 WHEN 2 THEN 17 WHEN 3 THEN 17 WHEN 4 THEN 17
        WHEN 5 THEN 18 WHEN 6 THEN 18 WHEN 7 THEN 18
        ELSE 16
    END
FROM participaciones p
WHERE p.encuesta_id = 5 AND p.estado = 'COMPLETADA';

-- Pregunta 8 (Encuesta 5: opciones 19, 20)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 8,
    CASE WHEN MOD(p.usuario_id * 11, 10) < 6 THEN 19 ELSE 20 END
FROM participaciones p
WHERE p.encuesta_id = 5 AND p.estado = 'COMPLETADA';

-- Pregunta 9 (Encuesta 6: opciones 21, 22)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 9,
    CASE WHEN MOD(p.usuario_id * 13, 10) < 4 THEN 21 ELSE 22 END
FROM participaciones p
WHERE p.encuesta_id = 6 AND p.estado = 'COMPLETADA';

-- Pregunta 10 (Encuesta 7: opciones 23, 24, 25)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 10,
    CASE MOD(p.usuario_id * 7, 10)
        WHEN 0 THEN 23 WHEN 1 THEN 23 WHEN 2 THEN 23 WHEN 3 THEN 23 WHEN 4 THEN 23
        WHEN 5 THEN 24 WHEN 6 THEN 24 WHEN 7 THEN 24
        ELSE 25
    END
FROM participaciones p
WHERE p.encuesta_id = 7 AND p.estado = 'COMPLETADA';

-- Pregunta 11 (Encuesta 8: opciones 26, 27, 28)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 11,
    CASE MOD(p.usuario_id * 5, 10)
        WHEN 0 THEN 26 WHEN 1 THEN 26 WHEN 2 THEN 26 WHEN 3 THEN 26 WHEN 4 THEN 26
        WHEN 5 THEN 27 WHEN 6 THEN 27
        ELSE 28
    END
FROM participaciones p
WHERE p.encuesta_id = 8 AND p.estado = 'COMPLETADA';

-- Pregunta 12 (Encuesta 9: opciones 29, 30)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 12,
    CASE WHEN MOD(p.usuario_id * 9, 10) < 6 THEN 30 ELSE 29 END
FROM participaciones p
WHERE p.encuesta_id = 9 AND p.estado = 'COMPLETADA';

-- Pregunta 13 (Encuesta 9: opciones 31, 32)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 13,
    CASE WHEN MOD(p.usuario_id * 7, 10) < 7 THEN 31 ELSE 32 END
FROM participaciones p
WHERE p.encuesta_id = 9 AND p.estado = 'COMPLETADA';

-- Pregunta 14 (Encuesta 10: opciones 33, 34, 35, 36)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT p.id_participacion, 14,
    CASE MOD(p.usuario_id * 11, 10)
        WHEN 0 THEN 33 WHEN 1 THEN 33 WHEN 2 THEN 33 WHEN 3 THEN 33
        WHEN 4 THEN 34 WHEN 5 THEN 34 WHEN 6 THEN 34
        WHEN 7 THEN 35 WHEN 8 THEN 35
        ELSE 36
    END
FROM participaciones p
WHERE p.encuesta_id = 10 AND p.estado = 'COMPLETADA';

-- 4B. Respuestas para encuestas 11 a 50 (preguntas 15 a 54, dos opciones por pregunta)
INSERT IGNORE INTO respuestas (participacion_id, pregunta_id, opcion_id)
SELECT
    p.id_participacion,
    q.id_pregunta,
    CASE
        WHEN MOD(p.usuario_id * 7 + q.id_pregunta * 3, 10) < (4 + MOD(q.id_pregunta, 4))
            THEN (2 * q.id_pregunta + 7)
        ELSE (2 * q.id_pregunta + 8)
    END
FROM participaciones p
JOIN preguntas q ON q.encuesta_id = p.encuesta_id
WHERE p.encuesta_id BETWEEN 11 AND 50
  AND p.estado = 'COMPLETADA';