import { esLocalDeshabilitado } from "@/utils/spot.util";

export const initialState = {
  localCargado: false,
  deshabilitado: false,
  imagenes: [],
  imagenesExistentes: [],
  previews: [],
  indiceImagenActual: 0,
  nombreLugar: "",
  direccion: "",
  latitud: null,
  longitud: null,
  descripcionImagen: "",
  recomendacion: "",
  tipsFoto: "",
  categoria: null,
  localidad: null,
  showModal: false,
  cargando: false,
  telefono: "",
  horario: "",
  sitioWeb: "",
};

const normalizarImagenes = (local) => {
  if (Array.isArray(local.imagenes)) return local.imagenes;
  if (Array.isArray(local.fotos)) return local.fotos;
  if (local.imagen) return [local.imagen];
  return [];
};

export const editarLocalReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOCAL":
      return {
        ...state,
        ...localParaFormulario(action.payload),
        imagenes: [],
        previews: [],
        indiceImagenActual: 0,
        showModal: false,
        localCargado: true,
      };
    case "SET_IMAGENES":
      return { ...state, imagenes: action.payload };
    case "SET_IMAGENES_EXISTENTES":
      return { ...state, imagenesExistentes: action.payload };
    case "SET_PREVIEWS":
      return { ...state, previews: action.payload };
    case "SET_INDICE_IMAGEN":
      return { ...state, indiceImagenActual: action.payload };
    case "SET_NOMBRE_LUGAR":
      return { ...state, nombreLugar: action.payload };
    case "SET_DIRECCION":
      return { ...state, direccion: action.payload };
    case "SET_LATITUD":
      return { ...state, latitud: action.payload };
    case "SET_LONGITUD":
      return { ...state, longitud: action.payload };
    case "SET_DESCRIPCION":
      return { ...state, descripcionImagen: action.payload };
    case "SET_RECOMENDACION":
      return { ...state, recomendacion: action.payload };
    case "SET_TIPS_FOTO":
      return { ...state, tipsFoto: action.payload };
    case "SET_CATEGORIA":
      return { ...state, categoria: action.payload };
    case "SET_LOCALIDAD":
      return { ...state, localidad: action.payload };
    case "SET_TELEFONO":
      return { ...state, telefono: action.payload };
    case "SET_HORARIO":
      return { ...state, horario: action.payload };
    case "SET_SITIO_WEB":
      return { ...state, sitioWeb: action.payload };
    case "SET_SHOW_MODAL":
      return { ...state, showModal: action.payload };
    case "SET_CARGANDO":
      return { ...state, cargando: action.payload };
    default:
      return state;
  }
};

export const localParaFormulario = (local) => ({
  deshabilitado: esLocalDeshabilitado(local),
  nombreLugar: local.nombre || "",
  direccion: local.direccion || "",
  latitud: local.latitud ?? null,
  longitud: local.longitud ?? null,
  descripcionImagen: local.descripcion || "",
  recomendacion: local.recomendacion || "",
  tipsFoto: local.tipsFoto || "",
  categoria: local.categoria
    ? { value: local.categoria, label: local.categoria }
    : null,
  localidad: local.localidad
    ? { value: local.localidad, label: local.localidad }
    : null,
  telefono: local.telefono || "",
  horario: local.horario || "",
  sitioWeb: local.sitioWeb || "",
  imagenesExistentes: normalizarImagenes(local),
});