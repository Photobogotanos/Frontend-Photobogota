import {
    crearAspiranteApi,
    obtenerAspirantesApi,
    obtenerAspirantePorCodigoApi,
    obtenerEstadisticasAspirantesApi,
    aprobarAspiranteApi,
    enviarCredencialesAspiranteApi,
    rechazarAspiranteApi,
    solicitarCorreccionAspiranteApi,
    reenviarDocumentosAspiranteApi,
    agregarComentarioAspiranteApi,
    subirDocumentoAspiranteApi,
} from "@/api/aspirante";

export const crearAspirante = async (data) => {
    return await crearAspiranteApi(data);
};

export const obtenerAspirantes = async () => {
    return await obtenerAspirantesApi();
};

export const obtenerAspirantePorCodigo = async (codigo) => {
    return await obtenerAspirantePorCodigoApi(codigo);
};

export const obtenerEstadisticasAspirantes = async () => {
    return await obtenerEstadisticasAspirantesApi();
};

export const aprobarAspirante = async (id) => {
    return await aprobarAspiranteApi(id);
};

export const enviarCredencialesAspirante = async (id) => {
    return await enviarCredencialesAspiranteApi(id);
};

export const rechazarAspirante = async (id, motivo) => {
    return await rechazarAspiranteApi(id, motivo);
};

export const solicitarCorreccionAspirante = async (id, motivo) => {
    return await solicitarCorreccionAspiranteApi(id, motivo);
};

export const reenviarDocumentosAspirante = async (codigo, rutaArchivo, tipoArchivo) => {
    return await reenviarDocumentosAspiranteApi(codigo, rutaArchivo, tipoArchivo);
};

export const agregarComentarioAspirante = async (id, texto) => {
    return await agregarComentarioAspiranteApi(id, texto);
};

export const subirDocumentoAspirante = async (file) => {
    return await subirDocumentoAspiranteApi(file);
};
