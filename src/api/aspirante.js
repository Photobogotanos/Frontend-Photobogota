import { clienteApi } from "./axiosConfig";

export const crearAspiranteApi = async (data) => {
    const respuesta = await clienteApi.post("/aspirantes", data);
    return respuesta.data;
};

export const obtenerAspirantesApi = async () => {
    const respuesta = await clienteApi.get("/aspirantes");
    return respuesta.data;
};

export const obtenerAspirantePorCodigoApi = async (codigo) => {
    const respuesta = await clienteApi.get(`/aspirantes/codigo/${codigo}`);
    return respuesta.data;
};

export const obtenerEstadisticasAspirantesApi = async () => {
    const respuesta = await clienteApi.get("/aspirantes/estadisticas");
    return respuesta.data;
};

export const aprobarAspiranteApi = async (id) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/aprobar`);
    return respuesta.data;
};

export const enviarCredencialesAspiranteApi = async (id) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/enviar-credenciales`);
    return respuesta.data;
};

export const rechazarAspiranteApi = async (id, motivo) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/rechazar`, { motivo });
    return respuesta.data;
};

export const solicitarCorreccionAspiranteApi = async (id, motivo) => {
    const respuesta = await clienteApi.put(`/aspirantes/${id}/solicitar-correccion`, { motivo });
    return respuesta.data;
};

export const reenviarDocumentosAspiranteApi = async (codigo, rutaArchivo, tipoArchivo) => {
    const respuesta = await clienteApi.put(`/aspirantes/codigo/${codigo}/reenviar`, {
        rutaArchivo,
        tipoArchivo,
    });
    return respuesta.data;
};

export const agregarComentarioAspiranteApi = async (id, texto) => {
    const respuesta = await clienteApi.post(`/aspirantes/${id}/comentarios`, { texto });
    return respuesta.data;
};

export const subirDocumentoAspiranteApi = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const respuesta = await clienteApi.post("/imagenes/aspirante-documento", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
    });
    return respuesta.data;
};
