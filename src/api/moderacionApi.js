import { clienteApi } from "./axiosConfig";

// ── Filtro de contenido (Admin) ──

export const getPalabrasProhibidas = () =>
  clienteApi.get("/admin/moderacion/palabras");

export const postCrearPalabraProhibida = (body) =>
  clienteApi.post("/admin/moderacion/palabras", body);

export const putActualizarPalabraProhibida = (id, body) =>
  clienteApi.put(`/admin/moderacion/palabras/${id}`, body);

export const deletePalabraProhibida = (id) =>
  clienteApi.delete(`/admin/moderacion/palabras/${id}`);

export const patchTogglePalabraProhibida = (id) =>
  clienteApi.patch(`/admin/moderacion/palabras/${id}/toggle`);

export const getHistorialModeracion = (params) =>
  clienteApi.get("/admin/moderacion/historial", { params });

export const getApelacionesPendientes = () =>
  clienteApi.get("/admin/moderacion/apelaciones");

export const postResolverApelacion = (id, body) =>
  clienteApi.post(`/admin/moderacion/apelaciones/${id}/resolver`, body);

// ── Moderación (usuario autenticado) ──

export const getMiSancion = () =>
  clienteApi.get("/moderacion/mi-sancion");

export const postApelarBan = (body) =>
  clienteApi.post("/moderacion/mi-sancion/apelar", body);
