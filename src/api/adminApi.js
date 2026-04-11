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