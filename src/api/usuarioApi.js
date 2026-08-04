import { clienteApi } from "./axiosConfig";

/**
 * Registro de nuevo usuario
 */
export const postRegistrarUsuario = (body) => 
    clienteApi.post("/auth/register", body);

/**
 * Login de usuario
 * @param {{ login: string, contrasena: string }} credentials
 * @returns {Promise<{ data: { token: string, refreshToken: string, nombreUsuario: string, email: string, rol: string, nivel?: number, mensaje: string } }>}
 */
export const postLogin = (credentials) => 
    clienteApi.post("/auth/login", credentials);

/**
 * Logout de usuario
 * Invalida la sesión en el backend
 * @returns {Promise}
 */
export const postLogout = () => 
    clienteApi.post("/auth/logout");

/**
 * Obtener perfil de usuario
 * @param {string} nombreUsuario - Nombre de usuario del perfil a obtener
 * @returns {Promise<{ data: PerfilUsuarioDTO }>}
 */
export const getPerfilUsuario = (nombreUsuario) => 
    clienteApi.get(`/usuarios/perfil/${nombreUsuario}`);

/**
 * Editar perfil de usuario
 * @param {EditarPerfilDTO} body - Datos del perfil a actualizar
 * @returns {Promise<{ data: PerfilUsuarioDTO }>}
 */
export const putEditarPerfil = (body) => 
    clienteApi.put("/usuarios/perfil", body);

/**
 * Cambiar contraseña de usuario
 * @param {CambiarContrasenaDTO} body - Datos de la contraseña actual y nueva
 * @returns {Promise<{ data: CambiarContrasenaResponseDTO }>}
 */
export const patchCambiarContrasena = (body) => 
    clienteApi.patch("/usuarios/me/password", body);

/**
 * Obtener datos del usuario autenticado (Sincroniza persistencia local con Backend)
 * @returns {Promise<{ data: UsuarioResumenDTO }>}
 */
export const getUsuarioAutenticado = () => 
    clienteApi.get("/auth/me");

/**
 * Solicitar código de recuperación de contraseña.
 * El backend genera un código de 6 dígitos y lo envía al correo del usuario.
 * El código expira en 15 minutos.
 * @param {{ email: string }} body
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const postSolicitarRecuperacion = (body) =>
    clienteApi.post("/auth/passwords/recovery-request", body);

/**
 * Obtener spots de un usuario
 * @param {string} nombreUsuario
 * @returns {Promise<{ data: Spot[] }>}
 */
export const getSpotsUsuario = (nombreUsuario) =>
  clienteApi.get(`/usuarios/${nombreUsuario}/spots`);

/**
 * Obtener reseñas de un usuario
 * @param {string} nombreUsuario
 * @returns {Promise<{ data: ResenaUsuarioDTO[] }>}
 */
export const getResenasUsuario = (nombreUsuario) =>
  clienteApi.get(`/usuarios/${nombreUsuario}/resenas`);

/**
 * Obtener spots guardados del usuario autenticado
 * @returns {Promise<{ data: Spot[] }>}
 */
export const getSpotsGuardados = () =>
  clienteApi.get("/usuarios/me/guardados");

/**
 * Guardar un spot en la lista de guardados del usuario autenticado
 * @param {string|number} spotId
 * @returns {Promise<{ data: Spot }>}
 */
export const postGuardarSpot = (spotId) =>
  clienteApi.post(`/usuarios/me/guardados/${spotId}`);

/**
 * Quitar un spot de la lista de guardados del usuario autenticado
 * @param {string|number} spotId
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const deleteGuardarSpot = (spotId) =>
  clienteApi.delete(`/usuarios/me/guardados/${spotId}`);

/**
 * Verificar el código recibido por correo y establecer la nueva contraseña.
 * @param {{ email: string, codigo: string, nuevaContrasena: string }} body
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const postVerificarCodigo = (body) =>
  clienteApi.post("/auth/passwords/reset", body);

/**
 * Solicitar la eliminación de la propia cuenta (solo MIEMBRO).
 * El backend genera un código de 6 dígitos y lo envía al correo del usuario,
 * junto con las consecuencias de la eliminación.
 * @param {{ motivo?: string, comentario?: string }} body - Ambos campos son opcionales
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const postSolicitarEliminacionCuenta = (body) =>
  clienteApi.post("/usuarios/me/eliminacion/solicitar", body);

/**
 * Confirmar la eliminación de la cuenta con el código recibido por correo.
 * Desactiva la cuenta y programa la eliminación definitiva en 30 días.
 * @param {{ codigo: string }} body
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const postConfirmarEliminacionCuenta = (body) =>
  clienteApi.post("/usuarios/me/eliminacion/confirmar", body);

/**
 * Cancelar la eliminación de la cuenta y recuperarla dentro del período de 30 días.
 * @returns {Promise<{ data: { mensaje: string } }>}
 */
export const postCancelarEliminacionCuenta = () =>
  clienteApi.post("/usuarios/me/eliminacion/cancelar");

/**
 * Obtener el estado de la solicitud de eliminación de cuenta del usuario autenticado.
 * @returns {Promise<{ data: EstadoEliminacionDTO }>}
 */
export const getEstadoEliminacionCuenta = () =>
  clienteApi.get("/usuarios/me/eliminacion/estado");