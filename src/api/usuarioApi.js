import { clienteApi } from "./axiosConfig";

/**
 * Registro de nuevo usuario
 */
export const postRegistrarUsuario = (body) => 
    clienteApi.post("/api/v1/auth/register", body);

/**
 * Login de usuario
 * @param {{ login: string, contrasena: string }} credentials
 * @returns {Promise<{ data: { token: string, refreshToken: string, nombreUsuario: string, email: string, rol: string, nivel?: number, mensaje: string } }>}
 */
export const postLogin = (credentials) => 
    clienteApi.post("/api/v1/auth/login", credentials);

/**
 * Logout de usuario
 * Invalida la sesión en el backend
 * @returns {Promise}
 */
export const postLogout = () => 
    clienteApi.post("/api/v1/auth/logout");

/**
 * Obtener perfil de usuario
 * @param {string} nombreUsuario - Nombre de usuario del perfil a obtener
 * @returns {Promise<{ data: PerfilUsuarioDTO }>}
 */
export const getPerfilUsuario = (nombreUsuario) => 
    clienteApi.get(`/api/v1/usuarios/perfil/${nombreUsuario}`);

/**
 * Editar perfil de usuario
 * @param {EditarPerfilDTO} body - Datos del perfil a actualizar
 * @returns {Promise<{ data: PerfilUsuarioDTO }>}
 */
export const putEditarPerfil = (body) => 
    clienteApi.put("/api/v1/usuarios/perfil", body);

/**
 * Cambiar contraseña de usuario
 * @param {CambiarContrasenaDTO} body - Datos de la contraseña actual y nueva
 * @returns {Promise<{ data: CambiarContrasenaResponseDTO }>}
 */
export const patchCambiarContrasena = (body) => 
    clienteApi.patch("/api/v1/usuarios/me/password", body);

/**
 * Obtener datos del usuario autenticado
 * @returns {Promise<{ data: UsuarioResumenDTO }>}
 */
export const getUsuarioAutenticado = () => 
    clienteApi.get("/api/v1/usuarios/me");