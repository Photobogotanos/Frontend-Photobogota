import { 
    crearAspiranteApi, 
    obtenerAspirantesApi, 
    obtenerAspirantePorIdApi,
    obtenerAspirantePorEmailApi
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