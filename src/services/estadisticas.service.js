import {
  getEstadisticasSocio,
  postRegistrarVistaSpot,
} from "@/api/estadisticasApi";
import { obtenerAccessToken } from "@/utils/sessionHelper";

/**
 * Estadísticas reales del socio: visitas, reseñas, calificación promedio y
 * usos de promociones, agregadas por el backend para el período solicitado.
 * periodos válidos: "semana", "mes", "ano".
 */
export const obtenerEstadisticasSocio = async (periodo = "mes") => {
  try {
    const token = obtenerAccessToken();
    if (!token) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para ver tus estadísticas.",
      };
    }

    const response = await getEstadisticasSocio(periodo);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "",
    };
  } catch (error) {
    let mensaje = "Error al cargar las estadísticas";

    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para ver estas estadísticas.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Registra una visita a un local de forma manual. El backend ya registra
 * visitas al abrir el detalle de un local (GET /spots/:id); este helper
 * sirve para registrar desde otras vistas (p. ej. el mapa).
 */
export const registrarVistaLocal = async (id) => {
  try {
    await postRegistrarVistaSpot(id);
    return { exitoso: true };
  } catch {
    return { exitoso: false };
  }
};