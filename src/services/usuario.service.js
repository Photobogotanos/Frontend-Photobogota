import {
  postRegistrarUsuario,
  postLogin,
  getPerfilUsuario,
  putEditarPerfil,
  patchCambiarContrasena,
  getSpotsUsuario,
  getResenasUsuario,
  getSpotsGuardados,
  postSolicitarEliminacionCuenta,
  postConfirmarEliminacionCuenta,
  postCancelarEliminacionCuenta,
  getEstadoEliminacionCuenta,
} from "@/api/usuarioApi";
import {
  registrarUsuarioDemo,
  USUARIOS_DEMO,
  hashearContrasena,
} from "@/mocks/usuario.mock";
import { SPOTS } from "@/mocks/spots.mock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";
import { guardarTokens, guardarSesion } from "@/utils/sessionHelper";

const obtenerPerfilDemo = (nombreUsuario = "demo_user") => {
  const usuarioDemo = USUARIOS_DEMO.find(
    (u) => u.nombreUsuario === nombreUsuario,
  );

  if (usuarioDemo) {
    return {
      id: usuarioDemo.id,
      nombresCompletos:
        `${usuarioDemo.nombre} ${usuarioDemo.apellido}`,
      nombreUsuario: usuarioDemo.nombreUsuario,
      email: usuarioDemo.correo,
      biografia:
        "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
      telefono: "3138529778",
      fotoPerfil: "/images/user-pfp/default-avatar.jpg",
      rol: usuarioDemo.rol,
      nivel: usuarioDemo.nivel ?? null,
      totalSpots: SPOTS.filter((s) => s.creadorId === usuarioDemo.nombreUsuario)
        .length,
      totalResenas: SPOTS.filter((s) => s.creadorId === usuarioDemo.nombreUsuario)
        .reduce((acc, s) => acc + (s.resenas?.length || 0), 0),
      totalGuardados: 0,
    };
  }

  return {
    id: 0,
    nombresCompletos: "Juan Sebastian Romero",
    nombreUsuario: nombreUsuario,
    email: "photobogota123@gmail.com",
    biografia:
      "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
    telefono: "3138529778",
    fotoPerfil: "/images/user-pfp/default-avatar.jpg",
    rol: "MIEMBRO",
    nivel: 5,
    totalSpots: 5,
    totalResenas: 6,
    totalGuardados: 12,
  };
};

export const iniciarSesion = async (login, contrasena) => {
  try {
    const respuesta = await postLogin({ login, contrasena });
    const { token, refreshToken, nombreUsuario, email, rol, nivel, mensaje, estadoCuenta } =
      respuesta.data;

    guardarTokens(token, refreshToken);

    const usuario = {
      nombre: nombreUsuario,
      username: "@" + nombreUsuario,
      email,
      rol: (rol || "").toUpperCase(),
      estadoCuenta,
      ...((rol || "").toUpperCase() === "MIEMBRO" && nivel !== undefined && { nivel }),
    };

    guardarSesion(usuario);

    // La cuenta puede estar desactivada (estadoCuenta=false) porque un admin la
    // suspendió, o porque el propio miembro solicitó su eliminación y está dentro
    // del período de 30 días para recuperarla. En ambos casos dejamos que inicie
    // sesión (el backend sí emite un token válido) para que la app pueda mostrarle
    // la pantalla correspondiente en lugar de bloquear el acceso por completo.
    return {
      exitoso: true,
      esDemo: false,
      datos: usuario,
      mensaje,
      cuentaInactiva: estadoCuenta === false,
    };
  } catch (error) {
    const huboRespuestaDelServidor = !!error.response;

    if (!huboRespuestaDelServidor) {
      return await intentarLoginDemo(login, contrasena);
    }

    const status = error.response.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 401) mensaje = "El usuario o contraseña no son correctos.";
    else if (status === 404)
      mensaje = "No existe una cuenta con ese usuario o correo.";
    else if (status === 400)
      mensaje =
        error.response?.data?.message ||
        "Por favor verifica los datos ingresados.";

    return { exitoso: false, esDemo: false, mensaje };
  }
};

