// spots.helpers.js
// Helpers para consumir el mock desde cualquier componente

import { SPOTS } from "./spots.mock";

// Array completo — para listas, mapas, SpotCard, etc.
export const getSpots = () => SPOTS;

// Busca un spot por id — para SpotContent
export const getSpotById = (id) => SPOTS.find((s) => s.id === Number(id));