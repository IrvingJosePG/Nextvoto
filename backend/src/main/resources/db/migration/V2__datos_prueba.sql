-- 1. ROLES (3 niveles de acceso)
INSERT INTO roles (id_rol, nombre) VALUES
(1, 'ADMIN'),
(2, 'MODERADOR'),
(3, 'VOTANTE');

-- 2. USUARIOS (15 registros: 1 Admin fijo para evaluación, 3 Moderadores, 11 Votantes)
-- Contraseña de todos los usuarios de prueba: NextVoto2026!
INSERT INTO usuarios (id_usuario, nombre, email, password, telefono, activo, rol_id) VALUES
(1, 'Administrador NextVoto', 'admin@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000001', 1, 1),
(2, 'Prof. Carlos Mendoza', 'carlos.mendoza@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000002', 1, 2),
(3, 'Dra. Laura Gómez', 'laura.gomez@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000003', 1, 2),
(4, 'Ing. Roberto Díaz', 'roberto.diaz@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000004', 1, 2),
(5, 'Miguel Sandoval Reyes', 'miguel@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+529514440330', 1, 3),
(6, 'Ana Sofía Torres', 'ana.torres@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000006', 1, 3),
(7, 'Luis Fernando Ruiz', 'luis.ruiz@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000007', 1, 3),
(8, 'Valeria Castro Pérez', 'valeria.castro@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000008', 1, 3),
(9, 'Diego Morales López', 'diego.morales@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000009', 1, 3),
(10, 'Fernanda Silva Ortíz', 'fernanda.silva@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000010', 1, 3),
(11, 'Jorge Herrera Cruz', 'jorge.herrera@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000011', 1, 3),
(12, 'Camila Vargas Soto', 'camila.vargas@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000012', 1, 3),
(13, 'Andrés Navarro Ríos', 'andres.navarro@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000013', 1, 3),
(14, 'Mariana Delgado Gil', 'mariana.delgado@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000014', 1, 3),
(15, 'Usuario Inactivo Demo', 'inactivo@nextvoto.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+525510000015', 0, 3);

-- 3. ENCUESTAS Y VOTACIONES (10 registros)
INSERT INTO encuestas (id_encuesta, titulo, descripcion, tipo, codigo_pin, fecha_limite, activa, moderador_id) VALUES
(1, 'Elección de Representante de Grupo', 'Votación oficial para elegir al jefe de grupo del semestre.', 'VOTACION', 'NV-4829', '2026-12-20 23:59:59', 1, 2),
(2, 'Encuesta de Preferencias Académicas 2026', 'Consulta sobre horarios y modalidad de asesorías.', 'ENCUESTA', 'NV-7310', '2026-12-22 23:59:59', 1, 2),
(3, 'Evento de Fin de Semestre', 'Selección de fecha y temática para la convivencia.', 'ENCUESTA', 'NV-9104', '2026-12-18 20:00:00', 1, 3),
(4, 'Sede del Congreso Tecnológico', 'Votación para definir el auditorio principal.', 'VOTACION', 'NV-3321', '2026-12-15 18:00:00', 1, 3),
(5, 'Evaluación de Servicios de Cafetería', 'Opinión estudiantil sobre menú y precios.', 'ENCUESTA', 'NV-5582', '2026-12-25 23:59:59', 1, 4),
(6, 'Horario de Laboratorio de Redes', 'Elección de turno vespertino para prácticas.', 'VOTACION', 'NV-6409', '2026-12-19 23:59:59', 1, 4),
(7, 'Talleres Extracurriculares 2027', 'Selección de cursos de programación y nube.', 'ENCUESTA', 'NV-8812', '2026-12-28 23:59:59', 1, 2),
(8, 'Torneo Deportivo Interfacultades', 'Votación de disciplinas deportivas a incluir.', 'VOTACION', 'NV-1945', '2026-12-10 23:59:59', 0, 3),
(9, 'Proyecto Integrador: Stack Tecnológico', 'Consenso sobre herramientas de despliegue.', 'ENCUESTA', 'NV-2764', '2026-12-21 23:59:59', 1, 4),
(10, 'Renovación de Sociedad de Alumnos', 'Votación general de planillas registradas.', 'VOTACION', 'NV-5098', '2026-12-30 23:59:59', 1, 2);

