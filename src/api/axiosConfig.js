import axios from "axios";
import { obtenerAccessToken, obtenerRefreshToken, guardarTokens, cerrarSesion } from "@/utils/sessionHelper";
import { toast } from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

// Instancia principal de Axios con la URL base, timeout y headers por defecto.
// Todos los archivos de la app deben importar esta instancia en lugar de usar axios directamente.
export const clienteApi = axios.create({
    baseURL: API_BASE_URL,
    timeout: 5000,
    headers: { "Content-Type": "application/json" },
});

// Interceptor de REQUEST
// Se ejecuta antes de cada petición. Lee el accessToken guardado y lo adjunta
// en el header Authorization para que no tengamos que enviarlo manualmente.
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
// Se ejecuta cuando el servidor responde. Si llega un 401 (token expirado),
// intenta renovarlo con el refreshToken de forma transparente al usuario.

// Evita que múltiples peticiones fallen al mismo tiempo e intenten
// renovar el token de forma simultánea.
let estaRenovando = false;

// Almacena las peticiones que llegaron mientras se renovaba el token,
// para reintentarlas automáticamente una vez el nuevo token esté listo.
let peticionesEnEspera = [];

// Ejecuta todas las peticiones encoladas pasándoles el nuevo token.
const procesarCola = (token) => {
    peticionesEnEspera.forEach((callback) => callback(token));
    peticionesEnEspera = [];
};

clienteApi.interceptors.response.use(
    // Si la respuesta es exitosa, la deja pasar sin modificaciones.
    (response) => response,

    async (error) => {
        const { config, response } = error;

        const esHealthCheck = config.url.includes('/actuator/health');
        if (config._silent || esHealthCheck) {
            return Promise.reject(error);
        }

        // No intenta renovar el token si el error ocurrió en el login
        // o si el código de error no es 401.
        const esLoginEndpoint = config?.url?.includes("/auth/login");
        if (esLoginEndpoint || response.status !== 401) {
            return Promise.reject(error);
        }

        if (response.status === 401 && !config._reintentado) {

            // Si ya hay una renovación en curso, encola esta petición
            // y la reintenta automáticamente cuando el nuevo token esté listo.
            if (estaRenovando) {
                return new Promise((resolve) => {
                    peticionesEnEspera.push((token) => {
                        config.headers.Authorization = `Bearer ${token}`;
                        resolve(clienteApi(config));
                    });
                });
            }

            // Marca la petición para no reintentarla más de una vez
            // e inicia el proceso de renovación del token.
            config._reintentado = true;
            estaRenovando = true;

            const idToast = toast.loading("Actualizando sesión...");

            try {
                const refreshToken = obtenerRefreshToken();

                // Si ni siquiera hay Refresh Token, no intentamos nada
                if (!refreshToken) throw new Error("No hay refresh token");

                // Usa una instancia limpia de axios para no pasar por los interceptores
                // y evitar un bucle infinito.
                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                // Guarda los nuevos tokens y notifica al usuario.
                guardarTokens(data.accessToken, data.refreshToken);
                toast.success("Sesión renovada", { id: idToast });

                // Libera el bloqueo, despacha las peticiones encoladas
                // y reintenta la petición original.
                estaRenovando = false;
                procesarCola(data.accessToken);

                config.headers.Authorization = `Bearer ${data.accessToken}`;
                return clienteApi(config);

            } catch (err) {
                estaRenovando = false;
                peticionesEnEspera = [];

                // IMPORTANTE: Limpiar el estado y redirigir
                cerrarSesion();

                // Solo redirigir si no estamos ya en la página de login
                if (!window.location.pathname.includes("/login")) {
                    toast.error("Tu sesión ha expirado.");
                    window.location.href = "/login";
                }
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);