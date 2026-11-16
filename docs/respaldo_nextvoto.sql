-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: nextvoto_final_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `encuestas`
--

DROP TABLE IF EXISTS `encuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `encuestas` (
  `id_encuesta` bigint NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `tipo` enum('VOTACION','ENCUESTA') COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_pin` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_limite` datetime NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `moderador_id` bigint NOT NULL,
  PRIMARY KEY (`id_encuesta`),
  UNIQUE KEY `codigo_pin` (`codigo_pin`),
  KEY `fk_encuestas_moderador` (`moderador_id`),
  CONSTRAINT `fk_encuestas_moderador` FOREIGN KEY (`moderador_id`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuestas`
--

LOCK TABLES `encuestas` WRITE;
/*!40000 ALTER TABLE `encuestas` DISABLE KEYS */;
INSERT INTO `encuestas` VALUES (1,'Elección de Representante de Grupo','Votación oficial para elegir al jefe de grupo del semestre.','VOTACION','NV-4829','2026-12-20 23:59:59',1,'2026-11-16 15:35:02',2),(2,'Encuesta de Preferencias Académicas 2026','Consulta sobre horarios y modalidad de asesorías.','ENCUESTA','NV-7310','2026-12-22 23:59:59',1,'2026-11-16 15:35:02',2),(3,'Evento de Fin de Semestre','Selección de fecha y temática para la convivencia.','ENCUESTA','NV-9104','2026-12-18 20:00:00',1,'2026-11-16 15:35:02',3),(4,'Sede del Congreso Tecnológico','Votación para definir el auditorio principal.','VOTACION','NV-3321','2026-12-15 18:00:00',1,'2026-11-16 15:35:02',3),(5,'Evaluación de Servicios de Cafetería','Opinión estudiantil sobre menú y precios.','ENCUESTA','NV-5582','2026-12-25 23:59:59',1,'2026-11-16 15:35:02',4),(6,'Horario de Laboratorio de Redes','Elección de turno vespertino para prácticas.','VOTACION','NV-6409','2026-12-19 23:59:59',1,'2026-11-16 15:35:02',4),(7,'Talleres Extracurriculares 2027','Selección de cursos de programación y nube.','ENCUESTA','NV-8812','2026-12-28 23:59:59',1,'2026-11-16 15:35:02',2),(8,'Torneo Deportivo Interfacultades','Votación de disciplinas deportivas a incluir.','VOTACION','NV-1945','2026-12-10 23:59:59',0,'2026-11-16 15:35:02',3),(9,'Proyecto Integrador: Stack Tecnológico','Consenso sobre herramientas de despliegue.','ENCUESTA','NV-2764','2026-12-21 23:59:59',1,'2026-11-16 15:35:02',4),(10,'Renovación de Sociedad de Alumnos','Votación general de planillas registradas.','VOTACION','NV-5098','2026-12-30 23:59:59',1,'2026-11-16 15:35:02',2);
/*!40000 ALTER TABLE `encuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flyway_schema_history`
--

DROP TABLE IF EXISTS `flyway_schema_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flyway_schema_history` (
  `installed_rank` int NOT NULL,
  `version` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `script` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` int DEFAULT NULL,
  `installed_by` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installed_on` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `execution_time` int NOT NULL,
  `success` tinyint(1) NOT NULL,
  PRIMARY KEY (`installed_rank`),
  KEY `flyway_schema_history_s_idx` (`success`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flyway_schema_history`
--

LOCK TABLES `flyway_schema_history` WRITE;
/*!40000 ALTER TABLE `flyway_schema_history` DISABLE KEYS */;
INSERT INTO `flyway_schema_history` VALUES (1,'1','crear tablas','SQL','V1__crear_tablas.sql',-449067127,'root','2026-11-16 21:35:02',285,1),(2,'2','datos prueba','SQL','V2__datos_prueba.sql',2038733826,'root','2026-11-16 21:35:02',21,1);
/*!40000 ALTER TABLE `flyway_schema_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opciones`
--

DROP TABLE IF EXISTS `opciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opciones` (
  `id_opcion` bigint NOT NULL AUTO_INCREMENT,
  `texto` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pregunta_id` bigint NOT NULL,
  PRIMARY KEY (`id_opcion`),
  KEY `fk_opciones_pregunta` (`pregunta_id`),
  CONSTRAINT `fk_opciones_pregunta` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opciones`
--

LOCK TABLES `opciones` WRITE;
/*!40000 ALTER TABLE `opciones` DISABLE KEYS */;
INSERT INTO `opciones` VALUES (1,'Candidato 1: Sofía Hernández',1),(2,'Candidato 2: Alejandro Ramírez',1),(3,'Candidato 3: Valeria Castro',1),(4,'100% Presencial en campus',2),(5,'Virtual en vivo (Zoom / Meet)',2),(6,'Híbrido (presencial con grabación)',2),(7,'Mañana (09:00 - 11:00)',3),(8,'Tarde (16:00 - 18:00)',3),(9,'Jueves por la tarde',4),(10,'Viernes por la tarde',4),(11,'Sábado al mediodía',4),(12,'Taquiza tradicional',5),(13,'Comida rápida / Hamburguesas',5),(14,'Auditorio Central',6),(15,'Centro de Convenciones Norte',6),(16,'Excelente',7),(17,'Regular',7),(18,'Necesita mejorar',7),(19,'Barra de café y repostería',8),(20,'Opciones vegetarianas',8),(21,'Lunes y Miércoles 15:00 - 17:00',9),(22,'Martes y Jueves 17:00 - 19:00',9),(23,'Desarrollo Cloud con AWS',10),(24,'Ciberseguridad Aplicada',10),(25,'Arquitectura de Microservicios',10),(26,'Fútbol Rápido',11),(27,'Básquetbol',11),(28,'Vóleibol',11),(29,'DigitalOcean VPS',12),(30,'Amazon Web Services (AWS)',12),(31,'Docker Compose',13),(32,'Kubernetes',13),(33,'Planilla Azul - Innovación',14),(34,'Planilla Verde - Sustentabilidad',14),(35,'Planilla Blanca - Unidad',14),(36,'Voto Nulo / Abstención',14);
/*!40000 ALTER TABLE `opciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participaciones`
--

DROP TABLE IF EXISTS `participaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participaciones` (
  `id_participacion` bigint NOT NULL AUTO_INCREMENT,
  `fecha_voto` datetime DEFAULT NULL,
  `estado` enum('PENDIENTE','COMPLETADA') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDIENTE',
  `usuario_id` bigint NOT NULL,
  `encuesta_id` bigint NOT NULL,
  PRIMARY KEY (`id_participacion`),
  UNIQUE KEY `uq_usuario_encuesta` (`usuario_id`,`encuesta_id`),
  KEY `fk_participaciones_encuesta` (`encuesta_id`),
  CONSTRAINT `fk_participaciones_encuesta` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id_encuesta`) ON DELETE CASCADE,
  CONSTRAINT `fk_participaciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participaciones`
--

LOCK TABLES `participaciones` WRITE;
/*!40000 ALTER TABLE `participaciones` DISABLE KEYS */;
INSERT INTO `participaciones` VALUES (1,NULL,'PENDIENTE',5,1),(2,NULL,'PENDIENTE',5,2),(3,'2026-11-10 14:20:00','COMPLETADA',5,3),(4,'2026-11-11 10:15:00','COMPLETADA',6,1),(5,'2026-11-11 11:05:00','COMPLETADA',7,1),(6,'2026-11-11 12:30:00','COMPLETADA',8,1),(7,'2026-11-12 09:45:00','COMPLETADA',9,2),(8,'2026-11-12 16:10:00','COMPLETADA',10,3),(9,'2026-11-13 13:00:00','COMPLETADA',11,4),(10,'2026-11-14 15:20:00','COMPLETADA',12,5),(11,'2026-11-15 17:40:00','COMPLETADA',13,6),(12,'2026-11-16 08:50:00','COMPLETADA',14,10);
/*!40000 ALTER TABLE `participaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preguntas`
--

DROP TABLE IF EXISTS `preguntas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preguntas` (
  `id_pregunta` bigint NOT NULL AUTO_INCREMENT,
  `texto` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orden` int NOT NULL,
  `encuesta_id` bigint NOT NULL,
  PRIMARY KEY (`id_pregunta`),
  KEY `fk_preguntas_encuesta` (`encuesta_id`),
  CONSTRAINT `fk_preguntas_encuesta` FOREIGN KEY (`encuesta_id`) REFERENCES `encuestas` (`id_encuesta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES (1,'¿Quién debería ser representante del grupo de Programación Web?',1,1),(2,'¿Qué modalidad prefieres para las asesorías del semestre?',1,2),(3,'¿En qué horario te resulta más cómodo asistir a tutorías?',2,2),(4,'¿Qué día de la semana prefieres para la convivencia del grupo?',1,3),(5,'¿Qué tipo de menú prefieres para el evento?',2,3),(6,'¿Cuál sede consideras mejor conectada para el Congreso?',1,4),(7,'¿Cómo calificas la variedad actual de alimentos en cafetería?',1,5),(8,'¿Qué servicio adicional te gustaría ver en cafetería?',2,5),(9,'¿Qué bloque horario prefieres para el Laboratorio de Redes?',1,6),(10,'¿Qué taller técnico te interesa más cursar en 2027?',1,7),(11,'¿Cuál disciplina deportiva debe encabezar el torneo?',1,8),(12,'¿Qué proveedor de nube prefieres para las prácticas?',1,9),(13,'¿Qué gestor de contenedores prefieres utilizar?',2,9),(14,'¿Qué planilla respaldas para la Sociedad de Alumnos?',1,10);
/*!40000 ALTER TABLE `preguntas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `respuestas` (
  `id_respuesta` bigint NOT NULL AUTO_INCREMENT,
  `participacion_id` bigint NOT NULL,
  `pregunta_id` bigint NOT NULL,
  `opcion_id` bigint NOT NULL,
  PRIMARY KEY (`id_respuesta`),
  UNIQUE KEY `uq_participacion_pregunta` (`participacion_id`,`pregunta_id`),
  KEY `fk_respuestas_pregunta` (`pregunta_id`),
  KEY `fk_respuestas_opcion` (`opcion_id`),
  CONSTRAINT `fk_respuestas_opcion` FOREIGN KEY (`opcion_id`) REFERENCES `opciones` (`id_opcion`) ON DELETE CASCADE,
  CONSTRAINT `fk_respuestas_participacion` FOREIGN KEY (`participacion_id`) REFERENCES `participaciones` (`id_participacion`) ON DELETE CASCADE,
  CONSTRAINT `fk_respuestas_pregunta` FOREIGN KEY (`pregunta_id`) REFERENCES `preguntas` (`id_pregunta`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
INSERT INTO `respuestas` VALUES (1,3,4,10),(2,3,5,12),(3,4,1,1),(4,5,1,1),(5,6,1,2),(6,7,2,6),(7,7,3,8),(8,8,4,10),(9,8,5,13),(10,9,6,14),(11,10,7,17),(12,10,8,19),(13,11,9,21);
/*!40000 ALTER TABLE `respuestas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id_rol` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(2,'MODERADOR'),(3,'VOTANTE');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `id_token` bigint NOT NULL AUTO_INCREMENT,
  `token` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('RECUPERACION','BLACKLIST') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiracion` datetime NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id_token`),
  KEY `fk_tokens_usuario` (`usuario_id`),
  CONSTRAINT `fk_tokens_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id_usuario` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `creado_en` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `rol_id` bigint NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_usuarios_rol` (`rol_id`),
  CONSTRAINT `fk_usuarios_rol` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador NextVoto','admin@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000001',1,'2026-11-16 15:35:02',1),(2,'Prof. Carlos Mendoza','carlos.mendoza@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000002',1,'2026-11-16 15:35:02',2),(3,'Dra. Laura Gómez','laura.gomez@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000003',1,'2026-11-16 15:35:02',2),(4,'Ing. Roberto Díaz','roberto.diaz@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000004',1,'2026-11-16 15:35:02',2),(5,'Miguel Sandoval Reyes','miguel@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+529514440330',1,'2026-11-16 15:35:02',3),(6,'Ana Sofía Torres','ana.torres@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000006',1,'2026-11-16 15:35:02',3),(7,'Luis Fernando Ruiz','luis.ruiz@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000007',1,'2026-11-16 15:35:02',3),(8,'Valeria Castro Pérez','valeria.castro@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000008',1,'2026-11-16 15:35:02',3),(9,'Diego Morales López','diego.morales@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000009',1,'2026-11-16 15:35:02',3),(10,'Fernanda Silva Ortíz','fernanda.silva@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000010',1,'2026-11-16 15:35:02',3),(11,'Jorge Herrera Cruz','jorge.herrera@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000011',1,'2026-11-16 15:35:02',3),(12,'Camila Vargas Soto','camila.vargas@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000012',1,'2026-11-16 15:35:02',3),(13,'Andrés Navarro Ríos','andres.navarro@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000013',1,'2026-11-16 15:35:02',3),(14,'Mariana Delgado Gil','mariana.delgado@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000014',1,'2026-11-16 15:35:02',3),(15,'Usuario Inactivo Demo','inactivo@nextvoto.com','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy','+525510000015',0,'2026-11-16 15:35:02',3);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-16 16:46:31
