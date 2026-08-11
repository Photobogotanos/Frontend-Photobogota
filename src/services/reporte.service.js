import {
  postCrearReporte,
  postSubirEvidenciaReporte,
  getDashboardReportes,
  patchCambiarEstadoReporte,
  patchEscalarReporte,
  getReportesPendientesValidacion,
  patchValidarReporte,
} from "@/api/reporteApi";
import { obtenerAccessToken } from "@/utils/sessionHelper";

// Etiquetas legibles para las categorías del enum CategoriaReporte del backend.
export const CATEGORIAS_REPORTE = [
  { valor: "CONTENIDO_OFENSIVO", etiqueta: "Contenido ofensivo" },
  { valor: "SPAM", etiqueta: "Spam" },
  { valor: "INFORMACION_INCORRECTA", etiqueta: "Información incorrecta" },
  { valor: "ERROR_TECNICO", etiqueta: "Error técnico" },
  { valor: "PROBLEMA_SPOT", etiqueta: "Problema con el spot" },
];

// Etiquetas y color (variant de react-bootstrap Badge) para el enum EstadoReporte.
export const ESTADOS_REPORTE = [
  { valor: "NUEVO", etiqueta: "Nuevo", variant: "primary" },
  { valor: "EN_REVISION", etiqueta: "En revisión", variant: "warning" },
  { valor: "PENDIENTE_VALIDACION", etiqueta: "Pendiente de validación", variant: "info" },
  { valor: "RESUELTO", etiqueta: "Resuelto", variant: "success" },
  { valor: "RECHAZADO", etiqueta: "Rechazado", variant: "secondary" },
];

// Nota: un SOCIO/ADMIN elige entre ESTADOS_REPORTE sin
// PENDIENTE_VALIDACION (RESUELTO lo convierte el backend en
// PENDIENTE_VALIDACION hasta que un MOD lo apruebe).

// Etiquetas y color para el enum Gravedad (usado para priorizar el dashboard).
export const GRAVEDADES_REPORTE = [
  { valor: "BAJA", etiqueta: "Baja", variant: "secondary" },
  { valor: "MEDIA", etiqueta: "Media", variant: "info" },
  { valor: "ALTA", etiqueta: "Alta", variant: "warning" },
  { valor: "CRITICA", etiqueta: "Crítica", variant: "danger" },
];

export const TIPOS_OBJETIVO_REPORTE = [
  { valor: "SPOT", etiqueta: "Spot" },
  { valor: "RESENA", etiqueta: "Reseña" },
];

export const obtenerEtiquetaCategoria = (valor) =>
  CATEGORIAS_REPORTE.find((c) => c.valor === valor)?.etiqueta || valor;

export const obtenerEstado = (valor) =>
  ESTADOS_REPORTE.find((e) => e.valor === valor) || {
    valor,
    etiqueta: valor,
    variant: "secondary",
  };

export const obtenerGravedad = (valor) =>
  GRAVEDADES_REPORTE.find((g) => g.valor === valor) || {
    valor,
    etiqueta: valor,
    variant: "secondary",
  };

/**
 * Sube una o varias capturas de pantalla de evidencia.
 * Devuelve las URLs ya subidas, listas para enviar en "evidencias".
 */