const intentarLoginDemo = async (login, contrasena) => {
  const contrasenaHash = await hashearContrasena(contrasena);

  const usuarioEncontrado = USUARIOS_DEMO.find(
    (u) =>
      (u.nombreUsuario === login || u.correo === login) &&
      u.contrasenaHash === contrasenaHash,
  );

  if (!usuarioEncontrado) {
    return {
      exitoso: false,
      esDemo: false,
      mensaje: "Credenciales incorrectas.",
    };
  }

  const usuarioFinal = {
    nombre: usuarioEncontrado.nombreUsuario,
    username: "@" + usuarioEncontrado.nombreUsuario,
    email: usuarioEncontrado.correo,
    rol: usuarioEncontrado.rol.toUpperCase(),
    ...(usuarioEncontrado.rol === "MIEMBRO" &&
      usuarioEncontrado.nivel !== undefined && {
        nivel: usuarioEncontrado.nivel,
      }),
  };

  guardarSesion(usuarioFinal);
  return { exitoso: true, esDemo: true, datos: usuarioFinal };
};

export const registrarUsuario = async (datos) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline) {
    const resultado = await registrarUsuarioDemo(datos);
    return { ...resultado, esDemo: true };
  }

  try {
    const body = {
      nombresCompletos: `${datos.nombres} ${datos.apellidos}`,
      email: datos.email,
      nombreUsuario: datos.nombreUsuario,
      contrasena: datos.contrasena,
      fechaNacimiento: datos.fechaNacimiento,
    };

    const respuesta = await postRegistrarUsuario(body);
    return { exitoso: true, esDemo: false, datos: respuesta.data };
  } catch (error) {
    return {
      exitoso: false,
      esDemo: false,
      mensaje:
        error.response?.data?.mensaje || "Error al conectar con el servidor.",
    };
  }
};

export const obtenerPerfil = async (nombreUsuario) => {
  try {
    const response = await getPerfilUsuario(nombreUsuario);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Perfil obtenido exitosamente",
      esMock: false,
    };
  } catch (error) {
    const isNetworkError = !error.response;

    if (!isNetworkError) {
      let mensaje = "Error al cargar el perfil";
      if (error.response?.status === 404) {
        mensaje = "El usuario no existe";
      } else if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }
      return { exitoso: false, datos: null, mensaje, esMock: false };
    }

    const mockData = obtenerPerfilDemo(nombreUsuario);
    return {
      exitoso: true,
      datos: mockData,
      mensaje: "Mostrando datos de demostración",
      esMock: true,
    };
  }
};

export const editarPerfil = async (body) => {
  try {
    const response = await putEditarPerfil(body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: "Perfil actualizado exitosamente",
      esMock: false,
    };
  } catch (error) {
    let mensaje = "Error al actualizar el perfil";

    if (error.response) {
      mensaje =
        error.response.data?.mensaje ||
        error.response.data?.message ||
        mensaje;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor";
    }

    return {
      exitoso: false,
      datos: null,
      mensaje,
      esMock: false,
    };
  }
};

export const cambiarContrasena = async (body) => {
  try {
    const response = await patchCambiarContrasena(body);
    return {
      exitoso: true,
      datos: response.data,
      mensaje: response.data?.mensaje || "Contraseña actualizada exitosamente",
      esMock: false,
    };
  } catch (error) {
    let mensaje = "Error al cambiar la contraseña";

    if (error.response) {
      mensaje =
        error.response.data?.mensaje ||
        error.response.data?.message ||
        mensaje;
    } else if (error.request) {
      mensaje = "No se pudo conectar con el servidor";
    }

    return {
      exitoso: false,
      datos: null,
      mensaje,
      esMock: false,
    };
  }
};

export const obtenerSpotsUsuario = async (nombreUsuario) => {
  try {
    const response = await getSpotsUsuario(nombreUsuario);
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Spots del usuario obtenidos exitosamente",
      esMock: false,
    };
  } catch (error) {
    const status = error.response?.status;
    const es404o500 = status === 404 || status === 500;

    if (es404o500) {
      return {
        exitoso: true,
        datos: [],
        mensaje: "Mostrando datos de demostración",
        esMock: true,
      };
    }

    const isNetworkError = !error.response;

    if (!isNetworkError) {
      let mensaje = "Error al obtener los spots del usuario";
      if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }
      return { exitoso: false, datos: [], mensaje, esMock: false };
    }

    const mockSpots = SPOTS.filter(
      (spot) => spot.creadorId === nombreUsuario,
    );

    return {
      exitoso: true,
      datos: mockSpots,
      mensaje: "Mostrando datos de demostración",
      esMock: true,
    };
  }
};

