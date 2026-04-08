import { clienteApi } from "./axiosConfig";

export const checkBackendHealth = async () => {
    try {
        const respuesta = await clienteApi.get("/actuator/health", {
            timeout: 1000,
            _silent: true,
        });
        // Verificamos el body por si el actuator responde 200 pero degradado.
        const status = respuesta?.data?.status;
        return status ? status === "UP" : true;
    } catch {
        return false;
    }
};