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