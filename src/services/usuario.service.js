import {
  postRegistrarUsuario,
  postLogin,
  getPerfilUsuario,
  putEditarPerfil,
  patchCambiarContrasena,
  getSpotsUsuario,
  getResenasUsuario,
  getSpotsGuardados,
} from "@/api/usuarioApi";
import { getSpots } from "@/api/spotApi";
import {
  registrarUsuarioDemo,
  USUARIOS_DEMO,
  hashearContrasena,
} from "@/mocks/usuario.mock";
import { SPOTS } from "@/mocks/spots.mock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";
import { guardarTokens, guardarSesion } from "@/utils/sessionHelper";

/**
 * Compara el nombre de usuario del creador de un spot contra el
 * nombreUsuario objetivo, sin importar bajo qué campo lo exponga el backend.
 * Cubre las variantes vistas en el contrato y en el repo (case-insensitive).
 */
const esCreadorDelSpot = (spot, nombreUsuario) => {
  if (!spot || !nombreUsuario) return false;
  const objetivo = nombreUsuario.toLowerCase();
  const candidatos = [
    spot.creador?.nombreUsuario,
    spot.creadorUsername,
    spot.nombreUsuarioCreador,
    spot.usernameCreador,
    spot.creadorId,
  ];
  return candidatos.some(
    (c) => typeof c === "string" && c.toLowerCase() === objetivo,
  );
};

/**
 * Formatea una fecha (ISO u otro formato reconocible) a algo legible.
 * Si no se puede parsear, retorna el valor original tal cual.
 */
const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return fecha;
  return parsed.toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

/**
 * Normaliza una reseña del backend (o de spots.resenas en mocks) al shape
 * que espera ReviewCard: title, text, placeId, rating, likes, date.
 */
const normalizarResena = (resena) => ({
  id: resena?.id,
  placeId: resena?.spotId ?? resena?.placeId,
  title: resena?.tituloSpot || resena?.title || resena?.nombreSpot || "",
  text: resena?.texto || resena?.text || resena?.comentario || "",
  rating: resena?.rating ?? 0,
  likes: resena?.likes ?? 0,
  date: formatearFecha(resena?.fechaCreacion || resena?.fecha || resena?.date),
});

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

    if (estadoCuenta === false) {
      return {
        exitoso: false,
        esDemo: false,
        mensaje:
          "Usuario inactivo. Contacta al administrador para activar tu cuenta.",
      };
    }

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

    return { exitoso: true, esDemo: false, datos: usuario, mensaje };
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
    const data = response.data || {};

    const datosNormalizados = {
      ...data,
      nombreUsuario: data.nombreUsuario || nombreUsuario,
      rol: (data.rol || data.tipoUsuario || "MIEMBRO").toUpperCase(),
      totalSpots: data.totalSpots ?? 0,
      totalResenas: data.totalResenas ?? 0,
      totalGuardados: data.totalGuardados ?? 0,
    };

    return {
      exitoso: true,
      datos: datosNormalizados,
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
    const isNetworkError = !error.response;

    // El endpoint dedicado falló (404/500): antes de rendirnos a los mocks,
    // intentamos con el listado general de spots y filtramos por creador.
    // Así nunca dejamos la UI sin datos si /spots sí trae spots del usuario.
    if (es404o500) {
      try {
        const responseGeneral = await getSpots();
        const spotsDelUsuario = (responseGeneral.data || []).filter((spot) =>
          esCreadorDelSpot(spot, nombreUsuario),
        );
        return {
          exitoso: true,
          datos: spotsDelUsuario,
          mensaje: "Spots del usuario obtenidos exitosamente",
          esMock: false,
        };
      } catch {
        // Tampoco funcionó el listado general: caemos a mocks más abajo.
      }

      const mockSpots = SPOTS.filter((spot) =>
        esCreadorDelSpot(spot, nombreUsuario),
      );
      return {
        exitoso: true,
        datos: mockSpots,
        mensaje: "Mostrando datos de demostración",
        esMock: true,
      };
    }

    if (!isNetworkError) {
      let mensaje = "Error al obtener los spots del usuario";
      if (error.response?.data?.mensaje) {
        mensaje = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        mensaje = error.response.data.message;
      }
      return { exitoso: false, datos: [], mensaje, esMock: false };
    }

    const mockSpots = SPOTS.filter((spot) =>
      esCreadorDelSpot(spot, nombreUsuario),
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
      datos: (response.data || []).map(normalizarResena),
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

    const spotsUsuario = SPOTS.filter((spot) =>
      esCreadorDelSpot(spot, nombreUsuario),
    );

    const resenas = spotsUsuario.flatMap((spot) =>
      (spot.resenas || []).map((resena) =>
        normalizarResena({
          id: resena.id,
          spotId: spot.id,
          tituloSpot: spot.nombre,
          rating: resena.rating,
          texto: resena.comentario,
          likes: 0,
          fechaCreacion: resena.fecha,
        }),
      ),
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
        mensaje: "Aún no tienes lugares guardados",
        esMock: false,
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
