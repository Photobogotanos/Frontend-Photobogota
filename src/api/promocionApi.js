import { clienteApi } from "./axiosConfig";

// Promociones de los locales de los socios.

// Todas las promociones del socio autenticado (activas, programadas, expiradas, desactivadas).
export const getPromocionesMias = () => clienteApi.get("/promociones/mias");

// Detalle de una promoción.
export const getPromocionById = (id) => clienteApi.get(`/promociones/${id}`);

// Promoción vigente y activa de un local (para la página del local).
export const getPromocionActivaDeSpot = (spotId) =>
  clienteApi.get(`/promociones/spot/${spotId}/activa`);

// Crea una promoción. body: { spotId, titulo, descripcion, tipo, descuento,
// codigo, imagenes, fechaInicio, fechaFin, usosMaximos }
export const postCrearPromocion = (body) =>
  clienteApi.post("/promociones", body);

// Actualiza una promoción existente.
export const putActualizarPromocion = (id, body) =>
  clienteApi.put(`/promociones/${id}`, body);

// Alterna la visibilidad pública (activar/desactivar).
export const patchTogglePromocion = (id) =>
  clienteApi.patch(`/promociones/${id}/toggle`);

// Duplica una promoción (copia desactivada con 30 días desde hoy).
export const postDuplicarPromocion = (id) =>
  clienteApi.post(`/promociones/${id}/duplicar`);

// Elimina definitivamente una promoción.
export const deletePromocion = (id) => clienteApi.delete(`/promociones/${id}`);