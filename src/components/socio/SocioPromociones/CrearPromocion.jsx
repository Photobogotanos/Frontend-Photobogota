import { useReducer, useMemo } from "react";
import HeaderPromo from "./HeaderPromo";
import PromoInfoBasica from "./PromoInfoBasica";
import PromoLocal from "./PromoLocal";
import PromoDisponibilidad from "./PromoDisponibilidad";
import PromoPreview from "./PromoPreview";
import ImageUploader from "./ImageUploader"; // Ajusta la ruta si lo tienes en otro lado

import "./CrearPromocion.css";

const promoFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_TITULO":
      return { ...state, titulo: action.payload };
    case "SET_DESCRIPCION":
      return { ...state, descripcion: action.payload };
    case "SET_TIPO":
      return { ...state, tipo: action.payload };
    case "SET_LOCAL_ID":
      return { ...state, localId: action.payload };
    case "SET_FECHA_INICIO":
      return { ...state, fechaInicio: action.payload };
    case "SET_FECHA_FIN":
      return { ...state, fechaFin: action.payload };
    case "SET_LIMITE_USOS":
      return { ...state, limiteUsos: action.payload };
    case "SET_IMAGENES":
      return { ...state, imagenes: action.payload };
    case "SET_PREVIEWS":
      return { ...state, previews: action.payload };
    case "SET_INDICE_IMAGEN":
      return { ...state, indiceImagen: action.payload };
    default:
      return state;
  }
};

const initialState = {
  titulo: "",
  descripcion: "",
  tipo: "descuento",
  localId: null,
  fechaInicio: "",
  fechaFin: "",
  limiteUsos: "",
  imagenes: [],
  previews: [],
  indiceImagen: 0,
};

export default function CrearPromocion() {
  const [state, dispatch] = useReducer(promoFormReducer, initialState);

  const estadoCalculado = useMemo(() => {
    if (!state.fechaFin) return "activa";
    return new Date(state.fechaFin) < new Date() ? "expirada" : "activa";
  }, [state.fechaFin]);

  const handleSubmit = () => {
    const payload = {
      titulo: state.titulo,
      descripcion: state.descripcion,
      tipo: state.tipo,
      localId: state.localId,
      fechaInicio: state.fechaInicio,
      fechaFin: state.fechaFin,
      limiteUsos: state.limiteUsos === "" ? null : parseInt(state.limiteUsos),
      estado: estadoCalculado,
      // imagenes se envían por separado o como FormData
    };
    console.log("Payload a enviar:", payload);
    // Aquí va tu llamada a la API
  };

  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        <HeaderPromo />

        <PromoInfoBasica state={state} dispatch={dispatch} />
        <PromoLocal state={state} dispatch={dispatch} />
        <PromoDisponibilidad state={state} dispatch={dispatch} />

        <div className="mt-4">
          <label className="promo-label mb-2">Imágenes de la promoción</label>
          <ImageUploader
            previews={state.previews}
            indice={state.indiceImagen}
            onImageChange={(files) => {
              const newPreviews = files.map((f) => URL.createObjectURL(f));
              dispatch({
                type: "SET_IMAGENES",
                payload: [...state.imagenes, ...files],
              });
              dispatch({
                type: "SET_PREVIEWS",
                payload: [...state.previews, ...newPreviews],
              });
              dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
            }}
            onRemove={(idx) => {
              const newImagenes = state.imagenes.filter((_, i) => i !== idx);
              const newPreviews = state.previews.filter((_, i) => i !== idx);
              dispatch({ type: "SET_IMAGENES", payload: newImagenes });
              dispatch({ type: "SET_PREVIEWS", payload: newPreviews });
              dispatch({
                type: "SET_INDICE_IMAGEN",
                payload: Math.max(
                  0,
                  Math.min(state.indiceImagen, newPreviews.length - 1),
                ),
              });
            }}
            onNavigate={(dir) => {
              const total = state.previews.length;
              if (total === 0) return;
              const next =
                dir === "next"
                  ? (state.indiceImagen + 1) % total
                  : (state.indiceImagen - 1 + total) % total;
              dispatch({ type: "SET_INDICE_IMAGEN", payload: next });
            }}
            onSelectIndice={(idx) =>
              dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })
            }
          />
        </div>

        <PromoPreview state={state} estado={estadoCalculado} />

        <div className="d-flex justify-content-end gap-3 mt-4">
          <button type="button" className="btn btn-secondary">
            Guardar borrador
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Publicar Promoción
          </button>
        </div>
      </div>
    </div>
  );
}
