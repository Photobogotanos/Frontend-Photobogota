import {
  postCrearUsuarioAdmin,
  getListarUsuariosAdmin,
  patchEstadoUsuarioAdmin,
  deleteUsuarioAdmin,
  getSolicitudesEliminacionAdmin,
  getDetalleEliminacionAdmin,
  postProcesarEliminacionAdmin,
  postRechazarEliminacionAdmin,
  getMetricasEliminacionAdmin,
} from "@/api/adminApi";
import {
  actualizarEstadoUsuarioDemo,
  eliminarUsuarioDemo,
  listarUsuariosDemo,
} from "@/mocks/admin.mock";

/**
 * Crear usuario (admin)
 * @param {Object} datos - Datos del usuario
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, datos?: any, mensaje?: string}>}
 */
export const crearUsuarioAdmin = async (datos) => {

  try {
    // Mapear datos al formato esperado por el backend
    const body = {
      nombresCompletos:
        datos.nombresCompletos || `${datos.nombres} ${datos.apellidos}`,
      nombreUsuario: datos.nombreUsuario,
      email: datos.email,
      contrasena: datos.contrasena,
      fechaNacimiento: datos.fechaNacimiento,
      rol: datos.rol?.toUpperCase() || "MIEMBRO",
      telefono: datos.telefono || null,
      biografia: datos.biografia || null,
      fotoPerfil: datos.fotoPerfil || null,
    };

    const respuesta = await postCrearUsuarioAdmin(body);

    return {
      exitoso: true,
      esDemo: false,
      datos: respuesta.data,
      mensaje: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 400) {
      mensaje = error.response?.data?.message || "Datos inválidos";
    } else if (status === 409) {
      mensaje =
        error.response?.data?.message ||
        "El email o nombre de usuario ya existe";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    return {
      exitoso: false,
      esDemo: false,
      mensaje,
    };
  }
};

/**
 * Listar usuarios (admin) con paginación
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, data?: any, mensaje?: string}>}
 */
export const listarUsuariosAdmin = async (page = 0, size = 10) => {
  try {
    const respuesta = await getListarUsuariosAdmin(page, size);
    return {
      exitoso: true,
      esDemo: false,
      data: respuesta.data,
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    const resultado = await listarUsuariosDemo(page, size);
    return { exitoso: true, esDemo: true, data: resultado };
  }
};

/**
 * Actualizar estado de un usuario (activar/desactivar)
 * @param {string} usuarioId - ID del usuario
 * @param {boolean} activo - true=activo, false=inactivo
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, mensaje?: string}>}
 */
export const actualizarEstadoUsuarioAdmin = async (usuarioId, activo) => {

  try {
    await patchEstadoUsuarioAdmin(usuarioId, activo);
    return {
      exitoso: true,
      esDemo: false,
      mensaje: `Usuario ${activo ? "activado" : "desactivado"} correctamente`,
    };
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 404) {
      mensaje = "Usuario no encontrado";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    // Fallback a demo
    const resultado = await actualizarEstadoUsuarioDemo(usuarioId, activo);
    return { ...resultado, esDemo: true, mensaje };
  }
};

/**
 * Eliminar un usuario permanentemente
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, mensaje?: string}>}
 */
export const eliminarUsuarioAdmin = async (usuarioId) => {

  try {
    await deleteUsuarioAdmin(usuarioId);
    return {
      exitoso: true,
      esDemo: false,
      mensaje: "Usuario eliminado correctamente",
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 404) {
      mensaje = "Usuario no encontrado";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    // Fallback a demo
    const resultado = await eliminarUsuarioDemo(usuarioId);
    return { ...resultado, esDemo: true, mensaje };
  }
};

/**
 * ── Etapa 2: Solicitudes de eliminación de cuenta (panel ADMIN) ──
 */

const extraerMensajeErrorAdmin = (error, mensajePorDefecto) => {
  const status = error.response?.status;
  if (status === 403) return "No tienes permisos de administrador para esta acción";
  if (status === 404) return "No se encontró la solicitud";
  return error.response?.data?.mensaje || error.response?.data?.message || mensajePorDefecto;
};

/**
 * Lista paginada de solicitudes de eliminación de cuenta.
 * @param {{ estado?: string, page?: number, size?: number }} params
 */
export const listarSolicitudesEliminacionAdmin = async ({ estado, page = 0, size = 10 } = {}) => {
  try {
    const respuesta = await getSolicitudesEliminacionAdmin({ estado, page, size });
    return { exitoso: true, datos: respuesta.data, mensaje: "Solicitudes obtenidas exitosamente" };
  } catch (error) {
    console.error("Error al listar solicitudes de eliminación:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeErrorAdmin(error, "Error al obtener las solicitudes de eliminación"),
    };
  }
};

/**
 * Detalle completo de una solicitud (verificación de identidad + dependencias).
 * @param {string} id
 */
export const obtenerDetalleEliminacionAdmin = async (id) => {
  try {
    const respuesta = await getDetalleEliminacionAdmin(id);
    return { exitoso: true, datos: respuesta.data, mensaje: "Detalle obtenido exitosamente" };
  } catch (error) {
    console.error("Error al obtener el detalle de la solicitud:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeErrorAdmin(error, "Error al obtener el detalle de la solicitud"),
    };
  }
};

/**
 * Fuerza el procesamiento inmediato (anonimización) de una solicitud.
 * @param {string} id
 * @param {{ observacion?: string }} body
 */
export const procesarEliminacionAdmin = async (id, body = {}) => {
  try {
    const respuesta = await postProcesarEliminacionAdmin(id, body);
    return { exitoso: true, mensaje: respuesta.data || "Cuenta anonimizada exitosamente" };
  } catch (error) {
    console.error("Error al procesar la eliminación:", error);
    return {
      exitoso: false,
      mensaje: extraerMensajeErrorAdmin(error, "No se pudo procesar la solicitud"),
    };
  }
};

/**
 * Rechaza una solicitud activa y reactiva la cuenta del usuario.
 * @param {string} id
 * @param {{ observacion?: string }} body
 */
export const rechazarEliminacionAdmin = async (id, body = {}) => {
  try {
    const respuesta = await postRechazarEliminacionAdmin(id, body);
    return { exitoso: true, mensaje: respuesta.data || "Solicitud rechazada exitosamente" };
  } catch (error) {
    console.error("Error al rechazar la solicitud:", error);
    return {
      exitoso: false,
      mensaje: extraerMensajeErrorAdmin(error, "No se pudo rechazar la solicitud"),
    };
  }
};

/**
 * Métricas agregadas de las solicitudes de eliminación de cuenta.
 */
export const obtenerMetricasEliminacionAdmin = async () => {
  try {
    const respuesta = await getMetricasEliminacionAdmin();
    return { exitoso: true, datos: respuesta.data, mensaje: "Métricas obtenidas exitosamente" };
  } catch (error) {
    console.error("Error al obtener métricas de eliminación:", error);
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeErrorAdmin(error, "Error al obtener las métricas"),
    };
  }
};

// ── Etiquetas legibles para el panel de administración ──

export const MOTIVOS_ELIMINACION_LABEL = {
  NO_USO_LA_APLICACION: "Ya no usa la aplicación",
  ENCONTRE_OTRA_ALTERNATIVA: "Encontró otra alternativa",
  PREOCUPACIONES_DE_PRIVACIDAD: "Preocupaciones de privacidad",
  MALA_EXPERIENCIA_DE_USO: "Mala experiencia de uso",
  DEMASIADAS_NOTIFICACIONES: "Demasiadas notificaciones",
  OTRO: "Otro motivo",
  SIN_ESPECIFICAR: "Sin especificar",
};

export const ESTADOS_ELIMINACION = [
  { valor: "PENDIENTE_VERIFICACION", etiqueta: "Pendiente de verificación", variant: "warning" },
  { valor: "PROGRAMADA", etiqueta: "Programada (30 días)", variant: "primary" },
  { valor: "CANCELADA", etiqueta: "Cancelada", variant: "secondary" },
  { valor: "COMPLETADA", etiqueta: "Completada", variant: "success" },
];

export const obtenerEstadoEliminacionInfo = (valor) =>
  ESTADOS_ELIMINACION.find((e) => e.valor === valor) || {
    valor,
    etiqueta: valor,
    variant: "secondary",
  };
