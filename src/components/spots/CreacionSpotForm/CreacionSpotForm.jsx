import { useReducer, useRef, useState } from "react";
import Select from "react-select";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import {
  FaMapMarkerAlt, FaCamera, FaInfoCircle, FaHeart,
  FaStar, FaRegStar, FaPaperPlane, FaEye, FaTrash,
  FaChevronLeft, FaChevronRight,
} from "react-icons/fa";
import "./CreacionSpotForm.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import SpotPreviewModal from "../SpotPreviewModal/SpotPreviewModal";

// ── Reducer ──────────────────────────────────────────────
const spotFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_IMAGENES": return { ...state, imagenes: action.payload };
    case "SET_PREVIEWS": return { ...state, previews: action.payload };
    case "SET_INDICE_IMAGEN": return { ...state, indiceImagenActual: action.payload };
    case "SET_NOMBRE_LUGAR": return { ...state, nombreLugar: action.payload };
    case "SET_DIRECCION": return { ...state, direccion: action.payload };
    case "SET_DESCRIPCION": return { ...state, descripcionImagen: action.payload };
    case "SET_RECOMENDACION": return { ...state, recomendacion: action.payload };
    case "SET_TIPS_FOTO": return { ...state, tipsFoto: action.payload };
    case "SET_CATEGORIA": return { ...state, categoria: action.payload };
    case "SET_LOCALIDAD": return { ...state, localidad: action.payload };
    case "SET_SHOW_MODAL": return { ...state, showModal: action.payload };
    case "SET_RESENA_RATING": return { ...state, nuevaResena: { ...state.nuevaResena, rating: action.payload } };
    case "SET_HOVER_RATING": return { ...state, hoverRating: action.payload };
    default: return state;
  }
};

const initialState = {
  imagenes: [], previews: [], indiceImagenActual: 0,
  nombreLugar: "", direccion: "", descripcionImagen: "",
  recomendacion: "", tipsFoto: "",
  categoria: null, localidad: null,
  showModal: false,
  nuevaResena: { rating: 0, comentario: "" },
  hoverRating: 0,
};

const categorias = [
  { value: "naturaleza", label: "Naturaleza" },
  { value: "urbano", label: "Urbano" },
  { value: "historico", label: "Histórico" },
  { value: "gastronomia", label: "Gastronomía" },
];

const localidades = [
  { value: "chapinero", label: "Chapinero" },
  { value: "usaquen", label: "Usaquén" },
  { value: "suba", label: "Suba" },
  { value: "kennedy", label: "Kennedy" },
];

