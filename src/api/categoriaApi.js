import { clienteApi } from "./axiosConfig";
import { checkBackendHealth } from "./baseApi";
import { categoriasOptions } from "../mocks/categoria.mock";

const mapCategoriaToOption = (categoria) => ({
  value: categoria.nombre,
  label: categoria.nombre,
});

export const getCategoriasActivas = async () => {
  try {
    const respuesta = await clienteApi.get("/categorias");
    const activas = respuesta.data.filter((c) => c.activa !== false);
    if (activas.length > 0) {
      return [categoriasOptions[0], ...activas.map(mapCategoriaToOption)];
    }
    return [];
  } catch (error) {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) {
      return categoriasOptions;
    }
    throw error;
  }
};

export const getTodasCategorias = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No autenticado");
  }
  const respuesta = await clienteApi.get("/moderador/categorias");
  return respuesta.data;
};

export const crearCategoria = async (nombre) => {
  const respuesta = await clienteApi.post("/moderador/categorias", { nombre });
  return respuesta.data;
};

export const actualizarCategoria = async (id, nombre) => {
  const respuesta = await clienteApi.put(`/moderador/categorias/${id}`, { nombre });
  return respuesta.data;
};

export const eliminarCategoria = async (id) => {
  await clienteApi.delete(`/moderador/categorias/${id}`);
};

export const toggleCategoria = async (id) => {
  const respuesta = await clienteApi.patch(`/moderador/categorias/${id}/toggle`);
  return respuesta.data;
};