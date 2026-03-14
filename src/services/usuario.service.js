import axios from "axios";
import { registrarUsuarioDemo } from "./usuario.mock";

// URL base del servidor
const API_BASE_URL = "http://localhost:8080";

const clienteApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache del estado de conexión
let servidorDisponible = null;

/**
 * Funciones de conexión
 */

const verificarConexionServidor = async () => {
  try {
    const respuesta = await clienteApi.get("/actuator/health", { timeout: 3000 });
    return respuesta.data?.status === "UP";
  } catch (error) {
    console.warn("Servidor no disponible, usando datos demo:", error.message);
    return false;
  }
};

export const obtenerEstadoServidor = async () => {
  if (servidorDisponible === null) {
    servidorDisponible = await verificarConexionServidor();
  }
  return servidorDisponible;
};

export const actualizarEstadoServidor = async () => {
  servidorDisponible = await verificarConexionServidor();
  return servidorDisponible;
};

/**
 * Registra un nuevo usuario.
 * Si el servidor está disponible, hace la llamada real.
 * Si no, usa el mock demo en memoria.
 *
 * @param {{ email, nombres, apellidos, fechaNacimiento, contrasena }} datos
 * @returns {{ exitoso: boolean, esDemo: boolean, mensaje?: string }}
 */
export const registrarUsuario = async (datos) => {
  const { email, nombres, apellidos, nombreUsuario, fechaNacimiento, contrasena } = datos;

  const disponible = await obtenerEstadoServidor();

  // --- MODO DEMO ---
  if (!disponible) {
    const resultado = registrarUsuarioDemo(datos);
    return {
      exitoso: resultado.exitoso,
      esDemo: true,
      mensaje: resultado.mensaje,
    };
  }

  // --- MODO SERVIDOR ---
  const body = {
    nombresCompletos: `${nombres} ${apellidos}`,
    email,
    nombreUsuario,
    contrasena,
    fechaNacimiento,
  };

  const respuesta = await clienteApi.post("/api/v1/usuarios/registro-usuario", body);

  return {
    exitoso: true,
    esDemo: false,
    datos: respuesta.data,
  };
};