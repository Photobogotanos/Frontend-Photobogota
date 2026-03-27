import axios from "axios";
import { obtenerAccessToken, obtenerRefreshToken, guardarTokens, cerrarSesion } from "@/utils/sessionHelper";
import { toast } from "react-hot-toast";

//const API_BASE_URL = "http://192.168.1.15:8080";
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const clienteApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

// Interceptor de REQUEST
// Antes de enviar cualquier petición, adjunta el accessToken en el header.
// Así no tenemos que mandarlo manualmente en cada llamada a la API.
clienteApi.interceptors.request.use(
    (config) => {
        const token = obtenerAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de RESPONSE 
// Cuando el servidor responde con 401 (token expirado), intenta renovarlo
// automáticamente con el refreshToken antes de cerrar la sesión del usuario.

let estaRenovando = false; // evita que múltiples requests fallen al mismo tiempo
// y todas intenten renovar el token simultáneamente
let peticionesEnEspera = []; // para almacenar requests que llegan mientras se renueva el token

const procesarCola = (token) => {
    peticionesEnEspera.forEach((callback) => callback(token));
    peticionesEnEspera = [];
};

clienteApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        if (config.url.includes("/auth/login") || response?.status !== 401) {
            return Promise.reject(error);
        }

        if (response?.status === 401 && !config._reintentado) {
            if (estaRenovando) {
                return new Promise((resolve) => {
                    peticionesEnEspera.push((token) => {
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(clienteApi(config));
                    });
                });
            }

            config._reintentado = true;
            estaRenovando = true;

            // Mostramos un toast informativo
            const idToast = toast.loading("Actualizando sesión...");

            try {
                const refreshToken = obtenerRefreshToken();
                // Instancia limpia para no entrar en bucle
                const { data } = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, { refreshToken });

                guardarTokens(data.accessToken, data.refreshToken);

                toast.success("Sesión renovada", { id: idToast });

                estaRenovando = false;
                procesarCola(data.accessToken);

                config.headers.Authorization = `Bearer ${data.accessToken}`;
                return clienteApi(config);

            } catch (err) {
                estaRenovando = false;
                peticionesEnEspera = [];
                toast.error("La sesión ha expirado. Redirigiendo...", { id: idToast });

                cerrarSesion();
                setTimeout(() => { window.location.href = "/login"; }, 1500);
                return Promise.reject(err);
            }
            
        }
        return Promise.reject(error);
    }
);