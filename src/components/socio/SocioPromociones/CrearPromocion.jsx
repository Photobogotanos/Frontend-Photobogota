import { useReducer, useMemo, useState, useRef } from "react";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";

import HeaderPromo from "./HeaderPromo";
import PromoInfoBasica from "./PromoInfoBasica";
import PromoLocal from "./PromoLocal";
import PromoDisponibilidad from "./PromoDisponibilidad";
import PromoPreview from "./PromoPreview";
import PromoBotones from "./PromoBotones";

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

// ============================================================
// ImageUploader
// ============================================================
function ImageUploader({
  previews,
  onImageChange,
  onRemove,
  onNavigate,
  indice,
  onSelectIndice,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (files.length) onImageChange(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onImageChange(files);
  };

  const total = previews.length;

  return (
    <div className="uploader-wrapper">
      {total === 0 ? (
        <div
          className={`drop-zone${isDragging ? " dragging" : ""}`}
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current.click();
            }
          }}
        >
          <div className="drop-zone-lottie">
            <Lottie
              animationData={uploadAnimation}
              loop
              style={{ width: 110, height: 110 }}
            />
          </div>
          <p className="drop-zone-title">Arrastra tus fotos aquí</p>
          <p className="drop-zone-sub">o haz clic para seleccionar</p>
          <span className="drop-zone-badge">JPG · PNG · WEBP · múltiples</span>
        </div>
      ) : (
        <div className="uploader-con-imagenes">
          <div
            className="preview-carousel"
            role="button"
            tabIndex={0}
            onClick={() => onNavigate("next")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onNavigate("next");
              }
            }}
            aria-label="Next photo"
          >
            <img
              src={previews[indice]}
              alt={`Preview ${indice + 1}`}
              className="preview-img"
            />
            <span className="preview-counter">
              {indice + 1} / {total}
            </span>
          </div>

          {total > 1 && (
            <div className="preview-controls">
              <button
                type="button"
                className="preview-nav prev"
                onClick={() => onNavigate("prev")}
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                type="button"
                className="preview-nav next"
                onClick={() => onNavigate("next")}
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>
            </div>
          )}

          <button
            type="button"
            className="preview-remove"
            onClick={() => onRemove(indice)}
            aria-label="Eliminar imagen"
          >
            <FaTrash />
          </button>

          <div className="thumbnails-strip">
            {previews.map((src, idx) => (
              <div
                key={src}
                className={`thumbnail-item${idx === indice ? " active" : ""}`}
                onClick={() => onSelectIndice(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelectIndice(idx);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <img src={src} alt={`Thumb ${idx + 1}`} />
                <button
                  type="button"
                  className="thumb-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(idx);
                  }}
                  aria-label={`Eliminar imagen ${idx + 1}`}
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              className="thumbnail-add"
              onClick={() => inputRef.current.click()}
            >
              <span className="thumbnail-add-icon">+</span>
              <span className="thumbnail-add-text">Añadir</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </div>
  );
}

// ============================================================
// Componente principal
// ============================================================
export default function CrearPromocion() {
  const [state, dispatch] = useReducer(promoFormReducer, initialState);

  const estadoCalculado = useMemo(() => {
    if (!state.fechaFin) return "activa";
    return new Date(state.fechaFin) < new Date() ? "expirada" : "activa";
  }, [state.fechaFin]);

  const handleImagen = (files) => {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({ type: "SET_PREVIEWS", payload: [...state.previews, ...newPreviews] });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const handleRemoveImagen = (idx) => {
    const newImagenes = state.imagenes.filter((_, i) => i !== idx);
    const newPreviews = state.previews.filter((_, i) => i !== idx);
    dispatch({ type: "SET_IMAGENES", payload: newImagenes });
    dispatch({ type: "SET_PREVIEWS", payload: newPreviews });
    const nuevoIdx = Math.min(state.indiceImagen, newPreviews.length - 1);
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  const handleNavigate = (dir) => {
    const total = state.previews.length;
    if (total === 0) return;
    const next =
      dir === "next"
        ? (state.indiceImagen + 1) % total
        : (state.indiceImagen - 1 + total) % total;
    dispatch({ type: "SET_INDICE_IMAGEN", payload: next });
  };

  /*
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
    };
    console.log("Payload a enviar:", payload);
    // Aquí va tu llamada a la API
  };
  */

  return (
    <div className="promociones-container">
      <div className="formulario-contenedor">
        <HeaderPromo />

        <PromoInfoBasica state={state} dispatch={dispatch} />
        <PromoLocal state={state} dispatch={dispatch} />
        <PromoDisponibilidad state={state} dispatch={dispatch} />

        <div className="mt-4">
          <label className="promo-label mb-2" htmlFor="imagenPromo">
            <FaCamera className="me-2" />
            Imágenes de la promoción
          </label>
          <ImageUploader
            id="imagenPromo"
            previews={state.previews}
            indice={state.indiceImagen}
            onImageChange={handleImagen}
            onRemove={handleRemoveImagen}
            onNavigate={handleNavigate}
            onSelectIndice={(idx) =>
              dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })
            }
          />
        </div>

        <PromoPreview state={state} estado={estadoCalculado} />

        <div className="d-flex justify-content-end gap-3 mt-4">
          <PromoBotones></PromoBotones>
          {/* <button type="button" className="btn btn-secondary">
            Guardar borrador
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            Publicar Promoción
          </button> */}
        </div>
      </div>
    </div>
  );
}