export const subirEvidenciasReporte = async (archivos) => {
  try {
    const urls = await Promise.all(
      archivos.map(async (file) => {
        const { data } = await postSubirEvidenciaReporte(file);
        return data.url;
      }),
    );

    return {
      exitoso: true,
      urls,
      mensaje: "Evidencia subida exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al subir la evidencia";

    if (error.response?.status === 413) {
      mensaje = "Una o más capturas superan el tamaño máximo permitido (5MB)";
    } else if (error.response?.status === 415) {
      mensaje = "Formato de imagen no soportado. Usa JPG, PNG o WEBP.";
    } else if (error.response?.data?.mensaje || error.response?.data?.message) {
      mensaje = error.response.data?.mensaje || error.response.data?.message;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor";
    }

    return { exitoso: false, urls: [], mensaje };
  }
};

/**
 * Crea un reporte. body: { categoria, descripcion, spotId, evidencias }
 * El backend genera el número de ticket y asigna automáticamente
 * el reporte a MOD o ADMIN según la categoría.
 */
export const crearReporte = async (body) => {
  try {
    const token = obtenerAccessToken();
    if (!token) {
      return {
        exitoso: false,
        datos: null,
        mensaje: "Debes iniciar sesión para enviar un reporte",
      };
    }

    const response = await postCrearReporte(body);

    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Reporte enviado exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al enviar el reporte";

    if (error.response) {
      mensaje =
        error.response.data?.message ||
        error.response.data?.mensaje ||
        mensaje;

      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 400) {
        mensaje =
          error.response.data?.message ||
          "Datos inválidos. Verifica todos los campos.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }

    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Reportar el perfil de otro usuario.
 *
 * Nota: el backend actual solo expone POST /reportes con referencia a un
 * spot (spotId) y/o reseña (resenaId), pero NO a un usuario. Mientras no
 * exista un endpoint dedicado, reutilizamos la misma ruta dejando
 * spotId/resenaId en undefined y anteponiendo el nombre de usuario al
 * comienzo de la descripción para trazabilidad por parte de la moderación.
 *
 * @param {string} nombreUsuario - nombreUsuario del perfil a reportar
 * @param {{ categoria: string, descripcion: string, evidencias?: string[] }} body
 */
export const reportarUsuario = async (nombreUsuario, body) => {
  const { categoria, descripcion, evidencias = [] } = body || {};
  const descripcionConContexto = descripcion
    ? `Reporte de usuario @${nombreUsuario}: ${descripcion}`
    : `Reporte de usuario @${nombreUsuario}`;

  const resultado = await crearReporte({
    categoria,
    descripcion: descripcionConContexto,
    evidencias,
  });

  return resultado;
};

/**
 * Dashboard de reportes (Etapa 2). filtros: { estado, gravedad, categoria,
 * tipoObjetivo, escalado, orden }. Todos opcionales y combinables.
 * El backend decide qué reportes mostrar según el rol del token
 * (MOD ve solo su cola, ADMIN ve todos).
 */
export const obtenerDashboardReportes = async (filtros = {}) => {
  try {
    const response = await getDashboardReportes(filtros);
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Reportes obtenidos exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al obtener los reportes";
    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      if (error.response.status === 401) {
        mensaje = "Tu sesión ha expirado. Por favor inicia sesión nuevamente.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para ver este dashboard.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: [], mensaje };
  }
};

/**
 * Cambia el estado de un reporte. body: { estado, observacion }
 */
export const cambiarEstadoReporte = async (id, body) => {
  try {
    const response = await patchCambiarEstadoReporte(id, body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Estado actualizado exitosamente",
    };
  } catch (error) {
    let mensaje = "Error al cambiar el estado del reporte";
    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      if (error.response.status === 403) {
        mensaje = "Este reporte no está asignado a tu cola.";
      } else if (error.response.status === 404) {
        mensaje = "No se encontró el reporte.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Escala un reporte al siguiente nivel de la cadena SOCIO -> MOD -> ADMIN.
 * body: { motivo }. Un SOCIO solo puede escalar lo suyo (pasa a MOD), un
 * MOD solo lo suyo (pasa a ADMIN).
 */
export const escalarReporte = async (id, body, siguienteNivelEtiqueta = "el siguiente nivel") => {
  try {
    const response = await patchEscalarReporte(id, body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: `Reporte escalado a ${siguienteNivelEtiqueta}`,
    };
  } catch (error) {
    let mensaje = "Error al escalar el reporte";
    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      if (error.response.status === 400) {
        mensaje = "Este reporte ya está en el nivel más alto de escalamiento.";
      } else if (error.response.status === 403) {
        mensaje = "No tienes permiso para escalar este reporte.";
      } else if (error.response.status === 404) {
        mensaje = "No se encontró el reporte.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: null, mensaje };
  }
};

/**
 * Reportes marcados como Solucionado por SOCIO/ADMIN que esperan
 * aprobación de un MOD (solo visible para MOD).
 */
export const obtenerReportesPendientesValidacion = async () => {
  try {
    const response = await getReportesPendientesValidacion();
    return { exitoso: true, datos: response.data || [], mensaje: "" };
  } catch (error) {
    let mensaje = "Error al obtener los reportes pendientes de validación";
    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: [], mensaje };
  }
};

/**
 * Un MOD aprueba o rechaza la solución propuesta por un SOCIO/ADMIN.
 * body: { aprobado, observacion }
 */
export const validarReporte = async (id, body) => {
  try {
    const response = await patchValidarReporte(id, body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: body.aprobado
        ? "Solución aprobada, se notificó al miembro afectado"
        : "Solución rechazada, vuelve a la cola de quien la propuso",
    };
  } catch (error) {
    let mensaje = "Error al validar el reporte";
    if (error.response) {
      mensaje =
        error.response.data?.message || error.response.data?.mensaje || mensaje;
      if (error.response.status === 400) {
        mensaje = "Este reporte no está pendiente de validación.";
      } else if (error.response.status === 404) {
        mensaje = "No se encontró el reporte.";
      }
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor. Verifica tu conexión.";
    }
    return { exitoso: false, datos: null, mensaje };
  }
};
