import { clienteApi } from "./axiosConfig";

/**
 * Obtener líneas del log del servidor
 * @param {number} lines - Cantidad de líneas a obtener
 * @param {boolean} errorsOnly - Si true, usa el archivo de errores
 * @returns {Promise<{ data: string[] }>}
 */
export const getLogsAdmin = (lines = 100, errorsOnly = false) =>
  clienteApi.get(`/admin/logs?lines=${lines}&errorsOnly=${errorsOnly}`);

/**
 * Obtener lista de archivos de log disponibles
 * @returns {Promise<{ data: { nombre: string, tamaño: number, fecha: number }[] }>}
 */
export const getLogFilesAdmin = () => clienteApi.get("/admin/logs/files");
