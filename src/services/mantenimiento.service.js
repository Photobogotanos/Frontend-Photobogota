import {
  getEstadoMantenimiento,
  getMantenimientosProgramados,
  postProgramarMantenimiento,
  deleteCancelarMantenimiento,
} from "@/api/mantenimientoApi";

// Extrae un mensaje de error legible. El backend a veces responde con un
// JSON estructurado (GlobalExceptionHandler) y a veces con un string plano
// (el @ExceptionHandler local de IllegalArgumentException en el controller).
const extraerMensajeError = (error, mensajePorDefecto) => {
  const data = error.response?.data;
  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).join(". ");
  }
  return mensajePorDefecto;
};

export const obtenerEstadoMantenimiento = async () => {
  try {
    const res = await getEstadoMantenimiento();
    return { exitoso: true, data: res.data };
  } catch (error) {
    console.error("Error al consultar estado de mantenimiento:", error);
    return { exitoso: false, data: null };
  }
};

export const listarMantenimientosProgramados = async () => {
  try {
    const res = await getMantenimientosProgramados();
    return { exitoso: true, data: res.data || [] };
  } catch (error) {
    console.error("Error al listar mantenimientos programados:", error);
    return {
      exitoso: false,
      data: [],
      mensaje: extraerMensajeError(error, "No se pudieron cargar los mantenimientos programados"),
    };
  }
};

/**
 * @param {Object} datos
 * @param {string} datos.fechaInicio - ISO 8601 (ej: "2026-08-01T22:00:00")
 * @param {string} datos.fechaFin - ISO 8601
 * @param {string} datos.motivo
 * @param {string} [datos.mensajePersonalizado]
 */
export const programarMantenimiento = async (datos) => {
  try {
    const body = {
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      motivo: datos.motivo,
      mensajePersonalizado: datos.mensajePersonalizado?.trim() || null,
    };
    const res = await postProgramarMantenimiento(body);
    return { exitoso: true, data: res.data };
  } catch (error) {
    console.error("Error al programar mantenimiento:", error);
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "No se pudo programar el mantenimiento"),
    };
  }
};

export const cancelarMantenimiento = async (id) => {
  try {
    await deleteCancelarMantenimiento(id);
    return { exitoso: true };
  } catch (error) {
    console.error("Error al cancelar mantenimiento:", error);
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "No se pudo cancelar el mantenimiento"),
    };
  }
};
