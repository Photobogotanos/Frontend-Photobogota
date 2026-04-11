import {
  postCrearUsuarioAdmin,
  getListarUsuariosAdmin,
  patchEstadoUsuarioAdmin,
  deleteUsuarioAdmin,
} from "@/api/adminApi";
import {
  actualizarEstadoUsuarioDemo,
  eliminarUsuarioDemo,
  listarUsuariosDemo,
} from "@/mocks/admin.mock";

/**
 * Crear usuario (admin)
 * @param {Object} datos - Datos del usuario
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, datos?: any, mensaje?: string}>}
 */
export const crearUsuarioAdmin = async (datos) => {

  try {
    // Mapear datos al formato esperado por el backend
    const body = {
      nombresCompletos:
        datos.nombresCompletos || `${datos.nombres} ${datos.apellidos}`,
      nombreUsuario: datos.nombreUsuario,
      email: datos.email,
      contrasena: datos.contrasena,
      fechaNacimiento: datos.fechaNacimiento,
      rol: datos.rol?.toUpperCase() || "MIEMBRO",
      telefono: datos.telefono || null,
      biografia: datos.biografia || null,
      fotoPerfil: datos.fotoPerfil || null,
    };

    const respuesta = await postCrearUsuarioAdmin(body);

    return {
      exitoso: true,
      esDemo: false,
      datos: respuesta.data,
      mensaje: "Usuario creado exitosamente",
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 400) {
      mensaje = error.response?.data?.message || "Datos inválidos";
    } else if (status === 409) {
      mensaje =
        error.response?.data?.message ||
        "El email o nombre de usuario ya existe";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    return {
      exitoso: false,
      esDemo: false,
      mensaje,
    };
  }
};

/**
 * Listar usuarios (admin) con paginación
 * @param {number} page - Número de página (0-indexed)
 * @param {number} size - Tamaño de página
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, data?: any, mensaje?: string}>}
 */
export const listarUsuariosAdmin = async (page = 0, size = 10) => {
  try {
    const respuesta = await getListarUsuariosAdmin(page, size);
    return {
      exitoso: true,
      esDemo: false,
      data: respuesta.data,
    };
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    const resultado = await listarUsuariosDemo(page, size);
    return { exitoso: true, esDemo: true, data: resultado };
  }
};

/**
 * Actualizar estado de un usuario (activar/desactivar)
 * @param {string} usuarioId - ID del usuario
 * @param {boolean} activo - true=activo, false=inactivo
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, mensaje?: string}>}
 */
export const actualizarEstadoUsuarioAdmin = async (usuarioId, activo) => {

  try {
    await patchEstadoUsuarioAdmin(usuarioId, activo);
    return {
      exitoso: true,
      esDemo: false,
      mensaje: `Usuario ${activo ? "activado" : "desactivado"} correctamente`,
    };
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 404) {
      mensaje = "Usuario no encontrado";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    // Fallback a demo
    const resultado = await actualizarEstadoUsuarioDemo(usuarioId, activo);
    return { ...resultado, esDemo: true, mensaje };
  }
};

/**
 * Eliminar un usuario permanentemente
 * @param {string} usuarioId - ID del usuario
 * @returns {Promise<{exitoso: boolean, esDemo: boolean, mensaje?: string}>}
 */
export const eliminarUsuarioAdmin = async (usuarioId) => {

  try {
    await deleteUsuarioAdmin(usuarioId);
    return {
      exitoso: true,
      esDemo: false,
      mensaje: "Usuario eliminado correctamente",
    };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 404) {
      mensaje = "Usuario no encontrado";
    } else if (status === 403) {
      mensaje = "No tienes permisos para realizar esta acción";
    }

    // Fallback a demo
    const resultado = await eliminarUsuarioDemo(usuarioId);
    return { ...resultado, esDemo: true, mensaje };
  }
};
