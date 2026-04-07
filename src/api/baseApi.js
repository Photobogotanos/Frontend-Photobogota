import { clienteApi } from "./axiosConfig";

export const checkBackendHealth = async () => {
    try {
        return await clienteApi.get("/actuator/health", {
            timeout: 1000,
            _silent: true 
        });
    } catch (error) {
        return { status: 'down', demoMode: true };
    }
};