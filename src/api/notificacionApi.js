import { clienteApi } from "./axiosConfig";

// Listar mis notificaciones (paginadas)
export const getMisNotificaciones = (
  page = 0,
  size = 20,
  soloNoLeidas = null,
) => {
  const params = { page, size };
  if (soloNoLeidas !== null) params.soloNoLeidas = soloNoLeidas;
  return clienteApi.get("/notificaciones", { params });
};

// Contador de no leídas (para badge)
export const getContadorNoLeidas = () =>
  clienteApi.get("/notificaciones/no-leidas/contador");

// Marcar como leída
export const marcarLeida = (id) =>
  clienteApi.patch(`/notificaciones/${id}/leida`);

// Marcar todas como leídas
export const marcarTodasLeidas = () =>
  clienteApi.patch("/notificaciones/leer-todas");

// Eliminar notificación
export const eliminarNotificacion = (id) =>
  clienteApi.delete(`/notificaciones/${id}`);

// Preferencias
export const getPreferenciasNotificaciones = () =>
  clienteApi.get("/notificaciones/preferencias");

export const actualizarPreferenciasApi = (dto) =>
  clienteApi.put("/notificaciones/preferencias", dto);

// Enviar notificación manual / anuncio (solo MOD y ADMIN)
export const postEnviarNotificacion = (dto) =>
  clienteApi.post("/notificaciones/enviar", dto);
