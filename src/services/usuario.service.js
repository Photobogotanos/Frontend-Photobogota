import { postRegistrarUsuario, postLogin } from "@/api/usuarioApi";
import {
  registrarUsuarioDemo,
  USUARIOS_DEMO,
  hashearContrasena,
} from "@/mocks/usuario.mock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";
import { guardarTokens, guardarSesion } from "@/utils/sessionHelper";

export const iniciarSesion = async (login, contrasena) => {
  try {
    const respuesta = await postLogin({ login, contrasena });
    const { token, refreshToken, nombreUsuario, email, rol, nivel, mensaje, estadoCuenta } =
      respuesta.data;

    if (estadoCuenta === false) {
      return { 
        exitoso: false, 
        esDemo: false, 
        mensaje: "Usuario inactivo. Contacta al administrador para activar tu cuenta." 
      };
    }

    guardarTokens(token, refreshToken);

    const usuario = {
      nombre: nombreUsuario,
      username: "@" + nombreUsuario,
      email,
      rol,
      estadoCuenta,
      ...(rol === "MIEMBRO" && nivel !== undefined && { nivel }),
    };

    guardarSesion(usuario);

    return { exitoso: true, esDemo: false, datos: usuario, mensaje };
  } catch (error) {
    const huboRespuestaDelServidor = !!error.response;

    // Solo vamos a modo demo si el servidor realmente no respondió
    // (caído, error de red, timeout, CORS, etc.)
    if (!huboRespuestaDelServidor) {
      return await intentarLoginDemo(login, contrasena);
    }

    // Hubo respuesta del backend: es un error real, no un problema de disponibilidad.
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

/**
 * Lógica de login contra los usuarios demo (mock local).
 * Extraída a su propia función para mantener iniciarSesion() legible.
 */
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
    rol: usuarioEncontrado.rol,
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
