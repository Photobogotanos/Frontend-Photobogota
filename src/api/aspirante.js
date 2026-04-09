import { clienteApi } from "./axiosConfig";

export const crearAspiranteApi = async (data) => {
    const respuesta = await clienteApi.post("/aspirantes", data);
    return respuesta.data;
};

export const obtenerAspirantesApi = async () => {
    
    const respuesta = await clienteApi.get("/aspirantes");
    return respuesta.data;
};

export const obtenerAspirantePorIdApi = async (id) => {
    const respuesta = await clienteApi.get(`/aspirantes/${id}`);
    return respuesta.data;
};

export const obtenerAspirantePorEmailApi = async (email) => {
    const respuesta = await clienteApi.get(`/aspirantes/email/${email}`);
    return respuesta.data;
};