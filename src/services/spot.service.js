import {
  getSpots,
  getSpotById,
  postCrearSpot,
  putActualizarSpot,
  patchToggleSpot,
} from "@/api/spotApi";
import { obtenerAccessToken, obtenerSesion } from "@/utils/sessionHelper";
import { esLocalDeshabilitado } from "@/utils/spot.util";
import {
  getSpots as getMockSpots,
  getSpotById as getMockSpotById,
} from "@/mocks/spots.helpers";

/**
 * Obtener todos los spots con filtros opcionales
 * Con fallback a mocks si el servidor no está disponible
 */
export const obtenerSpots = async (filtros = {}) => {
  try {
    console.log("Obteniendo spots con filtros:", filtros);

    const response = await getSpots(filtros);

    // Defensa cliente: los locales deshabilitados por su socio no aparecen en
    // el mapa ni en listados públicos hasta que se reactiven.
    const datos = Array.isArray(response.data)
      ? response.data.filter((spot) => !esLocalDeshabilitado(spot))
      : [];

    console.log("Spots obtenidos del backend:", response.data?.length || 0);

    return {
      exitoso: true,
      datos,
      mensaje: "Spots obtenidos exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.warn("Error al obtener spots del backend, usando mocks:", error);

    // Fallback a datos mock
    let spotsMock = getMockSpots().filter((spot) => !esLocalDeshabilitado(spot));

    // Aplicar filtros a los mocks
    if (filtros.categoria) {
      spotsMock = spotsMock.filter(
        (spot) =>
          spot.categoria?.toLowerCase() === filtros.categoria.toLowerCase(),
      );
    }
    if (filtros.localidad) {
      spotsMock = spotsMock.filter(
        (spot) =>
          spot.localidad?.toLowerCase() === filtros.localidad.toLowerCase(),
      );
    }

    console.log("Spots obtenidos de mocks:", spotsMock.length);

    return {
      exitoso: true,
      datos: spotsMock,
      mensaje: "Mostrando datos de demostración",
      esMock: true,
    };
  }
};

/**
 * Obtener los spots del socio logueado que son de tipo LOCAL.
 * Contrato con backend: GET /spots?tipo=LOCAL&mios=true (autenticado).
 * Sin fallback a mocks: si no hay locales (o el backend aún no responde con
 * el filtro), retorna lista vacía para que la UI muestre el estado vacío.
 */
export const obtenerMisLocales = async () => {
  try {
    console.log("Obteniendo mis locales (tipo=LOCAL, mios=true)...");

    const response = await getSpots({ tipo: "LOCAL", mios: true });

    console.log("Locales obtenidos del backend:", response.data?.length || 0);

    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Locales obtenidos exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.warn("No se pudieron obtener los locales propios:", error);
    return {
      exitoso: true,
      datos: [],
      mensaje: "Aún no tienes locales registrados.",
      esMock: false,
    };
  }
};

/**
 * Obtener un spot por su ID
 * Con fallback a mocks si el servidor no está disponible
 */
export const obtenerSpotPorId = async (id, options = {}) => {
  try {
    console.log("Obteniendo spot por ID:", id);

    const response = await getSpotById(id, { signal: options.signal });

    console.log("Spot obtenido del backend:", response.data?.nombre);

    return {
      exitoso: true,
      datos: response.data || null,
      mensaje: "Spot obtenido exitosamente",
      esMock: false,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("Petición de spot cancelada:", id);
      return {
        exitoso: false,
        datos: null,
        mensaje: "Petición cancelada",
        esMock: false,
        aborted: true,
      };
    }

    console.warn("Error al obtener spot del backend, usando mocks:", error);

    // Fallback a datos mock
    const spotMock = getMockSpotById(id);

    if (spotMock) {
      console.log("Spot obtenido de mocks:", spotMock.nombre);
      return {
        exitoso: true,
        datos: spotMock,
        mensaje: "Mostrando datos de demostración",
        esMock: true,
      };
    }

    let mensaje = "Error al obtener el spot";

    if (error.response?.status === 404) {
      mensaje = "El spot no existe";
    } else if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor";
    }

    return {
      exitoso: false,
      datos: null,
      mensaje: mensaje,
      esMock: false,
    };
  }
};

