import { clienteApi } from "./axiosConfig";

export const checkBackendHealth = () =>
    clienteApi.get("/actuator/health", { timeout: 3000 });