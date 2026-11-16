# NextVoto — Plataforma Web de Votaciones y Encuestas

Aplicación web para gestionar procesos de votación y encuestas académicas o institucionales mediante.

---

## 👥 Integrantes del Equipo
* **Irving José Perez Gris** 
* **[Nombre Compañero 2]** 
* **[Nombre Compañero 3]** 


## 🔗 Enlaces del Proyecto (Entregables)
* **Aplicación Desplegada (VPS con HTTPS):**
* **URL Base de la API REST:** *(En local: `http://localhost:8080/api`)*
* **Tablero de GitHub Projects (Público):** 
* **Prototipo Navegable en Figma:** `https://www.figma.com/file/PENDIENTE_LINK_FIGMA`


##  Stack Tecnológico

### Backend
* **Java 17** & **Spring Boot 4.1.2**
* **Spring Security + JWT (JJWT 0.12.6)** con encriptación **BCrypt**
* **Spring Data JPA / Hibernate** + **Bean Validation**
* **MySQL 8** con control de versiones de esquema mediante **Flyway** (`V1` y `V2`)
* **JavaMailSender** (conectado a servidor **Postfix** propio en VPS con SPF/DKIM)
* **Twilio SDK** (envío real de **SMS** y **WhatsApp**)

### Frontend
* **React** + **Vite**
* **React Router DOM** (rutas protegidas por rol)
* **Axios** (interceptors para inyección automática de `Bearer Token`)
* **Lucide React** (iconografía)

### Pruebas e Infraestructura
* **Bruno** (colección de pruebas de endpoints versionada en `/bruno`)
* **VPS Linux + Nginx + Certbot (Let's Encrypt SSL)**


## 🔐 Credenciales de Prueba (Evaluación)

Todas las cuentas de prueba cargadas automáticamente por Flyway (`V2__datos_prueba.sql`) comparten la contraseña **`NextVoto2026!`**:

| Rol | Correo Electrónico | Contraseña | Permisos |
| :--- | :--- | :--- | :--- |
| **Administrador (Fijo)** | `admin@nextvoto.com` | `NextVoto2026!` | Acceso total, CRUD de usuarios, gestión de roles y supervisión global |
| **Moderador** | `carlos.mendoza@nextvoto.com` | `NextVoto2026!` | Creación de encuestas/votaciones, generación de PIN, cierre y resultados |
| **Votante** | `miguel@nextvoto.com` | `NextVoto2026!` | Canjeo de PIN, emisión de voto único e historial de participación |

---

## Arquitectura de Base de Datos

El modelo relacional consta de **8 tablas normalizadas** (`roles`, `usuarios`, `tokens`, `encuestas`, `preguntas`, `opciones`, `participaciones`, `respuestas`) con relación N:M entre usuarios y encuestas resuelta mediante `participaciones`.

### Diagrama Entidad-Relación (DER)
![Diagrama Entidad-Relación](./docs/DER.png)

### Modelo Relacional
![Modelo Relacional](./docs/Modelo%20Relacional.png)

> El respaldo completo de estructura y datos de prueba se encuentra en [`./docs/respaldo_nextvoto.sql`](./docs/respaldo_nextvoto.sql).


## ⚙️ Instrucciones de Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/IrvingJosePG/Nextvoto.git
cd Nextvoto
```

### 2. Configurar y ejecutar el Backend (Spring Boot)
Crea una base de datos vacía en MySQL 8:

```sql
CREATE DATABASE nextvoto_final_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Copia el archivo de ejemplo de propiedades y coloca tus credenciales locales:

```bash
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

Edita `application.properties` con tu usuario/contraseña de MySQL y una clave `jwt.secret` en Base64.

Ejecuta el servidor (Flyway creará las tablas y cargará los datos semilla automáticamente):

```bash
cd backend
./mvnw spring-boot:run
```

### 3. Configurar y ejecutar el Frontend (React)
```bash
cd frontend
npm install
npm run dev
```