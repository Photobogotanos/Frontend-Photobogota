import { clienteApi } from "./axiosConfig";

export const getCalificacionesBySpot = (spotId) =>
  clienteApi.get(`/spots/${spotId}/calificaciones`);

export const getCalificacionById = (id) =>
  clienteApi.get(`/calificaciones/${id}`);

export const postCrearCalificacion = (spotId, body) =>
  clienteApi.post(`/spots/${spotId}/calificaciones`, body);

export const putActualizarCalificacion = (spotId, calificacionId, body) =>
  clienteApi.put(`/spots/${spotId}/calificaciones/${calificacionId}`, body);