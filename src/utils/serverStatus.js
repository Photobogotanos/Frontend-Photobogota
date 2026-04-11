import { checkBackendHealth } from "../api/baseApi";

// Configuración del cache
const CACHE_DURACION_MS = 3000;
const POLLING_INTERVAL_MS = 4000; // 4 segundos para polling

let servidorDisponible = null;
let ultimaVerificacion = null;
let pollingInterval = null;
let listeners = new Set(); // Para notificar cambios de estado

// Notificar a todos los listeners
const notificarCambio = (estado) => {
    listeners.forEach(listener => listener(estado));
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
        return online;
    } catch {
        if (servidorDisponible !== false) {
            servidorDisponible = false;
            notificarCambio(false);
        }
        ultimaVerificacion = Date.now();
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

// Obtener estado del servidor (con cache)
export const obtenerEstadoServidor = async () => {
    const ahora = Date.now();
    
    const cacheValido = 
        servidorDisponible !== null &&
        ultimaVerificacion !== null &&
        ahora - ultimaVerificacion < CACHE_DURACION_MS;
    
    if (cacheValido) {
        return servidorDisponible;
    }
    
    return await verificarServidor();
};

// Iniciar monitoreo continuo del servidor
export const iniciarMonitoreoServidor = () => {
    // Hacer verificación inicial
    obtenerEstadoServidor().then(online => {
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