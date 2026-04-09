import { useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import { FaCamera, FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import "./CreacionSpotForm.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import SpotPreviewModal from "../SpotPreviewModal/SpotPreviewModal";
import HeaderSpot from "./HeaderSpot";
import SpotInformacionBasica from "./SpotInformacionBasica";
import SpotCategorizacion from "./SpotCategorizacion";
import SpotDescripcion from "./SpotDescripcion";
import SpotBotones from "./SpotBotones";
import { crearSpot } from "@/services/spot.service";

// ============================================================
// REDUCER
// ============================================================
const spotFormReducer = (state, action) => {
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
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
};

// ============================================================
// ESTADO INICIAL
// ============================================================
const initialState = {
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
};

// ============================================================
// COMPONENTE IMAGE UPLOADER
// ============================================================
function ImageUploader({ previews, onImageChange, onRemove, onNavigate, indice, onSelectIndice }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
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
        // Estado sin imágenes - Zona de drop
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
            <Lottie animationData={uploadAnimation} loop style={{ width: 110, height: 110 }} />
          </div>
          <p className="drop-zone-title">Arrastra tus fotos aquí</p>
          <p className="drop-zone-sub">o haz clic para seleccionar</p>
          <span className="drop-zone-badge">JPG · PNG · WEBP · múltiples</span>
        </div>
      ) : (
        // Estado con imágenes - Carrusel de previews
        <div className="uploader-con-imagenes">
          <div
            className="preview-carousel"
            onClick={() => onNavigate("next")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onNavigate("next")}
            aria-label="Avanzar imagen"
          >
            <img src={previews[indice]} alt={`Preview ${indice + 1}`} className="preview-img" />
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

          {/* Miniaturas */}
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

            {/* Botón para agregar más imágenes */}
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
// COMPONENTE PRINCIPAL CrearSpot
// ============================================================
export default function CrearSpot() {
  const [state, dispatch] = useReducer(spotFormReducer, initialState);
  const navigate = useNavigate();

  // ============================================================
  // HANDLERS DE IMÁGENES
  // ============================================================
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

    // Ajustar el índice actual
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

  // ============================================================
  // VALIDACIÓN DEL FORMULARIO
  // ============================================================
  const validarFormulario = () => {
    if (!state.nombreLugar.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor ingresa el nombre del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.direccion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Dirección requerida",
        text: "Por favor ingresa la dirección del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.categoria) {
      Swal.fire({
        icon: "warning",
        title: "Categoría requerida",
        text: "Por favor selecciona una categoría.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.localidad) {
      Swal.fire({
        icon: "warning",
        title: "Localidad requerida",
        text: "Por favor selecciona una localidad.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.descripcionImagen.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Descripción requerida",
        text: "Por favor ingresa una descripción del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (state.imagenes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Imágenes requeridas",
        text: "Por favor sube al menos una imagen del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.latitud || !state.longitud) {
      Swal.fire({
        icon: "warning",
        title: "Ubicación GPS requerida",
        text: "Usa el botón de ubicación para obtener las coordenadas del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    return true;
  };

  // ============================================================
  // HANDLER DE PUBLICACIÓN
  // ============================================================
  const handlePublicar = async () => {
    // Validar formulario
    if (!validarFormulario()) {
      return;
    }

    dispatch({ type: "SET_CARGANDO", payload: true });

    // Mostrar loading
    const loadingSwal = Swal.fire({
      title: "Publicando spot...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Preparar datos para el backend según el DTO CrearSpotRequestDTO
      const spotParaEnviar = {
        nombre: state.nombreLugar,
        latitud: parseFloat(state.latitud),
        longitud: parseFloat(state.longitud),
        direccion: state.direccion,
        categoria: state.categoria?.value || state.categoria,
        localidad: state.localidad?.value || state.localidad,
        descripcion: state.descripcionImagen,
        recomendacion: state.recomendacion || "",
        tipsFoto: state.tipsFoto || "",
        imagenes: [], // TODO: Implementar subida de imágenes a Cloudinary
      };

      console.log("Enviando spot:", spotParaEnviar);

      const resultado = await crearSpot(spotParaEnviar);

      await loadingSwal.close();
      dispatch({ type: "SET_CARGANDO", payload: false });

      if (resultado.exitoso) {
        await Swal.fire({
          icon: "success",
          title: "¡Spot publicado!",
          text: "Tu spot ya está visible en el mapa.",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        navigate(`/spot/${resultado.datos.id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al publicar",
          text: resultado.mensaje,
          confirmButtonColor: "#806fbe",
        });
      }
    } catch (error) {
      await loadingSwal.close();
      dispatch({ type: "SET_CARGANDO", payload: false });

      console.error("Error inesperado:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Ocurrió un error al publicar el spot. Por favor intenta nuevamente.",
        confirmButtonColor: "#806fbe",
      });
    }
  };

  // ============================================================
  // DATOS PARA EL MODAL DE PREVIEW
  // ============================================================
  const spotData = {
    nombre: state.nombreLugar || "Nombre del lugar",
    direccion: state.direccion || "Dirección del lugar",
    imagen: state.previews[0] || null,
    rating: 0,
    totalResenas: 0,
    categoria: state.categoria?.label || "Categoría",
    localidad: state.localidad?.label || null,
    descripcion: state.descripcionImagen || "Descripción del lugar...",
    recomendacion: state.recomendacion || null,
    tipsFoto: state.tipsFoto || null,
    resenas: [],
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        <HeaderSpot />

        <Row className="g-4">
          <Col xs={12}>
            {/* Sección de imágenes */}
            <label className="spot-label mb-2" htmlFor="foto-lugar">
              <FaCamera className="me-2" />
              Foto del lugar <RequiredMark />
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

            {/* Información básica */}
            <SpotInformacionBasica
              nombreLugar={state.nombreLugar}
              direccion={state.direccion}
              onNombreChange={(val) =>
                dispatch({ type: "SET_NOMBRE_LUGAR", payload: val })
              }
              onDireccionChange={(val) =>
                dispatch({ type: "SET_DIRECCION", payload: val })
              }
              onLatitudChange={(val) =>
                dispatch({ type: "SET_LATITUD", payload: val })
              }
              onLongitudChange={(val) =>
                dispatch({ type: "SET_LONGITUD", payload: val })
              }
            />

            {/* Categorización */}
            <SpotCategorizacion
              categoria={state.categoria}
              localidad={state.localidad}
              onCategoriaChange={(val) =>
                dispatch({ type: "SET_CATEGORIA", payload: val })
              }
              onLocalidadChange={(val) =>
                dispatch({ type: "SET_LOCALIDAD", payload: val })
              }
            />

            {/* Descripción y detalles */}
            <SpotDescripcion
              descripcionImagen={state.descripcionImagen}
              recomendacion={state.recomendacion}
              tipsFoto={state.tipsFoto}
              onDescripcionChange={(val) =>
                dispatch({ type: "SET_DESCRIPCION", payload: val })
              }
              onRecomendacionChange={(val) =>
                dispatch({ type: "SET_RECOMENDACION", payload: val })
              }
              onTipsFotoChange={(val) =>
                dispatch({ type: "SET_TIPS_FOTO", payload: val })
              }
            />
          </Col>
        </Row>

        {/* Botones de acción */}
        <SpotBotones
          onPreview={() => dispatch({ type: "SET_SHOW_MODAL", payload: true })}
          onPublish={handlePublicar}
          cargando={state.cargando}
        />

        {/* Modal de previsualización */}
        <SpotPreviewModal
          show={state.showModal}
          onHide={() => dispatch({ type: "SET_SHOW_MODAL", payload: false })}
          spotData={spotData}
          previews={state.previews}
        />
      </div>
    </div>
  );
}