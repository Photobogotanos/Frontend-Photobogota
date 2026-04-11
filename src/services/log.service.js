import { getLogsAdmin, getLogFilesAdmin } from "@/api/logApi";

// ─── GENERADOR DEMO (mismo formato Logback) ───────────────────────────────────
const generarLogAleatorio = () => {
  const nivelesPadding = {
    INFO: "INFO ",
    WARN: "WARN ",
    ERROR: "ERROR",
    DEBUG: "DEBUG",
  };
  const threads = [
    "http-nio-8080-exec-1",
    "http-nio-8080-exec-2",
    "http-nio-8080-exec-3",
    "scheduling-1",
    "task-executor-1",
    "http-nio-8080-exec-5",
  ];
  const loggers = [
    "com.photobogota.api.controller.AdminController",
    "com.photobogota.api.service.ImageService",
    "com.photobogota.api.security.JwtAuthenticationFilter",
    "com.photobogota.api.repository.UserRepository",
    "com.photobogota.api.service.AuditService",
    "com.photobogota.api.exception.GlobalExceptionHandler",
    "org.springframework.security.web.FilterChainProxy",
    "org.springframework.web.servlet.DispatcherServlet",
    "org.mongodb.driver.connection",
    "com.photobogota.api.controller.PhotoController",
  ];
  const mensajes = {
    INFO: [
      "Iniciando aplicación PhotoBogotaApplication...",
      "Conexión establecida con MongoDB en puerto 27017",
      "JWT Token validado exitosamente para el usuario admin@photobogota.com",
      "Petición GET /api/usuarios recibida",
      "Cache de imágenes limpiado correctamente",
      "Usuario autenticado: admin@photobogota.com",
      "Endpoint /api/photos invocado con parámetros page=1, size=20",
      "Generando reporte de auditoría semanal...",
      "Servicio iniciado en puerto 8080",
      "Application context loaded successfully",
    ],
    WARN: [
      "Memoria del sistema: 78% en uso",
      "Tiempo de respuesta lento: 2.5s en /api/imagenes",
      "Pool de conexiones cerca del límite: 45/50",
      "Token JWT próximo a expirar: 5 minutos restantes",
      "Usuario no tiene permisos completos para esta operación",
      "Archivo de configuración application.yml tiene propiedades deprecadas",
      "Caché de imágenes alcanzó 80% de capacidad",
      "Request rate limit: 95/100 requests por minuto",
    ],
    ERROR: [
      "Error al intentar cargar imagen: photobogota_01.jpg - Timeout",
      "Spring Security: Acceso denegado para /api/admin/logs",
      "MongoDB: Conexión perdida - Reconectando...",
      "NullPointerException al procesar imagen sin metadatos",
      "FileNotFoundException: /uploads/photobogota_02.jpg",
      "SQLException: Cannot get JDBC Connection",
      "JWT verification failed: Token expired",
      "IOException: Failed to write image to disk",
    ],
    DEBUG: [
      "Hibernate: select u1_0.id,u1_0.email from usuarios u1_0",
      "Entering JwtAuthenticationFilter.doFilterInternal()",
      "UserDetails loaded: admin@photobogota.com with authorities [ROLE_ADMIN]",
      "Cache hit for key: 'image_12345'",
      "Query executed in 45ms: find({status: 'ACTIVE'})",
      "Authentication success for user: admin@photobogota.com",
      "Processing request with headers: {Authorization: Bearer...}",
      "Exiting GlobalExceptionHandler with response status 500",
    ],
  };

  const niveles = ["INFO", "WARN", "ERROR", "DEBUG"];
  const nivel = niveles[Math.floor(Math.random() * niveles.length)];
  const thread = threads[Math.floor(Math.random() * threads.length)];
  const logger = loggers[Math.floor(Math.random() * loggers.length)];
  const mensaje =
    mensajes[nivel][Math.floor(Math.random() * mensajes[nivel].length)];
  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 23);

  return `${timestamp} [${thread}] ${nivelesPadding[nivel]} ${logger} - ${mensaje}`;
};

const generarLogsDemo = (cantidad = 100, errorsOnly = false) => {
  const logs = Array.from({ length: cantidad }, generarLogAleatorio);
  return errorsOnly ? logs.filter((l) => l.includes("ERROR")) : logs;
};

const ARCHIVOS_DEMO = [
  { nombre: "photobogota.log", tamaño: 102450, fecha: Date.now() },
  { nombre: "photobogota-error.log", tamaño: 5420, fecha: Date.now() },
];

// ─── SERVICIOS ────────────────────────────────────────────────────────────────

/**
 * Obtener logs del servidor con fallback a demo
 * @param {number} lines
 * @param {boolean} errorsOnly
 * @returns {Promise<{ exitoso: boolean, esDemo: boolean, data: string[], mensaje?: string }>}
 */
export const obtenerLogs = async (lines = 100, errorsOnly = false) => {
  try {
    const respuesta = await getLogsAdmin(lines, errorsOnly);
    return {
      exitoso: true,
      esDemo: false,
      data: respuesta.data,
    };
  } catch (error) {
    console.warn("Error al obtener logs reales, usando demo:", error.message);
    return {
      exitoso: true,
      esDemo: true,
      data: generarLogsDemo(lines, errorsOnly),
    };
  }
};

/**
 * Obtener lista de archivos de log con fallback a demo
 * @returns {Promise<{ exitoso: boolean, esDemo: boolean, data: Array }>}
 */
export const obtenerArchivosLog = async () => {
  try {
    const respuesta = await getLogFilesAdmin();
    // El backend devuelve { nombre, tamaño, fecha } — adaptar si el DTO usa otros nombres
    const archivos = respuesta.data.map((f) => ({
      nombre: f.name,
      tamaño: f.size,
      fecha: f.lastModified,
    }));
    return { exitoso: true, esDemo: false, data: archivos };
  } catch (error) {
    console.warn(
      "Error al obtener archivos de log, usando demo:",
      error.message,
    );
    return { exitoso: true, esDemo: true, data: ARCHIVOS_DEMO };
  }
};

/**
 * Genera un único log aleatorio para el auto-refresh demo
 */
export const generarLogDemo = () => generarLogAleatorio();
