import {
  postCrearReporte,
  getMisReportes,
  getReportePorId,
  postSubirEvidenciaReporte,
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

export const listarMisReportes = async () => {
  try {
    const response = await getMisReportes();
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Reportes obtenidos exitosamente",
    };
  } catch (error) {
    const mensaje =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error al obtener tus reportes";
    return { exitoso: false, datos: [], mensaje };
  }
};

export const obtenerReportePorId = async (id) => {
  try {
    const response = await getReportePorId(id);
    return {
      exitoso: true,
      datos: response.data || null,
      mensaje: "Reporte obtenido exitosamente",
    };
  } catch (error) {
    const mensaje =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error al obtener el reporte";
    return { exitoso: false, datos: null, mensaje };
  }
};
