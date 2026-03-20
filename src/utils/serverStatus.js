import { checkBackendHealth } from "../api/baseApi";

// Cuanto tiempo guardar el estado del servidor en cache para evitar múltiples llamadas seguidas al servidor
const CACHE_DURACION_MS = 30_000; // 30 segundos


// Estas dos variables "recuerdan" el último resultado entre llamadas.
// Viven fuera de la función para que no se reinicien cada vez que la llamas.

// null = "todavía no sabemos si el servidor está disponible"
// true/false = ya lo verificamos
let servidorDisponible = null;

// Guarda el momento exacto de la última verificación (en milisegundos)
// null = nunca hemos verificado
let ultimaVerificacion = null;

export const obtenerEstadoServidor = async () => {
    const ahora = Date.now();

    // Calculamos si el caché sigue siendo válido verificando 3 condiciones:
    const cacheValido =
        servidorDisponible !== null &&   // 1. Ya tenemos un resultado previo
        ultimaVerificacion !== null &&   // 2. Tenemos registrado cuándo fue
        ahora - ultimaVerificacion < CACHE_DURACION_MS; // 3. Han pasado menos de 30 segundos
    // Ejemplo: ahora=1000, ultimaVerificacion=980, diferencia=20ms < 30000ms = válido

    if (cacheValido) return servidorDisponible;

    try {
        const res = await checkBackendHealth();

        // Si el status es exactamente "UP", guardamos true. Si no, false.
        servidorDisponible = res.data?.status === "UP";
    } catch {
        servidorDisponible = false;
    }

    // Guardamos el momento en que hicimos esta verificación
    // La próxima vez que alguien llame esta función, sabremos cuándo fue la última vez
    ultimaVerificacion = Date.now();
    return servidorDisponible;
};

// Forzar una re-verificación (ej. al hacer refresh o reintento de login)
export const resetEstadoServidor = () => {
    servidorDisponible = null;
    ultimaVerificacion = null;
};