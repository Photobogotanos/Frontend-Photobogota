import { clienteApi } from "./axiosConfig";
import { checkBackendHealth } from "./baseApi";
import { localidadOptions } from "../mocks/localidades.mock";

const mapLocalidadToOption = (localidad) => ({
  value: localidad.nombre,
  label: localidad.nombre,
});

export const getLocalidadesActivas = async () => {
  try {
    const respuesta = await clienteApi.get("/localidades");
    const activas = respuesta.data.filter((l) => l.activa !== false);
    if (activas.length > 0) {
      return activas.map(mapLocalidadToOption);
    }
    return [];
  } catch (error) {
    const backendAvailable = await checkBackendHealth();
    if (!backendAvailable) {
      return localidadOptions;
    }
    throw error;
  }
};

export const getTodasLocalidades = async () => {
  const respuesta = await clienteApi.get("/moderador/localidades");
  return respuesta.data;
};

export const crearLocalidad = async (data) => {
  const respuesta = await clienteApi.post("/moderador/localidades", data);
  return respuesta.data;
};

export const actualizarLocalidad = async (id, data) => {
  const respuesta = await clienteApi.put(`/moderador/localidades/${id}`, data);
  return respuesta.data;
};

export const eliminarLocalidad = async (id) => {
  await clienteApi.delete(`/moderador/localidades/${id}`);
};

export const toggleLocalidad = async (id) => {
  const respuesta = await clienteApi.patch(`/moderador/localidades/${id}/toggle`);
  return respuesta.data;
};