/**
 * Crear un nuevo spot
 * (No tiene fallback a mock porque requiere autenticación)
 */
export const crearSpot = async (spotData) => {
  try {
    const token = obtenerAccessToken();

    if (!token) {
      const sesion = obtenerSesion();
      console.log("Sesión activa:", sesion ? `Sí (${sesion.username})` : "No");

      if (!sesion) {
        return {
          exitoso: false,
          datos: null,
          mensaje: "No hay sesión activa. Por favor inicia sesión nuevamente.",
        };
      }

      return {
        exitoso: false,
        datos: null,
        mensaje:
          "No se encontró token de autenticación. Por favor inicia sesión nuevamente.",
      };
    }

    console.log("Enviando spot al backend:", spotData);

    const response = await postCrearSpot(spotData);

    console.log("Respuesta del backend:", response.data);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Spot creado exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error en crearSpot:", error);

    let mensaje = "Error al crear el spot";

    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      console.error(
        "Error response:",
        error.response.status,
        error.response.data,
      );

      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para crear spots.";
      } else if (error.response.status === 400) {
        mensaje =
          error.response.data?.message ||
          "Datos inválidos. Verifica todos los campos.";
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

const requerirTokenValido = () => {
  const token = obtenerAccessToken();
  if (token) return { token };

  const sesion = obtenerSesion();
  return { sesion };
};

/**
 * Actualiza los datos públicos de un local existente (contacto, horarios,
 * descripción y fotografías). Solo el socio dueño del local puede hacerlo.
 * Contrato con backend: PUT /spots/:id (autenticado).
 */
export const actualizarLocal = async (id, spotData) => {
  try {
    const valido = requerirTokenValido();

    if (!valido.token) {
      if (!valido.sesion) {
        return {
          exitoso: false,
          datos: null,
          mensaje: "No hay sesión activa. Por favor inicia sesión nuevamente.",
        };
      }
      return {
        exitoso: false,
        datos: null,
        mensaje:
          "No se encontró token de autenticación. Por favor inicia sesión nuevamente.",
      };
    }

    console.log("Actualizando local:", id, spotData);

    const response = await putActualizarSpot(id, spotData);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Local actualizado exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error en actualizarLocal:", error);

    let mensaje = "Error al actualizar el local";

    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;

      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para editar este local.";
      } else if (error.response.status === 404) {
        mensaje = "El local no existe.";
      } else if (error.response.status === 400) {
        mensaje =
          error.response.data?.message ||
          error.response.data?.mensaje ||
          "Datos inválidos. Verifica todos los campos.";
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

/**
 * Alterna la visibilidad pública de un local del socio: deshabilitado deja de
 * aparecer en el mapa y habilitado vuelve a mostrarse. Solo el mismo socio
 * puede reactivar su local desde su apartado "Mis Locales".
 * Contrato con backend: PATCH /spots/:id/toggle (autenticado).
 */
export const cambiarVisibilidadLocal = async (id) => {
  try {
    const valido = requerirTokenValido();

    if (!valido.token) {
      if (!valido.sesion) {
        return {
          exitoso: false,
          datos: null,
          mensaje: "No hay sesión activa. Por favor inicia sesión nuevamente.",
        };
      }
      return {
        exitoso: false,
        datos: null,
        mensaje:
          "No se encontró token de autenticación. Por favor inicia sesión nuevamente.",
      };
    }

    const response = await patchToggleSpot(id);

    const deshabilitado =
      response.data && response.data.activo !== undefined
        ? !response.data.activo
        : esLocalDeshabilitado(response.data);

    return {
      exitoso: true,
      datos: response.data,
      deshabilitado,
      mensaje: deshabilitado
        ? "Local deshabilitado. Ya no aparece en el mapa."
        : "Local habilitado. Ya es visible en el mapa.",
      esMock: false,
    };
  } catch (error) {
    console.error("Error en cambiarVisibilidadLocal:", error);

    let mensaje = "No se pudo cambiar la visibilidad del local";

    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;

      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para gestionar este local.";
      } else if (error.response.status === 404) {
        mensaje = "El local no existe.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    return {
      exitoso: false,
      datos: null,
      deshabilitado: null,
      mensaje: mensaje,
      esMock: false,
    };
  }
};
