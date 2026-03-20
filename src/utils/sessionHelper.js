import Cookies from "js-cookie";

const COOKIE_EXPIRY_DAYS = 7;
const COOKIE_OPTIONS = { expires: COOKIE_EXPIRY_DAYS, sameSite: "Strict" };

// Tokens 

export const guardarTokens = (accessToken, refreshToken) => {
  Cookies.set("accessToken", accessToken, COOKIE_OPTIONS);
  Cookies.set("refreshToken", refreshToken, COOKIE_OPTIONS);
};

export const obtenerAccessToken = () => Cookies.get("accessToken");
export const obtenerRefreshToken = () => Cookies.get("refreshToken");

export const eliminarTokens = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
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

export const cerrarSesion = () => {
  localStorage.removeItem("logueado");
  localStorage.removeItem("miembro");
  eliminarTokens();
};