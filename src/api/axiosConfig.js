import axios from "axios";
import { obtenerAccessToken } from "@/utils/sessionHelper";

const API_BASE_URL = "http://localhost:8080";

export const clienteApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

// Interceptor de request:
// Antes de enviar CUALQUIER petición, revisa si hay un accessToken guardado.
// Si existe, lo adjunta automáticamente en el header Authorization.
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