import { clienteApi } from "./axiosConfig";

// Crea un reporte. body: { categoria, descripcion, spotId, evidencias }
export const postCrearReporte = (body) => clienteApi.post("/reportes", body);

// Lista los reportes creados por el usuario autenticado
export const getMisReportes = () => clienteApi.get("/reportes/mios");

// Obtiene el detalle de un reporte por id
export const getReportePorId = (id) => clienteApi.get(`/reportes/${id}`);

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
