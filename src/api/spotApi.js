import { clienteApi } from "./axiosConfig";

export const getSpots = (filtros = {}) => {
  const params = {};
  if (filtros.categoria) params.categoria = filtros.categoria;
  if (filtros.localidad) params.localidad = filtros.localidad;
  return clienteApi.get("/api/v1/spots", { params });
};

export const getSpotById = (id) =>
  clienteApi.get(`/api/v1/spots/${id}`);

export const postCrearSpot = (body) =>
  clienteApi.post("/api/v1/spots", body);

export const postCrearResena = (spotId, body) =>
  clienteApi.post(`/api/v1/spots/${spotId}/resenas`, body);