export const initialState = {
  imagenes: [],
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
  tipo: "SPOT", // se sobrescribe según rol
  telefono: "",
  horario: "",
  sitioWeb: "",
};

export const spotFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_IMAGENES":
      return { ...state, imagenes: action.payload };
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
    case "SET_SHOW_MODAL":
      return { ...state, showModal: action.payload };
    case "SET_CARGANDO":
      return { ...state, cargando: action.payload };
    case "SET_TIPO":
      return { ...state, tipo: action.payload };
    case "SET_TELEFONO":
      return { ...state, telefono: action.payload };
    case "SET_HORARIO":
      return { ...state, horario: action.payload };
    case "SET_SITIO_WEB":
      return { ...state, sitioWeb: action.payload };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};
