import { useReducer, useRef, useState, useMemo } from "react";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import "./CrearPromocion.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

import {
  FaCamera,
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
  FaStore,
} from "react-icons/fa";
import HeaderPromo from "./HeaderPromo";
import { div } from "framer-motion/client";
import Select from "react-select/base";
import PromoInfoBasica from "./PromoInfoBasica";
import PromoDisponibilidad from "./PromoDisponibilidad";
import PromoEstado from "./PromoEstado";
import PromoBotones from "./PromoBotones";

const promoFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_IMAGENES":
      return { ...state, imagenes: action.payload };
    case "SET_PREVIEWS":
      return { ...state, previews: action.payload };
    case "SET_INDICE_IMAGEN":
      return { ...state, indiceImagenActual: action.payload };
    case "SET_TITULO_PROMO":
      return { ...state, tituloPromo: action.payload };
    case "SET_DESCRIPCION_PROMO":
      return { ...state, descripcionPromo: action.payload };
    case "SET_TIPO_PROMO":
      return { ...state, tipoPromo: action.payload };
    case "SET_LOCAL_PROMO":
      return { ...state, localPromo: action.payload };
    case "SET_LIMITE_USOS":
  return { ...state, limiteUsos: action.payload };
    case "SET_ESTADO_INICIAL":
      return { ...state, estadoInicial: action.payload };
    case "SET_FECHA_INICIO":
      return { ...state, fechaInicio: action.payload };
    case "SET_FECHA_FIN":
      return { ...state, fechaFin: action.payload };
    case "SET_SHOW_MODAL":
      return { ...state, showModal: action.payload };
    case "RESET_FORM":
      default:
      return state;
  }
};

