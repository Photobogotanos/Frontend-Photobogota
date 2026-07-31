import { useReducer, useMemo, useState, useRef } from "react";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";

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
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
          aria-label="Subir imágenes"
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
            onClick={() => onNavigate("next")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate("next")}
            aria-label="Avanzar imagen"
          >
            <img
              src={previews[indice]}
              alt={`Preview ${indice + 1}`}
              className="preview-img"
            />
            <span className="preview-counter">
              {indice + 1} / {total}
            </span>

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="preview-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("prev");
                  }}
                  aria-label="Anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="preview-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("next");
                  }}
                  aria-label="Siguiente"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <button
              type="button"
              className="preview-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(indice);
              }}
              aria-label="Eliminar imagen"
            >
              <FaTrash />
            </button>
          </div>

          <div className="thumbnails-strip">
            {previews.map((src, idx) => (
              <div
                key={src}
                className={`thumbnail-item${idx === indice ? " active" : ""}`}
                onClick={() => onSelectIndice(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelectIndice(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
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

            <div
              className="thumbnail-add"
              onClick={() => inputRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
              aria-label="Agregar más fotos"
            >
              <span className="thumbnail-add-icon">+</span>
              <span className="thumbnail-add-text">Añadir</span>
            </div>
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

  const validarFormulario = () => {
    if (!state.titulo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Título requerido",
        text: "Por favor ingresa el título de la promoción.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.descripcion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Descripción requerida",
        text: "Por favor ingresa una descripción de la promoción.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.tipo) {
      Swal.fire({
        icon: "warning",
        title: "Tipo requerido",
        text: "Por favor selecciona un tipo de promoción.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.localId) {
      Swal.fire({
        icon: "warning",
        title: "Local requerido",
        text: "Por favor selecciona un local asociado.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.fechaInicio) {
      Swal.fire({
        icon: "warning",
        title: "Fecha de inicio requerida",
        text: "Por favor selecciona la fecha de inicio.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Fecha de fin requerida",
        text: "Por favor selecciona la fecha de fin.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (state.imagenes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Imágenes requeridas",
        text: "Por favor sube al menos una imagen de la promoción.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (state.limiteUsos !== "") {
      const limite = parseInt(state.limiteUsos, 10);
      if (isNaN(limite) || limite < 10 || limite > 1000) {
        Swal.fire({
          icon: "warning",
          title: "Límite de usos inválido",
          text: "El límite de usos debe estar entre 10 y 1000.",
          confirmButtonColor: "#806fbe",
        });
        return false;
      }
    }

    return true;
  };

  const handlePublicar = async () => {
    if (!validarFormulario()) return;

    dispatch
    dispatch({ type: "SET_ESTADO", payload: estadoCalculado });

    Swal.fire({
      title: "Publicando promoción...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const payload = {
        titulo: state.titulo,
        descripcion: state.descripcion,
        tipo: state.tipo,
        localId: state.localId,
        fechaInicio: state.fechaInicio,
        fechaFin: state.fechaFin,
        limiteUsos: state.limiteUsos === "" ? null : parseInt(state.limiteUsos, 10),
        estado: estadoCalculado,
      };

      console.log("Payload a enviar:", payload);
      // Aquí va tu llamada a la API

      Swal.close();
      await Swal.fire({
        icon: "success",
        title: "¡Promoción publicada!",
        text: "Tu promoción ya está activa.",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      Swal.close();
      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Ocurrió un error al publicar la promoción.";

      Swal.fire({
        icon: "error",
        title: "Error al publicar",
        text: mensaje,
        confirmButtonColor: "#806fbe",
      });
    }
  };

  const handlePreview = () => {
    const previewEl = document.getElementById("preview-promo");
    if (previewEl) {
      previewEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    console.log("Payload a enviar:", {
      titulo: state.titulo,
      descripcion: state.descripcion,
      tipo: state.tipo,
      localId: state.localId,
      fechaInicio: state.fechaInicio,
      fechaFin: state.fechaFin,
      limiteUsos: state.limiteUsos === "" ? null : parseInt(state.limiteUsos),
      estado: estadoCalculado,
    });
  };

  return (
    <div className="promociones-container">
      <div className="formulario-contenedor">
        <HeaderPromo />

        <PromoInfoBasica state={state} dispatch={dispatch} />
        <PromoLocal state={state} dispatch={dispatch} />
        <PromoDisponibilidad state={state} dispatch={dispatch} />

        <div className="mt-4">
          <label className="promo-label mb-2">
            <FaCamera className="me-2" />
            Imágenes de la promoción
          </label>
          <ImageUploader
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
          <PromoBotones onPreview={handlePreview} onPublish={handlePublicar} />
        </div>
      </div>
    </div>
  );
}