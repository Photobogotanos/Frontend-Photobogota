import { clienteApi } from "./axiosConfig";

export const getSpots = (filtros = {}) => {
  const params = {};
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.localidad) params.localidad = filtros.localidad;
  return clienteApi.get("/spots", { params });
};

export const getSpotById = (id) =>
  clienteApi.get(`/spots/${id}`);

export const postCrearSpot = (body) =>
  clienteApi.post("/spots", body);

export const postCrearResena = (spotId, body) =>
  clienteApi.post(`/spots/${spotId}/resenas`, body);