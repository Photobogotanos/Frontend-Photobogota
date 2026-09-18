import { clienteApi } from "./axiosConfig";

// Estadísticas agregadas del socio. periodos: "semana", "mes" o "ano".
export const getEstadisticasSocio = (periodo = "mes") =>
  clienteApi.get("/estadisticas/socio", { params: { periodo } });

// Registra una visita a un local/spot de forma idempotente (el backend
// también registra visitas automáticamente al abrir el detalle GET /spots/:id).
export const postRegistrarVistaSpot = (id) => clienteApi.post(`/spots/${id}/vista`);