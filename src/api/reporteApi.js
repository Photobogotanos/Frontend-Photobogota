import { clienteApi } from "./axiosConfig";

// Crea un reporte. body: { categoria, descripcion, spotId, evidencias }
export const postCrearReporte = (body) => clienteApi.post("/reportes", body);

// Sube una captura de pantalla como evidencia de un reporte.
// Devuelve { url } para incluir luego en "evidencias" al crear el reporte.
export const postSubirEvidenciaReporte = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return clienteApi.post("/imagenes/reporte", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
};

// Dashboard de reportes (Etapa 2). Todos los filtros son opcionales.
// MOD ve solo su cola, ADMIN ve todo (lo decide el backend según el token).
export const getDashboardReportes = (filtros = {}) => {
  const params = {};
  if (filtros.estado) params.estado = filtros.estado;
  if (filtros.gravedad) params.gravedad = filtros.gravedad;
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.tipoObjetivo) params.tipoObjetivo = filtros.tipoObjetivo;
  if (filtros.escalado !== undefined && filtros.escalado !== "")
    params.escalado = filtros.escalado;
  if (filtros.orden) params.orden = filtros.orden;
  return clienteApi.get("/reportes/dashboard", { params });
};

// Cambia el estado de un reporte. body: { estado, observacion }
export const patchCambiarEstadoReporte = (id, body) =>
  clienteApi.patch(`/reportes/${id}/estado`, body);

// Escala un reporte al siguiente nivel (SOCIO -> MOD o MOD -> ADMIN). body: { motivo }
export const patchEscalarReporte = (id, body) =>
  clienteApi.patch(`/reportes/${id}/escalar`, body);

// Cola de reportes asignados a los locales del socio autenticado.
export const getReportesAsignadosSocio = () =>
  clienteApi.get("/reportes/asignados/socio");

// Reportes marcados como Solucionado por SOCIO/ADMIN que esperan
// aprobación de un moderador.
export const getReportesPendientesValidacion = () =>
  clienteApi.get("/reportes/pendientes-validacion");

// Un MOD aprueba o rechaza una solución. body: { aprobado, observacion }
export const patchValidarReporte = (id, body) =>
  clienteApi.patch(`/reportes/${id}/validar`, body);
