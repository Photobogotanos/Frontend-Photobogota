import { 
    crearAspiranteApi, 
    obtenerAspirantesApi, 
    obtenerAspirantePorIdApi,
    obtenerAspirantePorEmailApi,
    obtenerAspirantePorCodigoApi,
    obtenerAspirantesPorTipoApi,
    obtenerAspirantesPorEstadoApi,
    aprobarAspiranteApi,
    rechazarAspiranteApi,
    actualizarEstadoAspiranteApi,
} from "@/api/aspirante";

export const crearAspirante = async (data) => {
    return await crearAspiranteApi(data);
};

export const obtenerAspirantes = async () => {
    return await obtenerAspirantesApi();
};

export const obtenerAspirantePorId = async (id) => {
    return await obtenerAspirantePorIdApi(id);
};

export const obtenerAspirantePorEmail = async (email) => {
    return await obtenerAspirantePorEmailApi(email);
};

// ── Nuevos ────────────────────────────────────────────────────────────────────

export const obtenerAspirantePorCodigo = async (codigo) => {
    return await obtenerAspirantePorCodigoApi(codigo);
};

export const obtenerAspirantesPorTipo = async (tipo) => {
    return await obtenerAspirantesPorTipoApi(tipo);
};

export const obtenerAspirantesPorEstado = async (estado) => {
    return await obtenerAspirantesPorEstadoApi(estado);
};

export const aprobarAspirante = async (id) => {
    return await aprobarAspiranteApi(id);
};

export const rechazarAspirante = async (id) => {
    return await rechazarAspiranteApi(id);
};

export const actualizarEstadoAspirante = async (id, estado) => {
    return await actualizarEstadoAspiranteApi(id, estado);
};