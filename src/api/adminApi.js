import { clienteApi } from "./axiosConfig";

/**
 * ADMIN API - Gestión de usuarios
 * Todos estos endpoints requieren token de ADMIN
 */

/**
 * Crear un nuevo usuario (admin)
 * @param {Object} body - Datos del usuario a crear
 * @returns {Promise}
 */
export const postCrearUsuarioAdmin = (body) => 
    clienteApi.post("/admin/usuarios", body);

/**
 * Listar todos los usuarios con paginación
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @returns {Promise}
 */
export const getListarUsuariosAdmin = (page = 0, size = 10) => 
    clienteApi.get(`/admin/usuarios?page=${page}&size=${size}`);

/**
 * Actualizar estado de un usuario (activar/desactivar)
 * @param {string} usuarioId - ID del usuario
 * @param {boolean} activo - true=activo, false=inactivo
 * @returns {Promise}
 */
export const patchEstadoUsuarioAdmin = (usuarioId, activo) => 
    clienteApi.patch(`/admin/usuarios/${usuarioId}/estado?activo=${activo}`);

/**
 * Eliminar un usuario permanentemente
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise}
 */
export const deleteUsuarioAdmin = (usuarioId) => 
    clienteApi.delete(`/admin/usuarios/${usuarioId}`);

/**
 * ADMIN API - Solicitudes de eliminación de cuenta (Etapa 2)
 * Todos estos endpoints requieren token de ADMIN
 */

/**
 * Lista paginada de solicitudes de eliminación de cuenta.
 * @param {{ estado?: string, page?: number, size?: number }} params
 * @returns {Promise}
 */
export const getSolicitudesEliminacionAdmin = ({ estado, page = 0, size = 10 } = {}) => {
    const params = { page, size };
    if (estado) params.estado = estado;
    return clienteApi.get("/admin/eliminaciones", { params });
};

/**
 * Fuerza el procesamiento inmediato de una solicitud: resuelve dependencias,
 * anonimiza los datos y notifica a las partes afectadas.
 * @param {string} id
 * @param {{ observacion?: string }} body
 * @returns {Promise}
 */
export const postProcesarEliminacionAdmin = (id, body = {}) =>
    clienteApi.post(`/admin/eliminaciones/${id}/procesar`, body);
/**
 * Rechaza una solicitud activa y reactiva la cuenta del usuario.
 * @param {string} id
 * @param {{ observacion?: string }} body
 * @returns {Promise}
 */
export const postRechazarEliminacionAdmin = (id, body = {}) =>
    clienteApi.post(`/admin/eliminaciones/${id}/rechazar`, body);

/**
 * Métricas agregadas sobre las solicitudes de eliminación de cuenta.
 * @returns {Promise}
 */
export const getMetricasEliminacionAdmin = () =>
    clienteApi.get("/admin/eliminaciones/metricas");