export const obtenerResenasUsuario = async (nombreUsuario) => {
  try {
    const response = await getResenasUsuario(nombreUsuario);
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Reseñas del usuario obtenidas exitosamente",
      esMock: false,
    };
  } catch (error) {
    const status = error.response?.status;
    const es404o500 = status === 404 || status === 500;

    if (es404o500) {
      return {
        exitoso: true,
        datos: [],
        mensaje: "Mostrando datos de demostración",
        esMock: true,
      };
    }

    const isNetworkError = !error.response;

    if (!isNetworkError) {
      let mensaje = "Error al obtener las reseñas del usuario";
      if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }
      return { exitoso: false, datos: [], mensaje, esMock: false };
    }

    const spotsUsuario = SPOTS.filter(
      (spot) => spot.creadorId === nombreUsuario,
    );

    const resenas = spotsUsuario.flatMap((spot) =>
      (spot.resenas || []).map((resena) => ({
        id: resena.id,
        spotId: spot.id,
        tituloSpot: spot.nombre,
        rating: resena.rating,
        texto: resena.comentario,
        likes: 0,
        fechaCreacion: resena.fecha,
      })),
    );

    return {
      exitoso: true,
      datos: resenas,
      mensaje: "Mostrando datos de demostración",
      esMock: true,
    };
  }
};

export const obtenerSpotsGuardados = async () => {
  try {
    const response = await getSpotsGuardados();
    return {
      exitoso: true,
      datos: response.data || [],
      mensaje: "Spots guardados obtenidos exitosamente",
      esMock: false,
    };
  } catch (error) {
    const status = error.response?.status;
    const es404o500 = status === 404 || status === 500;

    if (es404o500) {
      return {
        exitoso: true,
        datos: [],
        mensaje: "Mostrando datos de demostración",
        esMock: true,
      };
    }

    const isNetworkError = !error.response;

    if (!isNetworkError) {
      let mensaje = "Error al obtener los spots guardados";
      if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }
      return { exitoso: false, datos: [], mensaje, esMock: false };
    }

    return {
      exitoso: true,
      datos: SPOTS.slice(0, 3),
      mensaje: "Mostrando datos de demostración",
      esMock: true,
    };
  }
};

/**
 * Extrae un mensaje de error legible desde una respuesta de axios,
 * siguiendo el mismo patrón usado en el resto de este servicio.
 */
const extraerMensajeError = (error, mensajePorDefecto) => {
  if (error.response) {
    return (
      error.response.data?.mensaje || error.response.data?.message || mensajePorDefecto
    );
  }
  if (error.request) {
    return "No se pudo conectar con el servidor";
  }
  return mensajePorDefecto;
};

/**
 * Paso 1: solicitar la eliminación de la propia cuenta (solo MIEMBRO).
 * Envía un motivo y comentario opcionales; el backend envía un código
 * de 6 dígitos al correo del usuario.
 * @param {{ motivo?: string, comentario?: string }} body
 */
export const solicitarEliminacionCuenta = async (body) => {
  try {
    const response = await postSolicitarEliminacionCuenta(body);
    return {
      exitoso: true,
      mensaje: response.data?.mensaje || "Código de verificación enviado a tu correo",
    };
  } catch (error) {
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "Error al solicitar la eliminación de la cuenta"),
    };
  }
};

/**
 * Paso 2: confirmar la eliminación con el código recibido por correo.
 * Desactiva la cuenta y programa la eliminación definitiva en 30 días.
 * @param {{ codigo: string }} body
 */
export const confirmarEliminacionCuenta = async (body) => {
  try {
    const response = await postConfirmarEliminacionCuenta(body);
    return {
      exitoso: true,
      mensaje: response.data?.mensaje || "Eliminación confirmada",
    };
  } catch (error) {
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "Código inválido, expirado o ya usado"),
    };
  }
};

/**
 * Cancela la eliminación programada y reactiva la cuenta,
 * siempre que aún se esté dentro del período de 30 días.
 */
export const cancelarEliminacionCuenta = async () => {
  try {
    const response = await postCancelarEliminacionCuenta();
    return {
      exitoso: true,
      mensaje: response.data?.mensaje || "Cuenta recuperada exitosamente",
    };
  } catch (error) {
    return {
      exitoso: false,
      mensaje: extraerMensajeError(error, "No hay una solicitud activa o el plazo ya venció"),
    };
  }
};

/**
 * Obtiene el estado actual de la solicitud de eliminación del usuario autenticado.
 * @returns {Promise<{ exitoso: boolean, datos: EstadoEliminacionDTO|null, mensaje: string }>}
 */
export const obtenerEstadoEliminacionCuenta = async () => {
  try {
    const response = await getEstadoEliminacionCuenta();
    return { exitoso: true, datos: response.data, mensaje: "Estado obtenido exitosamente" };
  } catch (error) {
    return {
      exitoso: false,
      datos: null,
      mensaje: extraerMensajeError(error, "Error al obtener el estado de la solicitud"),
    };
  }
};
