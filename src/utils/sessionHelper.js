import Cookies from "js-cookie";

const COOKIE_EXPIRY_DAYS = 7;
const COOKIE_OPTIONS = { expires: COOKIE_EXPIRY_DAYS, sameSite: "Strict" };

// Tokens 

export const guardarTokens = (token, refreshToken) => {
  Cookies.set("token", token, COOKIE_OPTIONS);
  Cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);
};

export const obtenerAccessToken = () => Cookies.get("token");
export const obtenerRefreshToken = () => Cookies.get("refreshToken");

const eliminarTokens = () => {
  Cookies.remove("token");
  Cookies.remove("refreshToken");
  localStorage.clear();
  sessionStorage.clear();
};

// Sesión de usuario 

export const guardarSesion = (usuario) => {
  localStorage.setItem("logueado", "true");
  localStorage.setItem("miembro", JSON.stringify(usuario));
};

export const obtenerSesion = () => {
  const miembro = localStorage.getItem("miembro");
  return miembro ? JSON.parse(miembro) : null;
};

export const estaLogueado = () => localStorage.getItem("logueado") === "true";

/**
 * Actualiza parcialmente la sesión del usuario en localStorage
 * @param {Object} datosActualizados - Datos a actualizar del usuario
 */
export const actualizarSesion = (datosActualizados) => {
  const sesionActual = obtenerSesion();
  if (sesionActual) {
    const nuevaSesion = { ...sesionActual, ...datosActualizados };
    localStorage.setItem("miembro", JSON.stringify(nuevaSesion));
  }
};

export const cerrarSesion = () => {
  localStorage.removeItem("logueado");
  localStorage.removeItem("miembro");
  eliminarTokens();
};