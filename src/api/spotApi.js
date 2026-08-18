import { clienteApi } from "./axiosConfig";

export const getSpots = (filtros = {}) => {
  const params = {};
  // Contrato de filtros con backend: categoria, localidad, tipo, mios, creadorId, nombre...
  Object.entries(filtros || {}).forEach(([clave, valor]) => {
    if (valor !== undefined && valor !== null && valor !== "") {
      params[clave] = valor;
    }
  });
  return clienteApi.get("/spots", { params });
};

export const getSpotById = (id, options = {}) =>
  clienteApi.get(`/spots/${id}`, {
    signal: options.signal,
  });

export const postCrearSpot = (body) => clienteApi.post("/spots", body);
