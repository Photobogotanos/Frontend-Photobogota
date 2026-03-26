import { postRegistrarUsuario, postLogin } from "@/api/usuarioApi";
import { registrarUsuarioDemo, USUARIOS_DEMO, hashearContrasena } from "@/mocks/usuario.mock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";
import { guardarTokens, guardarSesion } from "@/utils/sessionHelper";

export const iniciarSesion = async (login, contrasena) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline) {

    const contrasenaHash = await hashearContrasena(contrasena);

    const usuarioEncontrado = USUARIOS_DEMO.find(
      (u) =>
        (u.nombreUsuario === login || u.correo === login) &&
        u.contrasenaHash === contrasenaHash
    );

    if (!usuarioEncontrado) {
      return { exitoso: false, esDemo: false, mensaje: "Credenciales incorrectas." };
    }

    const usuarioFinal = {
      nombre: usuarioEncontrado.nombreUsuario, // nombreUsuario del DTO
      username: "@" + usuarioEncontrado.nombreUsuario,
      email: usuarioEncontrado.correo,
      rol: usuarioEncontrado.rol,
      ...(usuarioEncontrado.rol === "MIEMBRO" && usuarioEncontrado.nivel !== undefined && { nivel: usuarioEncontrado.nivel }),
    };

    guardarSesion(usuarioFinal);
    return { exitoso: true, esDemo: true, datos: usuarioFinal };
  }

  try {
    const respuesta = await postLogin({ login, contrasena });
    const { token, refreshToken, nombreUsuario, email, rol, nivel, mensaje } = respuesta.data;

    // Guardar tokens
    guardarTokens(token, refreshToken);
    
    // Crear objeto de sesión según LoginResponseDTO
    // El nivel solo se usa para miembros
    const usuario = {
      nombre: nombreUsuario,
      username: "@" + nombreUsuario,
      email: email,
      rol: rol,
      ...(rol === "MIEMBRO" && nivel !== undefined && { nivel: nivel }),
    };
    
    guardarSesion(usuario);

    return { exitoso: true, esDemo: false, datos: usuario, mensaje };
  } catch (error) {
    const status = error.response?.status;
    let mensaje = "Error al conectar con el servidor.";

    if (status === 401) mensaje = "El usuario o contraseña no son correctos.";
    else if (status === 404) mensaje = "No existe una cuenta con ese usuario o correo.";
    else if (status === 400)
      mensaje = error.response?.data?.message || "Por favor verifica los datos ingresados.";

    return { exitoso: false, esDemo: false, mensaje };
  }
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
      mensaje: error.response?.data?.mensaje || "Error al conectar con el servidor.",
    };
  }
};