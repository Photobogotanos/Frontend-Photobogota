import axios from "axios";
import { obtenerAccessToken, obtenerRefreshToken, guardarTokens, cerrarSesion } from "@/utils/sessionHelper";

const API_BASE_URL = "http://localhost:8080";

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

clienteApi.interceptors.response.use(
    (response) => response, // si la respuesta es exitosa, la dejamos pasar sin tocar
    async (error) => {
        const requestOriginal = error.config;

        const es401 = error.response?.status === 401;
        const noEsReintentoYa = !requestOriginal._reintentado; // evita bucle infinito

        if (es401 && noEsReintentoYa && !estaRenovando) {
            estaRenovando = true;
            requestOriginal._reintentado = true; // marcamos para no reintentar de nuevo

            try {
                const refreshToken = obtenerRefreshToken();

                // Le pedimos al backend un nuevo par de tokens
                const { data } = await clienteApi.post("/api/v1/auth/refresh", { refreshToken });

                // Guardamos los nuevos tokens en cookies
                guardarTokens(data.accessToken, data.refreshToken);

                // Actualizamos el header de la request original con el nuevo token
                requestOriginal.headers.Authorization = `Bearer ${data.accessToken}`;

                return clienteApi(requestOriginal); // reintentamos la request que había fallado
            } catch {
                // El refreshToken también expiró o fue rechazado = forzar logout
                cerrarSesion();
                window.location.href = "/login";
                return Promise.reject(error);
            } finally {
                estaRenovando = false;
            }
        }

        return Promise.reject(error);
    }
);