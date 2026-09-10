import {
  postCrearCanje,
  getMisCanjes,
  getCanjesDePromocion,
  postValidarCanje,
} from "@/api/canjeApi";
import { obtenerAccessToken } from "@/utils/sessionHelper";

// Vigencia por defecto de un canje (días tras el canje). El backend aplica el
// menor entre este plazo y la fechaFin de la promoción correspondiente.
export const DIAS_VIGENCIA_CANJE = 30;

export const ESTADOS_CANJE = [
  { valor: "VIGENTE", etiqueta: "Vigente", variant: "success" },
  { valor: "USADO", etiqueta: "Usado", variant: "secondary" },
  { valor: "EXPIRADO", etiqueta: "Expirado", variant: "danger" },
];

export const obtenerEtiquetaEstadoCanje = (valor) =>
  ESTADOS_CANJE.find((e) => e.valor === valor)?.etiqueta || valor || "—";

const requerirToken = () => obtenerAccessToken();

const mensajeDeError = (error, predeterminado) =>
  error.response?.data?.message ||
  error.response?.data?.mensaje ||
  predeterminado;

export const formatearFechaCanje = (fecha) => {
  if (!fecha) return "—";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const canjeEstaExpirado = (canje) => {
  if (canje?.estado === "USADO" || canje?.estado === "EXPIRADO") return true;
  if (!canje?.fechaExpiracion) return false;
  return new Date(canje.fechaExpiracion).getTime() < Date.now();
};

/**
 * Canjea una promoción para el miembro autenticado.
 * El código lo genera el backend (8 caracteres alfanuméricos).
 */
export const canjearPromocion = async (promocionId) => {
  try {
    if (!requerirToken()) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para canjear una promoción",
      };
    }
    const response = await postCrearCanje({ promocionId });
    return {
      exitoso: true,
      datos: response.data || null,
      mensaje: "Promoción canjeada, presenta tu código en el local",
    };
  } catch (error) {
    return {
      exitoso: false,
      datos: null,
      mensaje: mensajeDeError(error, "No se pudo canjear la promoción"),
    };
  }
};

/**
 * Canjes del miembro autenticado (tab "Mis canjes" del perfil).
 */
export const obtenerMisCanjes = async () => {
  try {
    if (!requerirToken()) {
      return {
        exitoso: false,
        datos: [],
        mensaje: "Debes iniciar sesión para ver tus canjes",
      };
    }
    const response = await getMisCanjes();
    return { exitoso: true, datos: response.data || [], mensaje: "" };
  } catch (error) {
    return {
      exitoso: false,
      datos: [],
      mensaje: mensajeDeError(error, "No se pudieron cargar tus canjes"),
    };
  }
};

/**
 * Canjes de una promoción para el socio dueño.
 */
export const obtenerCanjesDePromocion = async (promocionId) => {
  try {
    if (!requerirToken()) {
      return {
        exitoso: false,
        datos: [],
        mensaje: "Debes iniciar sesión para ver los canjes",
      };
    }
    const response = await getCanjesDePromocion(promocionId);
    return { exitoso: true, datos: response.data || [], mensaje: "" };
  } catch (error) {
    return {
      exitoso: false,
      datos: [],
      mensaje: mensajeDeError(
        error,
        "No se pudieron cargar los canjes de la promoción",
      ),
    };
  }
};

/**
 * El socio valida el código presentado por el cliente y efectiviza el cobro.
 */
export const validarCanje = async ({ codigo, spotId }) => {
  try {
    if (!requerirToken()) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para validar códigos",
      };
    }
    const response = await postValidarCanje({ codigo, spotId });
    return {
      exitoso: true,
      datos: response.data || null,
      mensaje: "Cobro efectivizado",
    };
  } catch (error) {
    return {
      exitoso: false,
      datos: null,
      mensaje: mensajeDeError(error, "El código no se pudo validar"),
    };
  }
};