const initialState = {
  imagenes: [],
  previews: [],
  indiceImagenActual: 0,
  tituloPromo: "",
  descripcionPromo: "",
  tipoPromo: "",
  localPromo: null,
  limiteUsos: null,
  estadoInicial: "Activa",
  fechaInicio: "",
  fechaFin: "",
  showModal: false,
};

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
      f.type.startsWith("image/"),
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
          aria-label="Subir Imagenes"
        >
          <div className="drop-zone-lottie">
            <Lottie
              animationData={uploadAnimation}
              loop
              style={{ width: 110, height: 110 }}
            />
          </div>
          <p className="drop-zone-title">Pon las fotos de tu promoción aquí</p>
          <p className="drop-zone-sub">o haz click para seleccionar</p>
          <span className="drop-zone-badge">JPG · PNG · WEBP · múltiples</span>
        </div>
      ) : (
        <div className="uploader-con-imagenes">
          <div
            className="preview-carousel"
            onClick={() => onNavigate("next")}
            role="button"
            tableIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate("next")}
            aria-label="Avanzar imagen"
          >
            <img
              src={previews[indice]}
              alt={`Previews ${indice + 1}`}
              className="preview-img"
            />
            <span className="preview-counter">
              {indice + 1} / {total}{" "}
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

          {/* ── Tira de thumbnails ── */}
          <div className="thumbnails-strip">
            {previews.map((src, idx) => (
              <div
                key={src}
                className={`thumnail-item${idx === indice ? " active" : ""}`}
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

            {/* Botón agregar más */}
            <div
              className="thumbnail-add"
              onClick={() => inputRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
              aria-label="Agregar más fotos"
            >
              <span className="thumbnail-add-icon">+</span>
              <span className="thumbnail-add-text">Añañiiir</span>
            </div>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </div>
  );
}

//-- Componente principal --------------------------------------------
export default function CrearPromocion() {
  const [state, dispatch] = useReducer(promoFormReducer, initialState);

  const today =useMemo(() => new Date().toISOString().split("T")[0], []);

  const estadoActual = useMemo(() => {
    if (!state.fechaFin) return state.estadoInicial;

    const hoy = new Date();
    const fin = new Date(state.fechaFin);

    if (fin < hoy) return "Expirada";
    return state.estadoInicial;
  }, [state.fechaFin, state.estadoInicial]);


  const handleImagen = (files) => {
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({
      type: "SET_PREVIEWS",
      payload: [...state.previews, ...newPreviews],
    });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const handleRemoveImagen = (idx) => {
    const newImagenes = state.imagenes.filter((_, i) => i !== idx);
    const newPreviews = state.previews.filter((_, i) => i !== idx);
    dispatch({ type: "SET_IMAGENES", payload: newImagenes });
    dispatch({ type: "SET_PREVIEWS", payload: newPreviews });
    const nuevoIdx = Math.min(state.indiceImagenActual, newPreviews.length - 1);
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  const handleNavigate = (dir) => {
    const total = state.previews.length;
    const next =
      dir === "next"
        ? (state.indiceImagenActual + 1) % total
        : (state.indiceImagenActual - 1 + total) % total;
    dispatch({ type: "SET_INDICE_IMAGEN", payload: next });
  };

 

//Validación de campos y creación del objeto de promoción

//Handle Enviar
  const handlePublicar = async () => {}




  const promoData = {
    titulo: state.tituloPromo || "Nombre de la promoción",
    local: state.localPromo || "Local de la promoción",
    limiteUsos: state.limiteUsos ? `${state.limiteUsos} usos` : "Ilimitado",
    imagen: state.previews[0] || null,
    tipoPromo: state.tipo?.label || "Tipo de promoción", 
    descripcion: state.descripcionPromo || "Descripción de la promoción...",
    fechaInicio: state.fechaInicio || "Fecha de inicio",
    fechaFin: state.fechaFin || "Fecha de fin",
    estado: state.estadoActual || "Estado de la promoción",
  };

  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        {/* Header  */}
        <HeaderPromo />

        <Row className="g-4">
          <PromoInfoBasica
            tituloPromo={state.tituloPromo}
            descripcionPromo={state.descripcionPromo}
            localPromo={state.localPromo}
            onTituloChange={(value) =>
              dispatch({ type: "SET_TITULO_PROMO", payload: value })
            }
            onDescripcionPromoChange={(value) =>
              dispatch({ type: "SET_DESCRIPCION_PROMO", payload: value })
            }
            onLocalChange={(value) =>
              dispatch({ type: "SET_LOCAL_PROMO", payload: value })
            }
          />

          <PromoDisponibilidad
            fechaInicio={state.fechaInicio}
            fechaFin={state.fechaFin}
            limiteUsos={state.limiteUsos}
            onFechaInicioChange={(value) =>
              dispatch({ type: "SET_FECHA_INICIO", payload: value })
            }
            onFechaFinChange={(value) =>
              dispatch({ type: "SET_FECHA_FIN", payload: value })
            }
            onLimiteUsosChange={(value) =>
              dispatch({ type: "SET_LIMITE_USOS", payload: value })
            }
          />

          <PromoEstado
            estado={estadoActual}
            onEstadoChange={(value) =>
              dispatch({ type: "SET_ESTADO_INICIAL", payload: value })
            }
          />

          <Col xs={12}>
            {/* Uploader */}
            <label className="promo-label mb-2" htmlFor="foto-promocion">
              <FaCamera className="me-2" />
              Foto de la promoción <RequiredMark />
            </label>
            <ImageUploader
              previews={state.previews}
              indice={state.indiceImagenActual}
              onImageChange={handleImagen}
              onRemove={handleRemoveImagen}
              onNavigate={handleNavigate}
              onSelectIndice={(idx) =>
                dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })
              }
            />
          </Col>
        </Row>
        <PromoBotones
          onPreview={() => dispatch({ type: "SET_SHOW_MODAL", playload: true })}
          onPublish={handlePublicar}
        />
      </div>
    </div>
  );
}

// }

// function ImageUploader({ previews, onImageChange, onRemove, onNavigate, indice, onSelectIndice})
//     const [isDragging, setIsDragging] = useState(false);
//     const inputRef= useRef();

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
//         if (files.length) onImageChange(files);
//     };

//     const handleFileInput = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length) onImageChange(files);
//     };

//     const total = previews.length;

// // Componente principal

// export default function CrearPromocion(){
// const [state, dispatch] = useReducer(spotFormReducer, initialState);

// const handleImagen = (files) => {
//     const newPreviews = files.map((f))
// }
// }
