import { clienteApi } from "./axiosConfig";

// Canjes de promociones (modelo: código personal generado por el backend).
//
// CONTRATO DE API (a implementar en el backend):
//
//   POST /canjes                          (MIEMBRO, auth)
//     body: { promocionId }
//     Crea el canje del miembro autenticado, genera el código alfanumérico
//     (8 caracteres) y fija fechaExpiracion = min(promocion.fechaFin,
//     hoy + 30 días). Valida: promoción ACTIVA y dentro de fechas, cupos
//     disponibles (usos < usosMaximos) y que el miembro no la haya canjeado
//     antes (409). Reserva el cupo (incrementa usos).
//     201 -> { id, codigo, estado, fechaCanje, fechaExpiracion, ... }
//
//   GET /canjes/mios                       (MIEMBRO, auth)
//     Lista de canjes del miembro autenticado.
//     200 -> [ canje, ... ]
//
//   GET /canjes/promocion/:promocionId     (SOCIO dueño, auth)
//     Lista de canjes de una promoción para el socio.
//     200 -> [ canje, ... ]
//
//   POST /canjes/validar                   (SOCIO dueño del spot, auth)
//     body: { codigo, spotId }
//     Efectiviza el cobro: marca el canje como USADO.
//     Valida: código existe, estado VIGENTE, no expirado y promoción ACTIVA.
//     200 -> { id, codigo, estado: "USADO", ... }
//
//   DTO canje:
//     { id, codigo, estado (VIGENTE|USADO|EXPIRADO), fechaCanje,
//       fechaExpiracion, promocionId, promocionTitulo, descuento,
//       spotId, spotNombre, miembroNombre }

export const postCrearCanje = (body) => clienteApi.post("/canjes", body);

export const getMisCanjes = () => clienteApi.get("/canjes/mios");

export const getCanjesDePromocion = (promocionId) =>
  clienteApi.get(`/canjes/promocion/${promocionId}`);

export const postValidarCanje = (body) =>
  clienteApi.post("/canjes/validar", body);