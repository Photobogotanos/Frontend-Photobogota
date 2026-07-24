import { clienteApi } from "./axiosConfig";

const BASE_URL = "/api/v1/notificaciones";

// Listar mis notificaciones (paginadas)
export const getMisNotificaciones = (
  page = 0,
  size = 20,
  soloNoLeidas = null,
) => {
  const params = { page, size };
  if (soloNoLeidas !== null) params.soloNoLeidas = soloNoLeidas;
  return clienteApi.get(BASE_URL, { params });
};

// Contador de no leídas (para badge)
export const getContadorNoLeidas = () =>
  clienteApi.get(`${BASE_URL}/no-leidas/contador`);

// Marcar como leída
export const marcarLeida = (id) => clienteApi.patch(`${BASE_URL}/${id}/leida`);

// Marcar todas como leídas
export const marcarTodasLeidas = () =>
  clienteApi.patch(`${BASE_URL}/leer-todas`);

// Eliminar notificación
export const eliminarNotificacion = (id) =>
  clienteApi.delete(`${BASE_URL}/${id}`);

// Preferencias
export const getPreferenciasNotificaciones = () =>
  clienteApi.get(`${BASE_URL}/preferencias`);

export const actualizarPreferenciasApi = (dto) =>
  clienteApi.put(`${BASE_URL}/preferencias`, dto);
