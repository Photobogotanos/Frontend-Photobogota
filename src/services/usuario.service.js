import { postRegistrarUsuario } from "@/api/usuarioApi";
import { registrarUsuarioDemo } from "@/mocks/usuarioMock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";

export const registrarUsuario = async (datos) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline) {
    const resultado = registrarUsuarioDemo(datos);
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
      mensaje: error.response?.data?.mensaje || "Error al conectar con el servidor."
    };

  }
};