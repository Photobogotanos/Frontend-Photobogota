// Helpers de API para los tests E2E. Centralizan la base URL del backend real
// y funciones para obtener datos de soporte (spots, etc.) sin depender del UI.
import { expect } from "@playwright/test";

export const API_BASE = "https://photoapi.duckdns.org/api/v1";

/**
 * Obtiene la lista de spots real desde el backend.
 * @param {import('@playwright/test').APIRequestContext} request
 * @returns {Promise<Array>} lista de spots
 */
export async function obtenerSpots(request) {
  const respuesta = await request.get(`${API_BASE}/spots`);
  expect(respuesta.ok()).toBeTruthy();
  const cuerpo = await respuesta.json();
  const lista = Array.isArray(cuerpo)
    ? cuerpo
    : cuerpo?.data || cuerpo?.content || [];
  return lista || [];
}

/**
 * Devuelve el primer spot de la lista, o undefined si no hay.
 */
export async function obtenerPrimerSpot(request) {
  const spots = await obtenerSpots(request);
  return spots[0];
}
