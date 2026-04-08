import { getSpots, getSpotById, postCrearSpot, postCrearResena } from "@/api/spotApi";
import { obtenerEstadoServidor } from "@/utils/serverStatus";
import { getSpots as getMockSpots, getSpotById as getMockSpotById } from "@/mocks/spots.helpers";

const adaptarSpot = (dto) => ({
  ...dto,
  coord: [dto.latitud, dto.longitud],
  resenas: dto.resenas ?? [],
});

export const obtenerSpots = async (filtros = {}) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline) {
    let spots = getMockSpots();
    if (filtros.categoria)
      spots = spots.filter(s => s.categoria?.toLowerCase() === filtros.categoria.toLowerCase());
    if (filtros.localidad)
      spots = spots.filter(s => s.localidad?.toLowerCase() === filtros.localidad.toLowerCase());
    return { exitoso: true, esDemo: true, datos: spots };
  }

  try {
    const { data } = await getSpots(filtros);
    return { exitoso: true, esDemo: false, datos: data.map(adaptarSpot) };
  } catch (error) {
    return {
      exitoso: false,
      mensaje: error.response?.data?.mensaje ?? "Error al cargar los spots.",
    };
  }
};

export const obtenerSpotPorId = async (id) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline) {
    const spot = getMockSpotById(id);
    return spot
      ? { exitoso: true, esDemo: true, datos: spot }
      : { exitoso: false, mensaje: "Spot no encontrado." };
  }

  try {
    const { data } = await getSpotById(id);
    return { exitoso: true, esDemo: false, datos: adaptarSpot(data) };
  } catch (error) {
    const status = error.response?.status;
    return {
      exitoso: false,
      mensaje: status === 404 ? "Spot no encontrado." : "Error al cargar el spot.",
    };
  }
};

export const crearSpot = async (formState) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline)
    return { exitoso: false, esDemo: true, mensaje: "Debes estar conectado para publicar un spot." };

  try {
    const formData = new FormData();
    formData.append("nombre", formState.nombreLugar);
    formData.append("latitud", formState.latitud);
    formData.append("longitud", formState.longitud);
    formData.append("direccion", formState.direccion);
    formData.append("categoria", formState.categoria?.value ?? "");
    formData.append("localidad", formState.localidad?.value ?? "");
    formData.append("descripcion", formState.descripcionImagen);
    if (formState.recomendacion) formData.append("recomendacion", formState.recomendacion);
    if (formState.tipsFoto) formData.append("tipsFoto", formState.tipsFoto);
    
    formState.imagenes.forEach((img) => formData.append("imagenes", img));

    const { data } = await postCrearSpot(formData);
    return { exitoso: true, datos: data };
  } catch (error) {
    const status = error.response?.status;
      return {
        exitoso: false,
        mensaje: status === 403
          ? "Solo los miembros activos pueden publicar spots."
          : error.response?.data?.mensaje ?? "Error al publicar el spot.",
      };
  }
};

export const agregarResena = async (spotId, resena) => {
  const isOnline = await obtenerEstadoServidor();

  if (!isOnline)
    return { exitoso: false, esDemo: true, mensaje: "Debes estar conectado para dejar una reseña." };

  try {
    const { data } = await postCrearResena(spotId, resena);
    return { exitoso: true, datos: adaptarSpot(data) };
  } catch (error) {
    return {
      exitoso: false,
      mensaje: error.response?.data?.mensaje ?? "Error al enviar la reseña.",
    };
  }
};