// ── Drag & Drop Uploader ──────────────────────────────────
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
        // ── Estado vacío ──
        <div
          className={`drop-zone${isDragging ? " dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
        // ── Con imágenes ──
        <div className="uploader-con-imagenes">

          {/* Imagen principal */}
          <div className="preview-carousel" onClick={() => onNavigate("next")}>
            <img
              src={previews[indice]}
              alt={`Preview ${indice + 1}`}
              className="preview-img"
            />

            <span className="preview-counter">{indice + 1} / {total}</span>

            {total > 1 && (
              <>
                <button type="button" className="preview-nav prev"
                  onClick={() => onNavigate("prev")} aria-label="Anterior">
                  <FaChevronLeft />
                </button>
                <button type="button" className="preview-nav next"
                  onClick={() => onNavigate("next")} aria-label="Siguiente">
                  <FaChevronRight />
                </button>
              </>
            )}

            <button type="button" className="preview-remove"
              onClick={() => onRemove(indice)} aria-label="Eliminar imagen">
              <FaTrash />
            </button>
          </div>

          {/* ── Tira de thumbnails ── */}
          <div className="thumbnails-strip">
            {previews.map((src, idx) => (
              <div
                key={idx}
                className={`thumbnail-item${idx === indice ? " active" : ""}`}
                onClick={() => onSelectIndice(idx)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && onSelectIndice(idx)}
                aria-label={`Ver imagen ${idx + 1}`}
              >
                <img src={src} alt={`Thumb ${idx + 1}`} />
                {/* Botón eliminar sobre el thumb */}
                <button
                  type="button"
                  className="thumb-remove"
                  onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
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

// ── Sub-componentes ──────────────────────────────────────
const FormField = ({ label, htmlFor, required, icon, children }) => (
  <Col xs={12}>
    <label className="spot-label" htmlFor={htmlFor}>
      {icon && <span className="me-2">{icon}</span>}
      {label}
      {required && <RequiredMark />}
    </label>
    {children}
  </Col>
);

const TextAreaField = ({ label, htmlFor, required, icon, value, onChange, rows, placeholder }) => (
  <div className="mb-3">
    <label className="spot-label" htmlFor={htmlFor}>
      {icon && <span className="me-2">{icon}</span>}
      {label}
      {required && <RequiredMark />}
    </label>
    <textarea
      id={htmlFor}
      className="spot-textarea"
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// ── Componente principal ─────────────────────────────────
export default function CrearSpot() {
  const [state, dispatch] = useReducer(spotFormReducer, initialState);

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
    const nuevoIdx = Math.min(state.indiceImagenActual, newPreviews.length - 1);
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  const handleNavigate = (dir) => {
    const total = state.previews.length;
    const next = dir === "next"
      ? (state.indiceImagenActual + 1) % total
      : (state.indiceImagenActual - 1 + total) % total;
    dispatch({ type: "SET_INDICE_IMAGEN", payload: next });
  };

  const usarUbicacionActual = () => {
    if (!navigator.geolocation) return alert("Geolocalización no disponible");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => dispatch({
        type: "SET_DIRECCION",
        payload: `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`,
      }),
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  const spotData = {
    nombre: state.nombreLugar || "Nombre del lugar",
    direccion: state.direccion || "Dirección del lugar",
    imagen: state.previews[0] || "/images/spots/spot-demo.jpg",
    rating: 0, totalResenas: 0,
    categoria: state.categoria?.label || "Categoría",
    localidad: state.localidad?.label || null,
    descripcion: state.descripcionImagen || "Descripción del lugar...",
    recomendacion: state.recomendacion || null,
    tipsFoto: state.tipsFoto || null,
    resenas: [],
  };

  return (
    <div className="pb-5">
      <div className="formulario-contenedor">

        {/* ── Header editorial ── */}
        <div className="spot-header">
          <span className="spot-header-subtitle">Nueva publicación</span>
          <h2 className="spot-header-title">Crear spot</h2>
          <span className="spot-header-line" />
        </div>

        <Row className="g-4">
          <Col xs={12}>

            {/* Uploader */}
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
              onSelectIndice={(idx) => dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })}
            />

            {/* Nombre */}
            <Row className="g-3 mb-2 mt-1">
              <FormField label="Nombre del lugar" htmlFor="nombre-lugar" required>
                <input
                  id="nombre-lugar"
                  type="text"
                  className="spot-input"
                  placeholder="Ej: Mirador de Monserrate"
                  value={state.nombreLugar}
                  onChange={(e) => dispatch({ type: "SET_NOMBRE_LUGAR", payload: e.target.value })}
                />
              </FormField>
            </Row>

            {/* Ubicación */}
            <Row className="g-3 mb-2">
              <FormField label="Ubicación" htmlFor="ubicacion-lugar" required icon={<FaMapMarkerAlt />}>
                <div className="d-flex gap-2">
                  <input
                    id="ubicacion-lugar"
                    type="text"
                    className="spot-input"
                    placeholder="Dirección o referencia"
                    value={state.direccion}
                    onChange={(e) => dispatch({ type: "SET_DIRECCION", payload: e.target.value })}
                  />
                  <button
                    type="button"
                    className="spot-location-btn"
                    onClick={usarUbicacionActual}
                    aria-label="Obtener ubicación actual"
                  >
                    <FaMapMarkerAlt />
                  </button>
                </div>
              </FormField>
            </Row>

            {/* Categoría y localidad */}
            <Row className="g-3 mb-3">
              <Col xs={12} md={6}>
                <label className="spot-label" htmlFor="categoria-spot">
                  Categoría <RequiredMark />
                </label>
                <Select
                  inputId="categoria-spot"
                  options={categorias}
                  classNamePrefix="spot-select"
                  value={state.categoria}
                  onChange={(val) => dispatch({ type: "SET_CATEGORIA", payload: val })}
                  placeholder="Seleccionar..."
                />
              </Col>
              <Col xs={12} md={6}>
                <label className="spot-label" htmlFor="localidad-spot">
                  Localidad <RequiredMark />
                </label>
                <Select
                  inputId="localidad-spot"
                  options={localidades}
                  classNamePrefix="spot-select"
                  value={state.localidad}
                  onChange={(val) => dispatch({ type: "SET_LOCALIDAD", payload: val })}
                  placeholder="Seleccionar..."
                />
              </Col>
            </Row>

            <TextAreaField
              label="Descripción de la imagen"
              htmlFor="descripcion-imagen"
              required
              value={state.descripcionImagen}
              onChange={(val) => dispatch({ type: "SET_DESCRIPCION", payload: val })}
              rows={2}
              placeholder="Describe lo que se ve en la foto"
            />

            <TextAreaField
              label="¿Por qué recomiendas este lugar?"
              htmlFor="recomendacion-lugar"
              required
              icon={<FaHeart />}
              value={state.recomendacion}
              onChange={(val) => dispatch({ type: "SET_RECOMENDACION", payload: val })}
              rows={3}
              placeholder="Cuéntanos tu experiencia"
            />

            <TextAreaField
              label="Tips de fotografía (opcional)"
              htmlFor="tips-foto"
              icon={<FaInfoCircle />}
              value={state.tipsFoto}
              onChange={(val) => dispatch({ type: "SET_TIPS_FOTO", payload: val })}
              rows={2}
              placeholder="Hora ideal, lente, ángulo, etc."
            />
          </Col>
        </Row>

        {/* Botones */}
        <div className="botones-contenedor mt-3">
          <BackButton />
          <button
            type="button"
            className="spot-btn-preview"
            onClick={() => dispatch({ type: "SET_SHOW_MODAL", payload: true })}
          >
            <FaEye /> Previsualizar
          </button>
          <button type="button" className="spot-btn-publish">
            <FaPaperPlane /> Publicar
          </button>
        </div>

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