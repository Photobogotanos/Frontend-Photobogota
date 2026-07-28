import { clienteApi } from "./axiosConfig";

export const getEstadoMantenimiento = () =>
  clienteApi.get("/mantenimiento/estado", { _silent: true });

// Listar mantenimientos programados (activos/futuros, sin cancelar) — Admin
export const getMantenimientosProgramados = () =>
  clienteApi.get("/admin/mantenimiento");

// Programar una ventana de mantenimiento — Admin
export const postProgramarMantenimiento = (body) =>
  clienteApi.post("/admin/mantenimiento", body);

// Cancelar un mantenimiento programado — Admin
export const deleteCancelarMantenimiento = (id) =>
  clienteApi.delete(`/admin/mantenimiento/${id}`);
