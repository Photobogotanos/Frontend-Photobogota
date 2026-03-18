
import { checkBackendHealth } from "../api/baseApi";

let servidorDisponible = null;

export const obtenerEstadoServidor = async () => {
   
    if (servidorDisponible === true) return true;

    try {
        const res = await checkBackendHealth();
        servidorDisponible = res.data?.status === "UP";
    } catch {
        servidorDisponible = false;
    }
    return servidorDisponible;
};

// Forzar una re-verificación (Si el usuario hace refresh o intenta login de nuevo)
export const resetEstadoServidor = () => {
    servidorDisponible = null;
};