import { clienteApi } from "./axiosConfig";

export const postRegistrarUsuario = (body) =>
    clienteApi.post("/api/v1/usuarios/registro-usuario", body);