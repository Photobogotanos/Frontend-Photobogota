import {
  getPromocionesMias,
  getPromocionById,
  getPromocionActivaDeSpot,
  postCrearPromocion,
  putActualizarPromocion,
  patchTogglePromocion,
  postDuplicarPromocion,
  deletePromocion,
} from "@/api/promocionApi";
import { obtenerAccessToken } from "@/utils/sessionHelper";

// Etiquetas y color (variant de react-bootstrap Badge) para el estado derivado
// de una promoción que devuelve el backend.
export const ESTADOS_PROMOCION = [
  { valor: "ACTIVA", etiqueta: "Activa", variant: "success" },
  { valor: "PROXIMA", etiqueta: "Próximamente", variant: "info" },
  { valor: "EXPIRADA", etiqueta: "Expirada", variant: "danger" },
  { valor: "DESACTIVADA", etiqueta: "Desactivada", variant: "secondary" },
];

export const obtenerEtiquetaEstadoPromocion = (valor) =>
  ESTADOS_PROMOCION.find((e) => e.valor === valor)?.etiqueta || valor;

const requerirToken = () => {
  const token = obtenerAccessToken();
  if (!token) return null;
  return token;
};

/**
 * Todas las promociones del socio logueado. Sin fallback a mocks.
 */
export const obtenerPromocionesMias = async () => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: [], mensaje: "Debes iniciar sesión para ver tus promociones" };
    }
    const response = await getPromocionesMias();
    return { exitoso: true, datos: response.data || [], mensaje: "" };
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudieron cargar tus promociones";
    return { exitoso: false, datos: [], mensaje };
  }
};

/**
 * Detalle de una promoción (para la pantalla de edición).
 */
export const obtenerPromocionPorId = async (id) => {
  try {
    const response = await getPromocionById(id);
    return { exitoso: true, datos: response.data || null, mensaje: "" };
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudo cargar la promoción";
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Promoción vigente y activa de un local (página del local / "ir al local").
 * Es público; si no hay promoción activa devuelve exitoso:false sin datos.
 */
export const obtenerPromocionActivaDeSpot = async (spotId) => {
  try {
    const response = await getPromocionActivaDeSpot(spotId);
    return { exitoso: true, datos: response.data || null, mensaje: "" };
  } catch (error) {
    if (error.response?.status === 404) {
      return { exitoso: false, datos: null, mensaje: "" };
    }
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudo cargar la promoción del local";
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Crea una promoción. body: { spotId, titulo, descripcion, tipo, descuento,
 * codigo, imagenes, fechaInicio, fechaFin, usosMaximos }
 */
export const crearPromocion = async (body) => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: null, mensaje: "Debes iniciar sesión para publicar una promoción" };
    }
    const response = await postCrearPromocion(body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Promoción publicada exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al publicar la promoción";
    if (error.response) {
      const payload = error.response.data;
      const errors = payload?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        mensaje = errors.map((e) => e.defaultMessage).join(", ");
      } else {
        mensaje = payload?.message || payload?.mensaje || mensaje;
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Actualiza una promoción existente.
 */
export const actualizarPromocion = async (id, body) => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: null, mensaje: "Debes iniciar sesión para editar la promoción" };
    }
    const response = await putActualizarPromocion(id, body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Promoción actualizada exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al actualizar la promoción";
    if (error.response) {
      const payload = error.response.data;
      const errors = payload?.errors;
      if (Array.isArray(errors) && errors.length > 0) {
        mensaje = errors.map((e) => e.defaultMessage).join(", ");
      } else {
        mensaje = payload?.message || payload?.mensaje || mensaje;
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Activa/desactiva la visibilidad pública de una promoción.
 */
export const desactivarPromocion = async (id) => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: null, mensaje: "Debes iniciar sesión para gestionar tus promociones" };
    }
    const response = await patchTogglePromocion(id);
    const estado = response.data?.estado;
    const activado = estado === "ACTIVA" || estado === "PROXIMA";
    return {
      exitoso: true,
      datos: response.data,
      mensaje: activado ? "Promoción reactivada" : "Promoción desactivada",
    };
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudo cambiar el estado de la promoción";
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Duplica una promoción (copia desactivada con 30 días desde hoy).
 */
export const duplicarPromocion = async (id) => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: null, mensaje: "Debes iniciar sesión para duplicar promociones" };
    }
    const response = await postDuplicarPromocion(id);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Promoción duplicada",
    };
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudo duplicar la promoción";
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Elimina definitivamente una promoción.
 */
export const eliminarPromocion = async (id) => {
  try {
    if (!requerirToken()) {
      return { exitoso: false, datos: null, mensaje: "Debes iniciar sesión para eliminar promociones" };
    }
    await deletePromocion(id);
    return { exitoso: true, datos: null, mensaje: "Promoción eliminada" };
  } catch (error) {
    const mensaje =
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      "No se pudo eliminar la promoción";
    return { exitoso: false, datos: null, mensaje };
  }
};