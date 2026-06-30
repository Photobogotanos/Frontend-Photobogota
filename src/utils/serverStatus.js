import { checkBackendHealth } from "../api/baseApi";

// Configuración del cache
// Cuando el servidor está ONLINE confiamos más tiempo en el cache
// (no tiene sentido golpear /actuator/health cada 3s si todo está bien).
// Cuando está OFFLINE revisamos más seguido para detectar que volvió.
const CACHE_DURACION_ONLINE_MS = 30000; // 30s
const CACHE_DURACION_OFFLINE_MS = 5000; // 5s
const POLLING_INTERVAL_MS = 8000; 

let servidorDisponible = null;
let ultimaVerificacion = null;
let pollingInterval = null;
let listeners = new Set(); // Para notificar cambios de estado

// Notificar a todos los listeners
const notificarCambio = (estado) => {
  listeners.forEach((listener) => listener(estado));
};

// Función interna para verificar el servidor
const verificarServidor = async () => {
  try {
    const online = await checkBackendHealth();

    if (servidorDisponible !== online) {
      servidorDisponible = online;
      notificarCambio(online);
    }

    ultimaVerificacion = Date.now();

    // Si volvió a estar online, detenemos el polling de inmediato.
    if (online) {
      detenerPolling();
    } else {
      // Si está offline, aseguramos que el polling esté activo.
      iniciarPolling();
    }

    return online;
  } catch {
    if (servidorDisponible !== false) {
      servidorDisponible = false;
      notificarCambio(false);
    }
    ultimaVerificacion = Date.now();
    iniciarPolling();
    return false;
  }
};

// Iniciar polling cuando el servidor está offline
const iniciarPolling = () => {
  if (pollingInterval) return;

  pollingInterval = setInterval(async () => {
    const online = await verificarServidor();
    if (online) {
      detenerPolling();
    }
  }, POLLING_INTERVAL_MS);
};

const detenerPolling = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
};

// Obtener estado del servidor (con cache adaptativo)
export const obtenerEstadoServidor = async () => {
  const ahora = Date.now();

  const duracionCache =
    servidorDisponible === true
      ? CACHE_DURACION_ONLINE_MS
      : CACHE_DURACION_OFFLINE_MS;

  const cacheValido =
    servidorDisponible !== null &&
    ultimaVerificacion !== null &&
    ahora - ultimaVerificacion < duracionCache;

  if (cacheValido) {
    return servidorDisponible;
  }

  return await verificarServidor();
};

// Iniciar monitoreo continuo del servidor
export const iniciarMonitoreoServidor = () => {
  // Hacer verificación inicial
  obtenerEstadoServidor().then((online) => {
    if (!online) {
      iniciarPolling();
    }
  });

  // Retornar función de limpieza
  return () => {
    detenerPolling();
    listeners.clear();
  };
};

// Suscribirse a cambios de estado del servidor
export const suscribirEstadoServidor = (callback) => {
  listeners.add(callback);

  // Retornar función para desuscribirse
  return () => {
    listeners.delete(callback);
  };
};

// Obtener estado actual sincrónicamente (útil para componentes)
export const getCurrentServerStatus = () => {
  return servidorDisponible;
};

// Resetear todo el estado
export const resetEstadoServidor = () => {
  servidorDisponible = null;
  ultimaVerificacion = null;
  detenerPolling();
  listeners.clear();
};
