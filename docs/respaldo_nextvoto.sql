-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: nextvoto_final_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `nextvoto_final_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `nextvoto_final_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `nextvoto_final_db`;

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
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `encuestas`
--

LOCK TABLES `encuestas` WRITE;
/*!40000 ALTER TABLE `encuestas` DISABLE KEYS */;
INSERT INTO `encuestas` VALUES (1,'Elección de Representante de Grupo','Votación oficial para elegir al jefe de grupo del semestre.','VOTACION','NV-4829','2026-12-20 23:59:59',1,'2026-11-23 22:08:16',2),(2,'Encuesta de Preferencias Académicas 2026','Consulta sobre horarios y modalidad de asesorías.','ENCUESTA','NV-7310','2026-12-22 23:59:59',1,'2026-11-23 22:08:16',2),(3,'Evento de Fin de Semestre','Selección de fecha y temática para la convivencia.','ENCUESTA','NV-9104','2026-12-18 20:00:00',1,'2026-11-23 22:08:16',3),(4,'Sede del Congreso Tecnológico','Votación para definir el auditorio principal.','VOTACION','NV-3321','2026-12-15 18:00:00',1,'2026-11-23 22:08:16',3),(5,'Evaluación de Servicios de Cafetería','Opinión estudiantil sobre menú y precios.','ENCUESTA','NV-5582','2026-12-25 23:59:59',1,'2026-11-23 22:08:16',4),(6,'Horario de Laboratorio de Redes','Elección de turno vespertino para prácticas.','VOTACION','NV-6409','2026-12-19 23:59:59',1,'2026-11-23 22:08:16',4),(7,'Talleres Extracurriculares 2027','Selección de cursos de programación y nube.','ENCUESTA','NV-8812','2026-12-28 23:59:59',1,'2026-11-23 22:08:16',2),(8,'Torneo Deportivo Interfacultades','Votación de disciplinas deportivas a incluir.','VOTACION','NV-1945','2026-11-10 23:59:59',0,'2026-11-23 22:08:16',3),(9,'Proyecto Integrador: Stack Tecnológico','Consenso sobre herramientas de despliegue.','ENCUESTA','NV-2764','2026-12-21 23:59:59',1,'2026-11-23 22:08:16',4),(10,'Renovación de Sociedad de Alumnos','Votación general de planillas registradas.','VOTACION','NV-5098','2026-12-30 23:59:59',1,'2026-11-23 22:08:16',2),(11,'Presupuesto Participativo Estudiantil','Asignación de fondos para equipamiento de cómputo.','VOTACION','NV-1011','2026-12-26 23:59:59',1,'2026-11-23 22:08:16',16),(12,'Evaluación de Biblioteca Digital','Satisfacción con bases de datos y libros electrónicos.','ENCUESTA','NV-1012','2026-12-27 23:59:59',1,'2026-11-23 22:08:16',17),(13,'Hackathon Universitario 2027','Elección de temática principal del reto de desarrollo.','VOTACION','NV-1013','2027-01-15 23:59:59',1,'2026-11-23 22:08:16',2),(14,'Transporte Universitario Nocturno','Consulta sobre ampliación de rutas vespertinas.','ENCUESTA','NV-1014','2026-12-29 23:59:59',1,'2026-11-23 22:08:16',3),(15,'Comité de Ética y Transparencia','Elección de vocales estudiantiles del comité.','VOTACION','NV-1015','2026-12-23 23:59:59',1,'2026-11-23 22:08:16',4),(16,'Seminario de Inteligencia Artificial','Selección de ponencias magistrales para enero.','ENCUESTA','NV-1016','2027-01-10 23:59:59',1,'2026-11-23 22:08:16',16),(17,'Diseño de Sudadera Generacional','Votación de propuesta gráfica oficial de la generación.','VOTACION','NV-1017','2026-12-19 20:00:00',1,'2026-11-23 22:08:16',17),(18,'Clima Organizacional en Laboratorios','Encuesta de mantenimiento y disponibilidad de equipos.','ENCUESTA','NV-1018','2026-12-24 23:59:59',1,'2026-11-23 22:08:16',2),(19,'Feria de Empleo y Residencias','Empresas invitadas de mayor interés para los alumnos.','ENCUESTA','NV-1019','2027-01-20 23:59:59',1,'2026-11-23 22:08:16',3),(20,'Capitán del Equipo de Robótica','Votación interna del club de robótica móvil.','VOTACION','NV-1020','2026-12-17 23:59:59',1,'2026-11-23 22:08:16',4),(21,'Certificaciones Oficiales AWS y Linux','Preferencia de vouchers subsidiados por la facultad.','ENCUESTA','NV-1021','2027-01-12 23:59:59',1,'2026-11-23 22:08:16',16),(22,'Reglamento de Uso de Salas de Estudio','Aprobación de reserva por bloques de 2 horas.','VOTACION','NV-1022','2026-12-22 18:00:00',1,'2026-11-23 22:08:16',17),(23,'Concurso de Fotografía Institucional','Votación abierta al público para elegir ganadores.','VOTACION','NV-1023','2026-11-12 23:59:59',0,'2026-11-23 22:08:16',2),(24,'Evaluación del Curso de Bases de Datos','Retroalimentación sobre prácticas con MySQL y Flyway.','ENCUESTA','NV-1024','2026-12-20 23:59:59',1,'2026-11-23 22:08:16',3),(25,'Campaña de Reforestación Campus','Selección de zona verde para jornada ecológica.','VOTACION','NV-1025','2026-12-28 23:59:59',1,'2026-11-23 22:08:16',4),(26,'Mejoras en Conectividad Wi-Fi','Reporte de zonas con baja cobertura inalámbrica.','ENCUESTA','NV-1026','2026-12-21 23:59:59',1,'2026-11-23 22:08:16',16),(27,'Representante ante Consejo Técnico','Elección oficial de consejero alumno titular.','VOTACION','NV-1027','2026-12-30 20:00:00',1,'2026-11-23 22:08:16',17),(28,'Jornada Cultural y Musical','Selección de bandas estudiantiles participantes.','VOTACION','NV-1028','2027-01-18 23:59:59',1,'2026-11-23 22:08:16',2),(29,'Preferencias de Idiomas Extranjeros','Demanda de cursos de inglés técnico y alemán.','ENCUESTA','NV-1029','2027-01-14 23:59:59',1,'2026-11-23 22:08:16',3),(30,'Torneo Interno de Ajedrez','Modalidad de partidas rápidas o clásicas.','VOTACION','NV-1030','2026-11-08 23:59:59',0,'2026-11-23 22:08:16',4),(31,'Actualización de Equipo de Audio','Prioridad de compra para el auditorio menor.','VOTACION','NV-1031','2026-12-25 23:59:59',1,'2026-11-23 22:08:16',16),(32,'Encuesta de Salud y Bienestar','Interés en talleres de manejo de estrés académico.','ENCUESTA','NV-1032','2026-12-27 23:59:59',1,'2026-11-23 22:08:16',17),(33,'Club de Desarrollo Open Source','Elección de proyecto comunitario del trimestre.','VOTACION','NV-1033','2027-01-09 23:59:59',1,'2026-11-23 22:08:16',2),(34,'Horario de Atención en Servicios Escolares','Consulta sobre ventanilla extendida vespertina.','ENCUESTA','NV-1034','2026-12-23 23:59:59',1,'2026-11-23 22:08:16',3),(35,'Semana de la Ingeniería 2027','Votación del lema oficial del evento anual.','VOTACION','NV-1035','2027-01-25 23:59:59',1,'2026-11-23 22:08:16',4),(36,'Evaluación de Tutorías Individuales','Percepción de seguimiento académico semestral.','ENCUESTA','NV-1036','2026-11-15 23:59:59',0,'2026-11-23 22:08:16',16),(37,'Mural Colaborativo en Edificio B','Selección de boceto ganador para fachada.','VOTACION','NV-1037','2026-12-29 23:59:59',1,'2026-11-23 22:08:16',17),(38,'Uso de Plataformas Educativas','Comparativa de usabilidad entre aulas virtuales.','ENCUESTA','NV-1038','2026-12-22 23:59:59',1,'2026-11-23 22:08:16',2),(39,'Coordinador de Servicio Social','Votación interna de enlace estudiantil.','VOTACION','NV-1039','2026-12-24 18:00:00',1,'2026-11-23 22:08:16',3),(40,'Talleres de Finanzas Personales','Consulta de temas de inversión y ahorro joven.','ENCUESTA','NV-1040','2027-01-11 23:59:59',1,'2026-11-23 22:08:16',4),(41,'Renovación de Mobiliario en Aulas','Priorización de aulas con mayor urgencia.','VOTACION','NV-1041','2026-12-26 23:59:59',1,'2026-11-23 22:08:16',16),(42,'Encuesta de Movilidad Internacional','Interés en intercambios académicos 2027.','ENCUESTA','NV-1042','2027-01-19 23:59:59',1,'2026-11-23 22:08:16',17),(43,'Liga Universitaria de eSports','Selección de videojuegos competitivos oficiales.','VOTACION','NV-1043','2026-11-05 23:59:59',0,'2026-11-23 22:08:16',2),(44,'Evaluación de Seguridad en Campus','Percepción sobre iluminación y accesos peatonales.','ENCUESTA','NV-1044','2026-12-28 23:59:59',1,'2026-11-23 22:08:16',3),(45,'Comité Organizador de Graduación','Elección de tesorero y secretario de generación.','VOTACION','NV-1045','2027-01-22 23:59:59',1,'2026-11-23 22:08:16',4),(46,'Seminario de Ciberseguridad Defensiva','Preferencia de laboratorios prácticos (CTF).','ENCUESTA','NV-1046','2027-01-16 23:59:59',1,'2026-11-23 22:08:16',16),(47,'Propuesta de Estacionamiento para Bicicletas','Ubicación óptima del nuevo biciestacionamiento.','VOTACION','NV-1047','2026-12-27 23:59:59',1,'2026-11-23 22:08:16',17),(48,'Encuesta de Hábitos de Lectura','Géneros literarios más solicitados para donación.','ENCUESTA','NV-1048','2026-11-18 23:59:59',0,'2026-11-23 22:08:16',2),(49,'Delegado Deportivo de Facultad','Votación general para coordinador deportivo.','VOTACION','NV-1049','2026-12-30 23:59:59',1,'2026-11-23 22:08:16',3),(50,'Consulta sobre Prácticas Profesionales','Duración ideal y esquema híbrido en empresas.','ENCUESTA','NV-1050','2027-01-28 23:59:59',1,'2026-11-23 22:08:16',4);
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
INSERT INTO `flyway_schema_history` VALUES (1,'1','crear tablas','SQL','V1__crear_tablas.sql',-449067127,'root','2026-11-24 04:08:16',394,1),(2,'2','datos prueba','SQL','V2__datos_prueba.sql',-204048550,'root','2026-11-24 04:08:16',42,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opciones`
--

LOCK TABLES `opciones` WRITE;
/*!40000 ALTER TABLE `opciones` DISABLE KEYS */;
INSERT INTO `opciones` VALUES (1,'Candidato 1: Sofía Hernández',1),(2,'Candidato 2: Alejandro Ramírez',1),(3,'Candidato 3: Valeria Castro',1),(4,'100% Presencial en campus',2),(5,'Virtual en vivo (Zoom / Meet)',2),(6,'Híbrido (presencial con grabación)',2),(7,'Mañana (09:00 - 11:00)',3),(8,'Tarde (16:00 - 18:00)',3),(9,'Jueves por la tarde',4),(10,'Viernes por la tarde',4),(11,'Sábado al mediodía',4),(12,'Taquiza tradicional',5),(13,'Comida rápida / Hamburguesas',5),(14,'Auditorio Central',6),(15,'Centro de Convenciones Norte',6),(16,'Excelente',7),(17,'Regular',7),(18,'Necesita mejorar',7),(19,'Barra de café y repostería',8),(20,'Opciones vegetarianas',8),(21,'Lunes y Miércoles 15:00 - 17:00',9),(22,'Martes y Jueves 17:00 - 19:00',9),(23,'Desarrollo Cloud con AWS',10),(24,'Ciberseguridad Aplicada',10),(25,'Arquitectura de Microservicios',10),(26,'Fútbol Rápido',11),(27,'Básquetbol',11),(28,'Vóleibol',11),(29,'DigitalOcean VPS',12),(30,'Amazon Web Services (AWS)',12),(31,'Docker Compose',13),(32,'Kubernetes',13),(33,'Planilla Azul - Innovación',14),(34,'Planilla Verde - Sustentabilidad',14),(35,'Planilla Blanca - Unidad',14),(36,'Voto Nulo / Abstención',14),(37,'Servidores y equipo de redes',15),(38,'Licencias de software y nube',15),(39,'Semanalmente',16),(40,'Ocasionalmente en época de exámenes',16),(41,'Soluciones GovTech y Participación Ciudadana',17),(42,'Sostenibilidad y Energía Limpia',17),(43,'Ruta Norte - Centro Histórico',18),(44,'Ruta Sur - Terminal Autobuses',18),(45,'Fórmula A: Integridad Académica',19),(46,'Fórmula B: Transparencia Activa',19),(47,'Procesamiento de Lenguaje Natural (LLMs)',20),(48,'Visión por Computadora',20),(49,'Azul Marino con detalles blancos',21),(50,'Gris Oxford con bordado institucional',21),(51,'Óptimo para las prácticas actuales',22),(52,'Requiere actualización de memoria RAM',22),(53,'Desarrollo de Software y Cloud',23),(54,'Telecomunicaciones y Ciberseguridad',23),(55,'Mateo Domínguez',24),(56,'Daniela Romero',24),(57,'AWS Cloud Practitioner',25),(58,'Linux Foundation Certified SysAdmin',25),(59,'Sí, permite mayor rotación',26),(60,'No, prefiero bloques de 3 horas',26),(61,'Obra 1: Amanecer en Rectoría',27),(62,'Obra 2: Ciencia en Movimiento',27),(63,'Muy útiles para versionar cambios',28),(64,'Útiles, requieren práctica adicional',28),(65,'Jardín frente a Biblioteca',29),(66,'Explanada de Laboratorios',29),(67,'Edificio de Aulas A',30),(68,'Edificio de Posgrado',30),(69,'Candidato A: Gabriel Ortiz',31),(70,'Candidato B: Renata Aguilar',31),(71,'Rock / Indie Universitario',32),(72,'Música Acústica y Trova',32),(73,'Inglés Técnico B2',33),(74,'Alemán Básico A1',33),(75,'Rápidas (10 min + 5 seg)',34),(76,'Clásicas (30 min)',34),(77,'Micrófonos inalámbricos y consola',35),(78,'Bocinas principales de sala',35),(79,'Miércoles 13:00 - 14:00',36),(80,'Viernes 12:00 - 13:00',36),(81,'Sistema de gestión de asesorías',37),(82,'Mapa interactivo del campus',37),(83,'Martes y Jueves hasta 19:00',38),(84,'Viernes hasta 18:00',38),(85,'Innovación abierta para el futuro',39),(86,'Ingeniería sostenible y digital',39),(87,'Muy satisfactorias',40),(88,'Satisfactorias',40),(89,'Boceto 1: Tecnología y Raíces',41),(90,'Boceto 2: Horizonte Científico',41),(91,'Entrega de tareas y rúbricas claras',42),(92,'Foros y avisos en tiempo real',42),(93,'Emilio Fuentes',43),(94,'Natalia Reyes',43),(95,'Presupuesto e inversión inicial',44),(96,'Impuestos básicos y ahorro',44),(97,'Edificio C (Planta Baja)',45),(98,'Edificio D (Aulas Multimedia)',45),(99,'Europa (España / Alemania)',46),(100,'Norteamérica (Canadá / EE. UU.)',46),(101,'Valorant / Counter-Strike',47),(102,'Rocket League / FIFA',47),(103,'Iluminación en estacionamiento norte',48),(104,'Control de acceso peatonal',48),(105,'Planilla Generación 2027',49),(106,'Planilla Alianza Estudiantil',49),(107,'Taller práctico Capture The Flag (CTF)',50),(108,'Conferencias con expertos de industria',50),(109,'Junto a Acceso Principal',51),(110,'Costado de Cafetería Central',51),(111,'Ciencia ficción y divulgación',52),(112,'Historia y literatura contemporánea',52),(113,'Leonardo Juárez',53),(114,'Paula Salazar',53),(115,'4 meses (tiempo completo)',54),(116,'6 meses (medio tiempo híbrido)',54);
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participaciones`
--

LOCK TABLES `participaciones` WRITE;
/*!40000 ALTER TABLE `participaciones` DISABLE KEYS */;
INSERT INTO `participaciones` VALUES (1,'2026-11-23 22:12:04','COMPLETADA',5,1),(2,NULL,'PENDIENTE',5,2),(3,'2026-11-10 14:20:00','COMPLETADA',5,3),(4,'2026-11-11 10:15:00','COMPLETADA',6,1),(5,'2026-11-11 11:05:00','COMPLETADA',7,1),(6,'2026-11-11 12:30:00','COMPLETADA',8,1),(7,'2026-11-12 09:45:00','COMPLETADA',9,2),(8,'2026-11-12 16:10:00','COMPLETADA',10,3),(9,'2026-11-13 13:00:00','COMPLETADA',11,4),(10,'2026-11-14 15:20:00','COMPLETADA',12,5),(11,'2026-11-15 17:40:00','COMPLETADA',13,6),(12,'2026-11-16 08:50:00','COMPLETADA',14,10),(13,NULL,'PENDIENTE',5,4),(14,NULL,'PENDIENTE',5,5),(15,NULL,'PENDIENTE',5,6),(16,'2026-11-17 09:10:00','COMPLETADA',18,11),(17,'2026-11-17 09:35:00','COMPLETADA',19,12),(18,'2026-11-17 10:05:00','COMPLETADA',20,13),(19,'2026-11-17 10:40:00','COMPLETADA',21,14),(20,'2026-11-17 11:15:00','COMPLETADA',22,15),(21,'2026-11-17 11:50:00','COMPLETADA',23,16),(22,'2026-11-17 12:25:00','COMPLETADA',24,17),(23,'2026-11-17 13:00:00','COMPLETADA',25,18),(24,'2026-11-17 14:10:00','COMPLETADA',26,19),(25,'2026-11-17 15:00:00','COMPLETADA',27,20),(26,'2026-11-18 09:15:00','COMPLETADA',28,21),(27,'2026-11-18 09:45:00','COMPLETADA',29,22),(28,'2026-11-18 10:20:00','COMPLETADA',30,23),(29,'2026-11-18 11:00:00','COMPLETADA',31,24),(30,'2026-11-18 11:30:00','COMPLETADA',32,25),(31,'2026-11-18 12:15:00','COMPLETADA',33,26),(32,'2026-11-18 13:40:00','COMPLETADA',34,27),(33,'2026-11-18 14:20:00','COMPLETADA',35,28),(34,'2026-11-18 15:10:00','COMPLETADA',36,29),(35,'2026-11-18 16:05:00','COMPLETADA',37,30),(36,'2026-11-19 09:00:00','COMPLETADA',38,31),(37,'2026-11-19 09:30:00','COMPLETADA',39,32),(38,'2026-11-19 10:15:00','COMPLETADA',40,33),(39,'2026-11-19 11:00:00','COMPLETADA',41,34),(40,'2026-11-19 11:45:00','COMPLETADA',42,35),(41,'2026-11-19 12:30:00','COMPLETADA',43,36),(42,'2026-11-19 13:15:00','COMPLETADA',44,37),(43,'2026-11-19 14:00:00','COMPLETADA',45,38),(44,'2026-11-19 15:30:00','COMPLETADA',46,39),(45,'2026-11-19 16:20:00','COMPLETADA',47,40),(46,'2026-11-20 09:20:00','COMPLETADA',6,41),(47,'2026-11-20 10:10:00','COMPLETADA',7,42),(48,'2026-11-20 11:05:00','COMPLETADA',8,43),(49,'2026-11-20 12:00:00','COMPLETADA',9,44),(50,'2026-11-20 13:30:00','COMPLETADA',10,45),(51,'2026-11-20 14:45:00','COMPLETADA',11,46),(52,'2026-11-20 16:10:00','COMPLETADA',12,47),(53,'2026-11-23 22:13:45','COMPLETADA',51,3),(54,NULL,'PENDIENTE',51,18),(55,'2026-11-23 22:14:53','COMPLETADA',51,33);
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
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preguntas`
--

LOCK TABLES `preguntas` WRITE;
/*!40000 ALTER TABLE `preguntas` DISABLE KEYS */;
INSERT INTO `preguntas` VALUES (1,'¿Quién debería ser representante del grupo de Programación Web?',1,1),(2,'¿Qué modalidad prefieres para las asesorías del semestre?',1,2),(3,'¿En qué horario te resulta más cómodo asistir a tutorías?',2,2),(4,'¿Qué día de la semana prefieres para la convivencia del grupo?',1,3),(5,'¿Qué tipo de menú prefieres para el evento?',2,3),(6,'¿Cuál sede consideras mejor conectada para el Congreso?',1,4),(7,'¿Cómo calificas la variedad actual de alimentos en cafetería?',1,5),(8,'¿Qué servicio adicional te gustaría ver en cafetería?',2,5),(9,'¿Qué bloque horario prefieres para el Laboratorio de Redes?',1,6),(10,'¿Qué taller técnico te interesa más cursar en 2027?',1,7),(11,'¿Cuál disciplina deportiva debe encabezar el torneo?',1,8),(12,'¿Qué proveedor de nube prefieres para las prácticas?',1,9),(13,'¿Qué gestor de contenedores prefieres utilizar?',2,9),(14,'¿Qué planilla respaldas para la Sociedad de Alumnos?',1,10),(15,'¿A qué rubro debería destinarse mayor porcentaje del presupuesto?',1,11),(16,'¿Con qué frecuencia utilizas los recursos de la biblioteca digital?',1,12),(17,'¿Qué eje temático prefieres para el Hackathon 2027?',1,13),(18,'¿Qué ruta nocturna consideras más prioritaria?',1,14),(19,'¿Qué fórmula respaldas para el Comité de Ética?',1,15),(20,'¿Qué área de Inteligencia Artificial te interesa más?',1,16),(21,'¿Qué combinación de colores prefieres para la sudadera?',1,17),(22,'¿Cómo evalúas el estado actual de los equipos de laboratorio?',1,18),(23,'¿Qué sector empresarial te gustaría ver más representado?',1,19),(24,'¿Quién debe liderar el equipo de Robótica este ciclo?',1,20),(25,'¿Qué certificación técnica priorizarías este semestre?',1,21),(26,'¿Apruebas el límite de 2 horas por reserva en salas de estudio?',1,22),(27,'¿Qué fotografía merece el primer lugar del concurso?',1,23),(28,'¿Qué tan útiles te resultaron las migraciones con Flyway?',1,24),(29,'¿Qué zona del campus requiere reforestación inmediata?',1,25),(30,'¿En qué edificio experimentas mayor intermitencia de Wi-Fi?',1,26),(31,'¿A qué candidato apoyas para el Consejo Técnico?',1,27),(32,'¿Qué género musical debería abrir la jornada cultural?',1,28),(33,'¿Qué nivel de idioma deseas cursar el próximo periodo?',1,29),(34,'¿Qué ritmo de juego prefieres en el torneo de ajedrez?',1,30),(35,'¿Qué componente de audio es más urgente renovar?',1,31),(36,'¿En qué horario asistirías a talleres de bienestar?',1,32),(37,'¿Qué proyecto Open Source desarrollaremos primero?',1,33),(38,'¿Qué día necesitas atención vespertina en Servicios Escolares?',1,34),(39,'¿Qué lema representa mejor la Semana de la Ingeniería 2027?',1,35),(40,'¿Cómo calificas la utilidad de tus tutorías semestrales?',1,36),(41,'¿Qué boceto debe pintarse en el Edificio B?',1,37),(42,'¿Qué función valoras más en el aula virtual?',1,38),(43,'¿Quién debe coordinar los proyectos de Servicio Social?',1,39),(44,'¿Qué tema de finanzas personales te resulta más útil?',1,40),(45,'¿Qué edificio requiere renovación prioritaria de pupitres?',1,41),(46,'¿A qué región te gustaría aplicar para movilidad académica?',1,42),(47,'¿Qué título debe encabezar la Liga de eSports?',1,43),(48,'¿Qué aspecto de seguridad requiere mejora urgente?',1,44),(49,'¿Qué planilla eliges para el Comité de Graduación?',1,45),(50,'¿Qué modalidad prefieres para el seminario de Ciberseguridad?',1,46),(51,'¿Dónde conviene instalar el nuevo biciestacionamiento?',1,47),(52,'¿Qué sección literaria debemos ampliar primero?',1,48),(53,'¿A quién eliges como Delegado Deportivo?',1,49),(54,'¿Qué duración prefieres para las prácticas profesionales?',1,50);
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
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
/*!40000 ALTER TABLE `respuestas` DISABLE KEYS */;
INSERT INTO `respuestas` VALUES (1,3,4,10),(2,3,5,12),(3,4,1,1),(4,5,1,1),(5,6,1,2),(6,7,2,6),(7,7,3,8),(8,8,4,10),(9,8,5,13),(10,9,6,14),(11,10,7,17),(12,10,8,19),(13,11,9,21),(14,12,14,33),(15,16,15,37),(16,17,16,39),(17,18,17,41),(18,19,18,44),(19,20,19,45),(20,21,20,47),(21,22,21,49),(22,23,22,52),(23,24,23,53),(24,25,24,55),(25,26,25,57),(26,27,26,59),(27,28,27,61),(28,29,28,63),(29,30,29,65),(30,31,30,67),(31,32,31,69),(32,33,32,71),(33,34,33,73),(34,35,34,75),(35,36,35,77),(36,37,36,79),(37,38,37,81),(38,39,38,83),(39,40,39,85),(40,41,40,87),(41,42,41,89),(42,43,42,91),(43,44,43,93),(44,45,44,95),(45,46,45,97),(46,47,46,99),(47,48,47,101),(48,49,48,103),(49,50,49,105),(50,51,50,107),(51,52,51,109),(52,1,1,2),(53,53,4,9),(54,53,5,12),(55,55,37,81);
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (1,'eyJhbGciOiJIUzM4NCJ9.eyJpZFVzdWFyaW8iOiIxIiwicm9sIjoiQURNSU4iLCJub21icmUiOiJBZG1pbmlzdHJhZG9yIE5leHRWb3RvIiwic3ViIjoiYWRtaW5AbmV4dHZvdG8uY29tIiwiaWF0IjoxNzk1NDkzMzY3LCJleHAiOjE3OTU1Nzk3Njd9.eBvhO04__-wabkeRxeKLJ6UYCfi4DvfzzoOVhvJ54PgTpOhE5SwKG-yK_afY8_5N','BLACKLIST','2026-11-24 22:09:27',1),(2,'eyJhbGciOiJIUzM4NCJ9.eyJpZFVzdWFyaW8iOiI1Iiwicm9sIjoiVk9UQU5URSIsIm5vbWJyZSI6Ik1pZ3VlbCBTYW5kb3ZhbCBSZXllcyIsInN1YiI6Im1pZ3VlbEBuZXh0dm90by5jb20iLCJpYXQiOjE3OTU0OTM0OTQsImV4cCI6MTc5NTU3OTg5NH0.EAoyV1m7E9_F-J3h-xvV7JyrMl07ixNkhLpGoVFnX6THXFGao3OfkWW5mk7QLoua','BLACKLIST','2026-11-24 22:11:34',5),(3,'eyJhbGciOiJIUzM4NCJ9.eyJpZFVzdWFyaW8iOiI1MSIsInJvbCI6IlZPVEFOVEUiLCJub21icmUiOiJJcnZpbmcgSm9zZSBQZXJleiBHcmlzIiwic3ViIjoiaXJ2aW5nam9zZXBlcmV6Z3JpczEzN0BnbWFpbC5jb20iLCJpYXQiOjE3OTU0OTM1OTgsImV4cCI6MTc5NTU3OTk5OH0.3k-40J8T6lcQUUt0Xk8KNK08IiNWw0A6ZqaQBQgXAFlHktjNZ7goJPrfVhb-5qJK','BLACKLIST','2026-11-24 22:13:18',51),(5,'eyJhbGciOiJIUzM4NCJ9.eyJpZFVzdWFyaW8iOiI1MSIsInJvbCI6IlZPVEFOVEUiLCJub21icmUiOiJJcnZpbmcgSm9zZSBQZXJleiBHcmlzIiwic3ViIjoiaXJ2aW5nam9zZXBlcmV6Z3JpczEzN0BnbWFpbC5jb20iLCJpYXQiOjE3OTU0OTM3MzIsImV4cCI6MTc5NTU4MDEzMn0.fI7bWMldqkQeVBHSlOW_2sz_QMygRa1MEATs0pLwa-avEZ7o9ksKoe61kVvB5aD4','BLACKLIST','2026-11-24 22:15:32',51);
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
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Administrador NextVoto','admin@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000001',1,'2026-11-23 22:08:16',1),(2,'Prof. Carlos Mendoza','carlos.mendoza@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000002',1,'2026-11-23 22:08:16',2),(3,'Dra. Laura Gómez','laura.gomez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000003',1,'2026-11-23 22:08:16',2),(4,'Ing. Roberto Díaz','roberto.diaz@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000004',1,'2026-11-23 22:08:16',2),(5,'Miguel Sandoval Reyes','miguel@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+529514440330',1,'2026-11-23 22:08:16',3),(6,'Ana Sofía Torres','ana.torres@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000006',1,'2026-11-23 22:08:16',3),(7,'Luis Fernando Ruiz','luis.ruiz@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000007',1,'2026-11-23 22:08:16',3),(8,'Valeria Castro Pérez','valeria.castro@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000008',1,'2026-11-23 22:08:16',3),(9,'Diego Morales López','diego.morales@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000009',1,'2026-11-23 22:08:16',3),(10,'Fernanda Silva Ortíz','fernanda.silva@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000010',1,'2026-11-23 22:08:16',3),(11,'Jorge Herrera Cruz','jorge.herrera@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000011',1,'2026-11-23 22:08:16',3),(12,'Camila Vargas Soto','camila.vargas@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000012',1,'2026-11-23 22:08:16',3),(13,'Andrés Navarro Ríos','andres.navarro@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000013',1,'2026-11-23 22:08:16',3),(14,'Mariana Delgado Gil','mariana.delgado@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000014',1,'2026-11-23 22:08:16',3),(15,'Usuario Inactivo Demo','inactivo@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000015',0,'2026-11-23 22:08:16',3),(16,'Mtra. Patricia Morales','patricia.morales@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000016',1,'2026-11-23 22:08:16',2),(17,'Dr. Héctor Ramírez','hector.ramirez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000017',1,'2026-11-23 22:08:16',2),(18,'Sofía Hernández Luna','sofia.hernandez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000018',1,'2026-11-23 22:08:16',3),(19,'Alejandro Ramírez Vega','alejandro.ramirez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000019',1,'2026-11-23 22:08:16',3),(20,'Gabriela Ortiz Méndez','gabriela.ortiz@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000020',1,'2026-11-23 22:08:16',3),(21,'Sebastián Paredes Solís','sebastian.paredes@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000021',1,'2026-11-23 22:08:16',3),(22,'Renata Aguilar Campos','renata.aguilar@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000022',1,'2026-11-23 22:08:16',3),(23,'Mateo Domínguez Pardo','mateo.dominguez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000023',1,'2026-11-23 22:08:16',3),(24,'Daniela Romero Cárdenas','daniela.romero@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000024',1,'2026-11-23 22:08:16',3),(25,'Emilio Fuentes León','emilio.fuentes@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000025',1,'2026-11-23 22:08:16',3),(26,'Natalia Reyes Cabrera','natalia.reyes@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000026',1,'2026-11-23 22:08:16',3),(27,'Leonardo Juárez Peña','leonardo.juarez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000027',1,'2026-11-23 22:08:16',3),(28,'Paula Salazar Mejía','paula.salazar@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000028',1,'2026-11-23 22:08:16',3),(29,'Rodrigo Guzmán Ponce','rodrigo.guzman@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000029',1,'2026-11-23 22:08:16',3),(30,'Jimena Chávez Ibarra','jimena.chavez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000030',1,'2026-11-23 22:08:16',3),(31,'Eduardo Lozano Rivas','eduardo.lozano@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000031',1,'2026-11-23 22:08:16',3),(32,'Ximena Cortés Bravo','ximena.cortes@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000032',1,'2026-11-23 22:08:16',3),(33,'Iván Mendoza Franco','ivan.mendoza@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000033',1,'2026-11-23 22:08:16',3),(34,'Regina Espinoza Tapia','regina.espinoza@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000034',1,'2026-11-23 22:08:16',3),(35,'Óscar Carrillo Montes','oscar.carrillo@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000035',1,'2026-11-23 22:08:16',3),(36,'Andrea Pacheco Rosas','andrea.pacheco@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000036',1,'2026-11-23 22:08:16',3),(37,'Fernando Villanueva Mora','fernando.villanueva@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000037',1,'2026-11-23 22:08:16',3),(38,'Melissa Acosta Barrios','melissa.acosta@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000038',1,'2026-11-23 22:08:16',3),(39,'Mauricio Estrada Serrano','mauricio.estrada@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000039',1,'2026-11-23 22:08:16',3),(40,'Karla Miranda Orozco','karla.miranda@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000040',1,'2026-11-23 22:08:16',3),(41,'Héctor Sandoval Téllez','hector.sandoval@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000041',1,'2026-11-23 22:08:16',3),(42,'Lucía Bautista Galván','lucia.bautista@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000042',1,'2026-11-23 22:08:16',3),(43,'Ricardo Benítez Coronado','ricardo.benitez@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000043',1,'2026-11-23 22:08:16',3),(44,'Monserrat Zamora Trejo','monserrat.zamora@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000044',1,'2026-11-23 22:08:16',3),(45,'César Nava Domínguez','cesar.nava@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000045',1,'2026-11-23 22:08:16',3),(46,'Paola Cisneros Lara','paola.cisneros@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000046',1,'2026-11-23 22:08:16',3),(47,'Arturo Robles Castañeda','arturo.robles@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000047',1,'2026-11-23 22:08:16',3),(48,'Verónica Salgado Beltrán','veronica.salgado@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000048',0,'2026-11-23 22:08:16',3),(49,'Samuel Ochoa Valenzuela','samuel.ochoa@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000049',0,'2026-11-23 22:08:16',3),(50,'Elena Roldán Escamilla','elena.roldan@nextvoto.com','$2a$10$QDdUAz4dHkSubnO9/8WaK.soxeRgiMkJvozkQY63rGS4QHHaaES.y','+525510000050',0,'2026-11-23 22:08:16',3),(51,'Irving Jose Perez Gris','irvingjoseperezgris137@gmail.com','$2a$10$A7r2Py3Cn/8pb727cM2fdO2bYkj6DoWJo3Qw47/bwz3c25OTR39QK','9514160230',1,'2026-11-23 22:13:19',3);
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

-- Dump completed on 2026-11-23 22:26:49
