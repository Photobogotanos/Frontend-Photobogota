import {
  getPalabrasProhibidas,
  postCrearPalabraProhibida,
  putActualizarPalabraProhibida,
  deletePalabraProhibida,
  patchTogglePalabraProhibida,
  getHistorialModeracion,
  getApelacionesPendientes,
  postResolverApelacion,
  getMiSancion,
  postApelarBan,
} from "@/api/moderacionApi";

const extraerMensajeError = (error, porDefecto) => {
  const status = error.response?.status;
  if (status === 403) return "No tienes permisos para realizar esta acción";
  if (status === 404) return "No se encontró el recurso solicitado";
  return error.response?.data?.mensaje || error.response?.data?.message || porDefecto;
};

// ── Palabras / frases prohibidas (ADMIN) ──

export const listarPalabrasProhibidas = async () => {
  try {
    const respuesta = await getPalabrasProhibidas();
    return { exitoso: true, datos: respuesta.data, mensaje: "Palabras obtenidas exitosamente" };
  } catch (error) {
    console.error("Error al listar palabras prohibidas:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "Error al obtener las palabras prohibidas"),
    };
  }
};

export const crearPalabraProhibida = async (body) => {
  try {
    const respuesta = await postCrearPalabraProhibida(body);
    return { exitoso: true, datos: respuesta.data, mensaje: "Palabra agregada exitosamente" };
  } catch (error) {
    console.error("Error al crear palabra prohibida:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "No se pudo agregar la palabra"),
    };
  }
};

export const actualizarPalabraProhibida = async (id, body) => {
  try {
    const respuesta = await putActualizarPalabraProhibida(id, body);
    return { exitoso: true, datos: respuesta.data, mensaje: "Palabra actualizada exitosamente" };
  } catch (error) {
    console.error("Error al actualizar palabra prohibida:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "No se pudo actualizar la palabra"),
    };
  }
};

export const eliminarPalabraProhibida = async (id) => {
  try {
    const respuesta = await deletePalabraProhibida(id);
    return { exitoso: true, mensaje: respuesta.data || "Palabra eliminada exitosamente" };
  } catch (error) {
    console.error("Error al eliminar palabra prohibida:", error);
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "No se pudo eliminar la palabra"),
    };
  }
};

export const togglePalabraProhibida = async (id) => {
  try {
    const respuesta = await patchTogglePalabraProhibida(id);
    return { exitoso: true, datos: respuesta.data, mensaje: "Estado actualizado correctamente" };
  } catch (error) {
    console.error("Error al cambiar el estado de la palabra:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "No se pudo cambiar el estado"),
    };
  }
};

// ── Historial de moderación (ADMIN) ──

export const listarHistorialModeracion = async ({
  accion,
  usuario,
  tipoContenido,
  desde,
  hasta,
  page = 0,
  size = 10,
} = {}) => {
  try {
    const params = { page, size };
    if (accion) params.accion = accion;
    if (usuario) params.usuario = usuario;
    if (tipoContenido) params.tipoContenido = tipoContenido;
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const respuesta = await getHistorialModeracion(params);
    return { exitoso: true, datos: respuesta.data, mensaje: "Historial obtenido exitosamente" };
  } catch (error) {
    console.error("Error al listar el historial de moderación:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "Error al obtener el historial de moderación"),
    };
  }
};

// ── Apelaciones (ADMIN) ──

export const listarApelacionesPendientes = async () => {
  try {
    const respuesta = await getApelacionesPendientes();
    return { exitoso: true, datos: respuesta.data, mensaje: "Apelaciones obtenidas exitosamente" };
  } catch (error) {
    console.error("Error al listar apelaciones:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "Error al obtener las apelaciones"),
    };
  }
};

export const resolverApelacion = async (id, body) => {
  try {
    const respuesta = await postResolverApelacion(id, body);
    return { exitoso: true, datos: respuesta.data, mensaje: "Apelación resuelta exitosamente" };
  } catch (error) {
    console.error("Error al resolver la apelación:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "No se pudo resolver la apelación"),
    };
  }
};

// ── Sanción del usuario actual ──

export const obtenerMiSancion = async () => {
  try {
    const respuesta = await getMiSancion();
    return { exitoso: true, datos: respuesta.data, mensaje: "Sanción obtenida exitosamente" };
  } catch (error) {
    console.error("Error al obtener la sanción:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "Error al obtener la sanción"),
    };
  }
};

export const apelarMiBan = async (body) => {
  try {
    const respuesta = await postApelarBan(body);
    return { exitoso: true, datos: respuesta.data, mensaje: "Apelación enviada correctamente" };
  } catch (error) {
    console.error("Error al enviar la apelación:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "No se pudo enviar la apelación"),
    };
  }
};

// ── Etiquetas legibles para la UI ──

export const TIPOS_CONTENIDO_MODERADO = [
  { valor: "SPOT_NOMBRE", etiqueta: "Nombre de spot", variant: "info" },
  { valor: "SPOT_DESCRIPCION", etiqueta: "Descripción de spot", variant: "info" },
  { valor: "RESENA", etiqueta: "Reseña", variant: "primary" },
  { valor: "BIOGRAFIA", etiqueta: "Biografía de perfil", variant: "secondary" },
];

export const ACCIONES_MODERACION = [
  { valor: "DETECCION", etiqueta: "Detección", variant: "warning" },
  { valor: "NOTIFICACION", etiqueta: "Notificación", variant: "info" },
  { valor: "MUTE", etiqueta: "Mute (5 días)", variant: "warning" },
  { valor: "SUSPENSION", etiqueta: "Suspensión (3 días)", variant: "danger" },
  { valor: "BAN", etiqueta: "Ban indefinido", variant: "danger" },
  { valor: "BAN_REVOCADO", etiqueta: "Ban revocado", variant: "success" },
];

export const TIPOS_SANCION = [
  { valor: "NOTIFICACION", etiqueta: "Notificación", variant: "info" },
  { valor: "MUTE", etiqueta: "Mute (5 días)", variant: "warning" },
  { valor: "SUSPENSION", etiqueta: "Suspensión (3 días)", variant: "danger" },
  { valor: "BAN", etiqueta: "Ban indefinido", variant: "danger" },
];

export const obtenerTipoContenidoInfo = (valor) =>
  TIPOS_CONTENIDO_MODERADO.find((t) => t.valor === valor) || {
    valor,
    etiqueta: valor,
    variant: "secondary",
  };

export const obtenerAccionModeracionInfo = (valor) =>
  ACCIONES_MODERACION.find((a) => a.valor === valor) || {
    valor,
    etiqueta: valor,
    variant: "secondary",
  };
