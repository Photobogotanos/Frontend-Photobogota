import { getSpots, getSpotById, postCrearSpot, postCrearResena } from "@/api/spotApi";
import { obtenerAccessToken, obtenerSesion } from "@/utils/sessionHelper";
import { getSpots as getMockSpots, getSpotById as getMockSpotById } from "@/mocks/spots.helpers";

/**
 * Obtener todos los spots con filtros opcionales
 * Con fallback a mocks si el servidor no está disponible
 */
export const obtenerSpots = async (filtros = {}) => {
  try {
    console.log("Obteniendo spots con filtros:", filtros);
    
    const response = await getSpots(filtros);
    
    console.log("Spots obtenidos del backend:", response.data?.length || 0);
    
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Spots obtenidos exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.warn("Error al obtener spots del backend, usando mocks:", error);
    
    // Fallback a datos mock
    let spotsMock = getMockSpots();
    
    // Aplicar filtros a los mocks
    if (filtros.categoria) {
      spotsMock = spotsMock.filter(spot => 
        spot.categoria?.toLowerCase() === filtros.categoria.toLowerCase()
      );
    }
    if (filtros.localidad) {
      spotsMock = spotsMock.filter(spot => 
        spot.localidad?.toLowerCase() === filtros.localidad.toLowerCase()
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
 * Obtener un spot por su ID
 * Con fallback a mocks si el servidor no está disponible
 */
export const obtenerSpotPorId = async (id) => {
  try {
    console.log("Obteniendo spot por ID:", id);
    
    const response = await getSpotById(id);
    
    console.log("Spot obtenido del backend:", response.data?.nombre);
    
    return {
      exitoso: true,
      datos: response.data || null,
      mensaje: "Spot obtenido exitosamente",
      esMock: false,
    };
  } catch (error) {
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
      mensaje = error.response.data?.message || error.response.data?.mensaje || mensaje;
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
        mensaje: "No se encontró token de autenticación. Por favor inicia sesión nuevamente.",
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
      mensaje = error.response.data?.message || error.response.data?.mensaje || mensaje;
      console.error("Error response:", error.response.status, error.response.data);
      
      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para crear spots.";
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

/**
 * Agregar una reseña a un spot
 * (No tiene fallback a mock porque requiere autenticación)
 */
export const agregarResena = async (spotId, resenaData) => {
  try {
    const token = obtenerAccessToken();
    
    if (!token) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para agregar una reseña",
      };
    }

    console.log("Agregando reseña al spot:", spotId, resenaData);

    const response = await postCrearResena(spotId, resenaData);

    console.log("Respuesta del backend:", response.data);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Reseña agregada exitosamente",
      esMock: false,
    };
  } catch (error) {
    console.error("Error al agregar reseña:", error);

    let mensaje = "Error al agregar la reseña";

    if (error.response) {
      mensaje = error.response.data?.message || error.response.data?.mensaje || mensaje;
      
      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 404) {
        mensaje = "El spot no existe";
      }
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