-- 4. PREGUNTAS (14 registros)
INSERT INTO preguntas (id_pregunta, texto, orden, encuesta_id) VALUES
(1, '¿Quién debería ser representante del grupo de Programación Web?', 1, 1),
(2, '¿Qué modalidad prefieres para las asesorías del semestre?', 1, 2),
(3, '¿En qué horario te resulta más cómodo asistir a tutorías?', 2, 2),
(4, '¿Qué día de la semana prefieres para la convivencia del grupo?', 1, 3),
(5, '¿Qué tipo de menú prefieres para el evento?', 2, 3),
(6, '¿Cuál sede consideras mejor conectada para el Congreso?', 1, 4),
(7, '¿Cómo calificas la variedad actual de alimentos en cafetería?', 1, 5),
(8, '¿Qué servicio adicional te gustaría ver en cafetería?', 2, 5),
(9, '¿Qué bloque horario prefieres para el Laboratorio de Redes?', 1, 6),
(10, '¿Qué taller técnico te interesa más cursar en 2027?', 1, 7),
(11, '¿Cuál disciplina deportiva debe encabezar el torneo?', 1, 8),
(12, '¿Qué proveedor de nube prefieres para las prácticas?', 1, 9),
(13, '¿Qué gestor de contenedores prefieres utilizar?', 2, 9),
(14, '¿Qué planilla respaldas para la Sociedad de Alumnos?', 1, 10);

-- 5. OPCIONES (36 registros)
INSERT INTO opciones (id_opcion, texto, pregunta_id) VALUES
(1, 'Candidato 1: Sofía Hernández', 1),
(2, 'Candidato 2: Alejandro Ramírez', 1),
(3, 'Candidato 3: Valeria Castro', 1),
(4, '100% Presencial en campus', 2),
(5, 'Virtual en vivo (Zoom / Meet)', 2),
(6, 'Híbrido (presencial con grabación)', 2),
(7, 'Mañana (09:00 - 11:00)', 3),
(8, 'Tarde (16:00 - 18:00)', 3),
(9, 'Jueves por la tarde', 4),
(10, 'Viernes por la tarde', 4),
(11, 'Sábado al mediodía', 4),
(12, 'Taquiza tradicional', 5),
(13, 'Comida rápida / Hamburguesas', 5),
(14, 'Auditorio Central', 6),
(15, 'Centro de Convenciones Norte', 6),
(16, 'Excelente', 7),
(17, 'Regular', 7),
(18, 'Necesita mejorar', 7),
(19, 'Barra de café y repostería', 8),
(20, 'Opciones vegetarianas', 8),
(21, 'Lunes y Miércoles 15:00 - 17:00', 9),
(22, 'Martes y Jueves 17:00 - 19:00', 9),
(23, 'Desarrollo Cloud con AWS', 10),
(24, 'Ciberseguridad Aplicada', 10),
(25, 'Arquitectura de Microservicios', 10),
(26, 'Fútbol Rápido', 11),
(27, 'Básquetbol', 11),
(28, 'Vóleibol', 11),
(29, 'DigitalOcean VPS', 12),
(30, 'Amazon Web Services (AWS)', 12),
(31, 'Docker Compose', 13),
(32, 'Kubernetes', 13),
(33, 'Planilla Azul - Innovación', 14),
(34, 'Planilla Verde - Sustentabilidad', 14),
(35, 'Planilla Blanca - Unidad', 14),
(36, 'Voto Nulo / Abstención', 14);

-- 6. PARTICIPACIONES (12 registros: 10 COMPLETADAS y 2 PENDIENTES para Miguel Sandoval)
INSERT INTO participaciones (id_participacion, fecha_voto, estado, usuario_id, encuesta_id) VALUES
(1, NULL, 'PENDIENTE', 5, 1),
(2, NULL, 'PENDIENTE', 5, 2),
(3, '2026-11-10 14:20:00', 'COMPLETADA', 5, 3),
(4, '2026-11-11 10:15:00', 'COMPLETADA', 6, 1),
(5, '2026-11-11 11:05:00', 'COMPLETADA', 7, 1),
(6, '2026-11-11 12:30:00', 'COMPLETADA', 8, 1),
(7, '2026-11-12 09:45:00', 'COMPLETADA', 9, 2),
(8, '2026-11-12 16:10:00', 'COMPLETADA', 10, 3),
(9, '2026-11-13 13:00:00', 'COMPLETADA', 11, 4),
(10, '2026-11-14 15:20:00', 'COMPLETADA', 12, 5),
(11, '2026-11-15 17:40:00', 'COMPLETADA', 13, 6),
(12, '2026-11-16 08:50:00', 'COMPLETADA', 14, 10);

-- 7. RESPUESTAS (13 registros asociados a las participaciones completadas)
INSERT INTO respuestas (id_respuesta, participacion_id, pregunta_id, opcion_id) VALUES
(1, 3, 4, 10),
(2, 3, 5, 12),
(3, 4, 1, 1),
(4, 5, 1, 1),
(5, 6, 1, 2),
(6, 7, 2, 6),
(7, 7, 3, 8),
(8, 8, 4, 10),
(9, 8, 5, 13),
(10, 9, 6, 14),
(11, 10, 7, 17),
(12, 10, 8, 19),
(13, 11, 9, 21);