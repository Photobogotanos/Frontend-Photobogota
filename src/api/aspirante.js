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


export const obtenerAspirantePorCodigoApi = async (codigo) => {
    const respuesta = await clienteApi.get(`/aspirantes/codigo/${codigo}`);
    return respuesta.data;
};

export const obtenerAspirantesPorTipoApi = async (tipo) => {
    const respuesta = await clienteApi.get(`/aspirantes/tipo/${tipo}`);
    return respuesta.data;
};

export const obtenerAspirantesPorEstadoApi = async (estado) => {
    const respuesta = await clienteApi.get(`/aspirantes/estado/${estado}`);
    return respuesta.data;
};

export const aprobarAspiranteApi = async (id) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/aprobar`);
    return respuesta.data;
};

export const rechazarAspiranteApi = async (id) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/rechazar`);
    return respuesta.data;
};

export const actualizarEstadoAspiranteApi = async (id, estado) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/estado`, null, {
        params: { estado },
    });
    return respuesta.data;
};