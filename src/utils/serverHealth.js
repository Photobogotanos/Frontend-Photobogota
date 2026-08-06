import axios from "axios";

// Módulo hoja (leaf): no importa nada de la app para evitar dependencias
// circulares (axiosConfig ⇄ serverStatus). Solo depende de axios.
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export const checkBackendHealth = async () => {
  try {
    const respuesta = await axios.get(`${API_BASE_URL}/actuator/health`, {
      timeout: 3000,
    });
    // Verificamos el body por si el actuator responde 200 pero degradado.
    const status = respuesta?.data?.status;
    return status ? status === "UP" : true;
  } catch {
    return false;
  }
};
