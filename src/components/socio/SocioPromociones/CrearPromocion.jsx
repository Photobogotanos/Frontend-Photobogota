import { useReducer, useMemo, useState, useRef, useEffect } from "react";
import LottieImport from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

import HeaderPromo from "./HeaderPromo";
import PromoInfoBasica from "./PromoInfoBasica";
import PromoLocal from "./PromoLocal";
import PromoDisponibilidad from "./PromoDisponibilidad";
import PromoPreview from "./PromoPreview";
import PromoBotones from "./PromoBotones";
import {
  crearPromocion,
  actualizarPromocion,
  obtenerPromocionPorId,
} from "@/services/promocion.service";
import { subirImagenesSpot } from "@/services/imagen.service";

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
    case "SET_IMAGENES_EXISTENTES":
      return { ...state, imagenesExistentes: action.payload };
    case "SET_PREVIEWS":
      return { ...state, previews: action.payload };
    case "SET_INDICE_IMAGEN":
      return { ...state, indiceImagen: action.payload };
    case "RESET":
      return { ...initialState };
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
  imagenesExistentes: [],
  previews: [],
  indiceImagen: 0,
};

// Lleva el foco a la vista previa de la promoción (función pura, sin estado).
const scrollAVistaPrevia = () => {
  document
    .getElementById("promo-preview-section")
    ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
          <button
            type="button"
            className="preview-carousel"
            onClick={() => onNavigate("next")}
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
          </button>

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
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, react-doctor/no-static-element-interactions
              <div
                key={src}
                className={`thumbnail-item${idx === indice ? " active" : ""}`}
                onClick={() => onSelectIndice(idx)}
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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get("id");

  const [state, dispatch] = useReducer(promoFormReducer, initialState);
  const previewsRef = useRef([]);
  const [publicando, setPublicando] = useState(false);
  const [cargandoPromo, setCargandoPromo] = useState(Boolean(editingId));

  useEffect(() => {
    previewsRef.current = state.previews;
  }, [state.previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewsRef.current = [];
    };
  }, []);

  // Modo edición: cargar los datos de la promoción existente.
  useEffect(() => {
    if (!editingId) return;

    let activo = true;
    obtenerPromocionPorId(editingId).then((resultado) => {
      if (!activo) return;
      setCargandoPromo(false);
      if (resultado.exitoso && resultado.datos) {
        const p = resultado.datos;
        dispatch({ type: "SET_TITULO", payload: p.titulo || "" });
        dispatch({ type: "SET_DESCRIPCION", payload: p.descripcion || "" });
        dispatch({ type: "SET_TIPO", payload: p.tipo || "descuento" });
        dispatch({ type: "SET_LOCAL_ID", payload: p.spotId || null });
        dispatch({ type: "SET_FECHA_INICIO", payload: p.fechaInicio ? String(p.fechaInicio).slice(0, 10) : "" });
        dispatch({ type: "SET_FECHA_FIN", payload: p.fechaFin ? String(p.fechaFin).slice(0, 10) : "" });
        dispatch({ type: "SET_LIMITE_USOS", payload: p.usosMaximos ?? "" });
        dispatch({ type: "SET_IMAGENES_EXISTENTES", payload: p.imagenes || [] });
        dispatch({ type: "SET_PREVIEWS", payload: p.imagenes || [] });
        dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
      } else {
        toast.error(resultado.mensaje || "No se pudo cargar la promoción");
      }
    });
    return () => {
      activo = false;
    };
  }, [editingId]);

  const estadoCalculado = useMemo(() => {
    if (!state.fechaFin) return "activa";
    return new Date(state.fechaFin) < new Date() ? "expirada" : "activa";
  }, [state.fechaFin]);

  const handleImagen = (files) => {
    // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke -- se revoca en handleRemoveImagen y en unmount (previewsRef)
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({ type: "SET_PREVIEWS", payload: [...state.previews, ...newPreviews] });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const handleRemoveImagen = (idx) => {
    const yaExistente = Array.isArray(state.imagenesExistentes)
      ? idx < state.imagenesExistentes.length
      : false;

    if (yaExistente) {
      // Se quita una imagen ya guardada en el backend.
      const nuevasExistentes = state.imagenesExistentes.filter((_, i) => i !== idx);
      const nuevosPreviews = state.previews.filter((_, i) => i !== idx);
      dispatch({ type: "SET_IMAGENES_EXISTENTES", payload: nuevasExistentes });
      dispatch({ type: "SET_PREVIEWS", payload: nuevosPreviews });
    } else {
      // Se quita un archivo local no subido aún.
      updatePreviewCleanup();
      const url = state.previews[idx];
      if (url) URL.revokeObjectURL(url);
      const indiceEnArchivos = idx - (state.imagenesExistentes?.length || 0);
      const nuevasImagenes = state.imagenes.filter(
        (_, i) => i !== indiceEnArchivos,
      );
      const nuevosPreviews = state.previews.filter((_, i) => i !== idx);
      dispatch({ type: "SET_IMAGENES", payload: nuevasImagenes });
      dispatch({ type: "SET_PREVIEWS", payload: nuevosPreviews });
    }

    const nuevoIdx = Math.min(state.indiceImagen, state.previews.length - 2);
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  // Sincroniza previewsRef antes de modificar el estado para que el cleanup de
  // unmount/eliminación siempre tenga la lista actual.
  const updatePreviewCleanup = () => {
    previewsRef.current = state.previews;
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

  const handleSubmit = async () => {
    if (!state.localId) {
      toast.error("Selecciona el local al que pertenece la promoción");
      return;
    }
    if (!state.titulo.trim()) {
      toast.error("Escribe un título para la promoción");
      return;
    }
    if (!state.descripcion.trim()) {
      toast.error("Escribe una descripción para la promoción");
      return;
    }
    if (!state.fechaInicio || !state.fechaFin) {
      toast.error("Selecciona la fecha de inicio y la fecha de fin");
      return;
    }
    if (new Date(state.fechaFin) < new Date(state.fechaInicio)) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    setPublicando(true);
    try {
      // 1. Subir imágenes nuevas (solo archivos locales, no las URLs ya guardadas)
      let urlsNuevas = [];
      if (state.imagenes.length > 0) {
        const resultadoImagenes = await subirImagenesSpot(state.imagenes);
        if (!resultadoImagenes.exitoso) {
          toast.error(resultadoImagenes.mensaje);
          setPublicando(false);
          return;
        }
        urlsNuevas = resultadoImagenes.urls;
      }

      const body = {
        spotId: state.localId,
        titulo: state.titulo.trim(),
        descripcion: state.descripcion.trim(),
        tipo: state.tipo,
        imagenes: [...(state.imagenesExistentes || []), ...urlsNuevas],
        fechaInicio: state.fechaInicio,
        fechaFin: state.fechaFin,
        usosMaximos:
          state.limiteUsos === "" || !state.limiteUsos
            ? null
            : parseInt(state.limiteUsos, 10),
      };

      const resultado = editingId
        ? await actualizarPromocion(editingId, body)
        : await crearPromocion(body);

      if (resultado.exitoso) {
        toast.success(resultado.mensaje);
        navigate("/socio-promociones");
      } else {
        toast.error(resultado.mensaje);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje || error.message || "Error al publicar la promoción",
      );
    } finally {
      setPublicando(false);
    }
  };

  if (cargandoPromo) {
    return (
      <div className="promociones-cargando text-center py-5">
        <span className="promo-loading-text">Cargando promoción...</span>
      </div>
    );
  }

  return (
    <div className="promociones-container">
      <div className="formulario-contenedor">
        <HeaderPromo editando={Boolean(editingId)} />

        <PromoInfoBasica state={state} dispatch={dispatch} />
        <PromoLocal state={state} dispatch={dispatch} edicionLocalId={state.localId} />
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

        <div id="promo-preview-section">
          <PromoPreview state={state} estado={estadoCalculado} />
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4">
          <PromoBotones
            onPreview={scrollAVistaPrevia}
            onPublish={handleSubmit}
            publicando={publicando}
          />
        </div>
      </div>
    </div>
  );
}