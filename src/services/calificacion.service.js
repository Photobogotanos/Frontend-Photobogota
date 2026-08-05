import {
  getCalificacionesBySpot,
  postCrearCalificacion,
  putActualizarCalificacion,
} from "@/api/calificacion";
import { obtenerAccessToken, obtenerSesion } from "@/utils/sessionHelper";

export const obtenerCalificacionesDelSpot = async (spotId) => {
  try {
    console.log("Obteniendo calificaciones del spot:", spotId);

    const response = await getCalificacionesBySpot(spotId);

    console.log("Calificaciones obtenidas:", response.data?.length || 0);

    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Calificaciones obtenidas exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error al obtener calificaciones:", error);

    let mensaje = "Error al obtener las calificaciones";

    if (error.response) {
      mensaje =
        error.response.data?.message ||
        error.response.data?.mensaje ||
        mensaje;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor";
    }

    return {
      exitoso: false,
      datos: [],
      mensaje: mensaje,
      esMock: false,
    };
  }
};

export const crearCalificacion = async (spotId, body) => {
  try {
    const token = obtenerAccessToken();

    if (!token) {
      const sesion = obtenerSesion();

      if (!sesion) {
        return {
          exitoso: false,
          datos: null,
          mensaje: "Debes iniciar sesión para calificar un spot",
        };
      }

      return {
        exitoso: false,
        datos: null,
        mensaje: "No se encontró token de autenticación. Por favor inicia sesión nuevamente.",
      };
    }

    console.log("Creando calificación para spot:", spotId, body);

    const response = await postCrearCalificacion(spotId, body);

    console.log("Calificación creada:", response.data);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Calificación creada exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error al crear calificación:", error);

    let mensaje = "Error al crear la calificación";

    if (error.response) {
      mensaje =
        error.response.data?.message ||
        error.response.data?.mensaje ||
        mensaje;

      if (error.response.status === 409) {
        mensaje = "Ya calificaste este spot. Podés editar tu calificación.";
      } else if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para crear esta calificación.";
      } else if (error.response.status === 400) {
        mensaje = error.response.data?.message || "Datos inválidos. Verifica todos los campos.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    return {
      exitoso: false,
      datos: null,
      mensaje: mensaje,
      esMock: false,
    };
  }
};

export const actualizarCalificacion = async (spotId, calificacionId, body) => {
  try {
    const token = obtenerAccessToken();

    if (!token) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para editar tu calificación",
      };
    }

    console.log("Actualizando calificación:", spotId, calificacionId, body);

    const response = await putActualizarCalificacion(spotId, calificacionId, body);

    console.log("Calificación actualizada:", response.data);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Calificación actualizada exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error al actualizar calificación:", error);

    let mensaje = "Error al actualizar la calificación";

    if (error.response) {
      mensaje =
        error.response.data?.message ||
        error.response.data?.mensaje ||
        mensaje;

      if (error.response.status === 403 || error.response.status === 404) {
        mensaje = "No se pudo actualizar la calificación. No se encontró o no tienes permiso.";
      } else if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 400) {
        mensaje = error.response.data?.message || "Datos inválidos. Verifica todos los campos.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    return {
      exitoso: false,
      datos: null,
      mensaje: mensaje,
      esMock: false,
    };
  }
};