import {
  getMisNotificaciones,
  getContadorNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
  getPreferenciasNotificaciones,
  actualizarPreferenciasApi,
} from "@/api/notificacionApi";

export const obtenerMisNotificaciones = async (
  page = 0,
  size = 20,
  soloNoLeidas = false
) => {
  try {
    const res = await getMisNotificaciones(page, size, soloNoLeidas);
    return { exitoso: true, data: res.data };
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    return { exitoso: false, data: { content: [], totalElements: 0 } };
  }
};

export const obtenerContadorNoLeidas = async () => {
  try {
    const res = await getContadorNoLeidas();
    return res.data.cantidad || 0;
  } catch {
    return 0;
  }
};

export const marcarComoLeida = async (id) => {
  try {
    await marcarLeida(id);
    return true;
  } catch {
    return false;
  }
};

export const marcarTodasComoLeidas = async () => {
  try {
    await marcarTodasLeidas();
    return true;
  } catch {
    return false;
  }
};

export const eliminarNotif = async (id) => {
  try {
    await eliminarNotificacion(id);
    return true;
  } catch {
    return false;
  }
};


/**
 * Obtener preferencias de notificaciones del usuario actual
 */
export const obtenerPreferenciasNotificaciones = async () => {
  try {
    const res = await getPreferenciasNotificaciones();
    return { exitoso: true, data: res.data };
  } catch (error) {
    console.error("Error al obtener preferencias:", error);
    return { exitoso: false, data: null };
  }
};

/**
 * Actualizar preferencias de notificaciones
 */
export const actualizarPreferenciasNotificaciones = async (dto) => {
  try {
    const res = await actualizarPreferenciasApi(dto); // Usamos el alias
    return { exitoso: true, data: res.data };
  } catch (error) {
    console.error("Error al actualizar preferencias:", error);
    return { 
      exitoso: false, 
      mensaje: error.response?.data?.mensaje || "Error al guardar preferencias" 
    };
  }
};