import { useReducer } from "react";
import Select from "react-select";
import {
  FaMapMarkerAlt,
  FaCamera,
  FaInfoCircle,
  FaHeart,
  FaComments,
  FaStar,
  FaRegStar,
  FaImages,
  FaMap,
  FaTag,
  FaPaperPlane,
  FaEye,
} from "react-icons/fa";
import "./CreacionSpotForm.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import SpotPreviewModal from "../SpotPreviewModal/SpotPreviewModal";

// Reducer para agrupar estados relacionados del formulario
const spotFormReducer = (state, action) => {
  switch (action.type) {
    case 'SET_IMAGENES':
      return { ...state, imagenes: action.payload };
    case 'SET_PREVIEWS':
      return { ...state, previews: action.payload };
    case 'SET_INDICE_IMAGEN':
      return { ...state, indiceImagenActual: action.payload };
    case 'SET_NOMBRE_LUGAR':
      return { ...state, nombreLugar: action.payload };
    case 'SET_DIRECCION':
      return { ...state, direccion: action.payload };
    case 'SET_DESCRIPCION':
      return { ...state, descripcionImagen: action.payload };
    case 'SET_RECOMENDACION':
      return { ...state, recomendacion: action.payload };
    case 'SET_TIPS_FOTO':
      return { ...state, tipsFoto: action.payload };
    case 'SET_CATEGORIA':
      return { ...state, categoria: action.payload };
    case 'SET_LOCALIDAD':
      return { ...state, localidad: action.payload };
    case 'SET_SHOW_MODAL':
      return { ...state, showModal: action.payload };
    case 'SET_RESENA_RATING':
      return { ...state, nuevaResena: { ...state.nuevaResena, rating: action.payload } };
    case 'SET_HOVER_RATING':
      return { ...state, hoverRating: action.payload };
    default:
      return state;
  }
};

const initialState = {
  imagenes: [],
  previews: [],
  indiceImagenActual: 0,
  nombreLugar: "",
  direccion: "",
  descripcionImagen: "",
  recomendacion: "",
  tipsFoto: "",
  categoria: null,
  localidad: null,
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

// Componente: Campo de formulario básico
const FormField = ({ label, htmlFor, required, icon, children }) => (
  <Col xs={12}>
    <label className="form-label" htmlFor={htmlFor}>
      {icon && <span className="me-2">{icon}</span>}
      {label}
      {required && <RequiredMark />}
    </label>
    {children}
  </Col>
);

// Componente: Selector de imagen
const ImageUploader = ({ previews, onImageChange }) => (
  <>
    <div className="image-upload rounded-4 mb-3">
      {previews.length > 0 ? (
        <img src={previews[0]} alt="Preview primera" className="img-preview" />
      ) : (
        <span className="text-muted">Previsualización de la imagen</span>
      )}
    </div>
    <input
      type="file"
      accept="image/*"
      multiple
      className="form-control rounded-pill mb-3"
      onChange={onImageChange}
      id="foto-lugar"
    />
  </>
);

// Componente: Selector de ubicación
const LocationSelector = ({ direccion, onDireccionChange, onUseCurrentLocation }) => (
  <div className="d-flex gap-2">
    <input
      id="ubicacion-lugar"
      type="text"
      className="form-control rounded-pill"
      placeholder="Dirección o referencia"
      value={direccion}
      onChange={(e) => onDireccionChange(e.target.value)}
    />
    <button
      type="button"
      className="btn-primary-custom rounded-pill px-4"
      onClick={onUseCurrentLocation}
      aria-label="Obtener ubicación actual"
    >
      <FaMapMarkerAlt />
    </button>
  </div>
);

// Componente: Selectores de categoría y localidad
const CategorySelectors = ({ categoria, localidad, onCategoriaChange, onLocalidadChange }) => (
  <Row className="g-3 mb-3">
    <Col xs={12} md={6}>
      <label className="form-label" htmlFor="categoria-spot">
        Categoría <RequiredMark />
      </label>
      <Select
        id="categoria-spot"
        options={categorias}
        classNamePrefix="react-select"
        value={categoria}
        onChange={onCategoriaChange}
        placeholder="Seleccionar..."
      />
    </Col>
    <Col xs={12} md={6}>
      <label className="form-label" htmlFor="localidad-spot">
        Localidad <RequiredMark />
      </label>
      <Select
        id="localidad-spot"
        options={localidades}
        classNamePrefix="react-select"
        value={localidad}
        onChange={onLocalidadChange}
        placeholder="Seleccionar..."
      />
    </Col>
  </Row>
);

// Componente: Área de texto del formulario
const TextAreaField = ({ label, htmlFor, required, icon, value, onChange, rows, placeholder }) => (
  <div className="mb-2">
    <label className="form-label" htmlFor={htmlFor}>
      {icon && <span className="me-2">{icon}</span>}
      {label}
      {required && <RequiredMark />}
    </label>
    <textarea
      id={htmlFor}
      className="form-control rounded-4"
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

// Componente: Estrellas interactivas para rating
const StarRating = ({ rating, hoverRating, onRate, onHover, onLeave }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((starValue) => {
      const isFilled = starValue <= (hoverRating || rating);
      return (
        <span
          key={starValue}
          className="star-icon"
          style={{ cursor: "pointer" }}
          onClick={() => onRate(starValue)}
          onMouseEnter={() => onHover(starValue)}
          onMouseLeave={onLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onRate(starValue) }}
          aria-label={`Calificar con ${starValue} estrellas`}
        >
          {isFilled ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
        </span>
      );
    })}
  </div>
);

// Componente principal del formulario
export default function CrearSpot() {
  const [state, dispatch] = useReducer(spotFormReducer, initialState);

  const handleImagen = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    dispatch({ type: 'SET_IMAGENES', payload: files });
    dispatch({ type: 'SET_PREVIEWS', payload: newPreviews });
    dispatch({ type: 'SET_INDICE_IMAGEN', payload: 0 });
  };

  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      alert("La geolocalización no está disponible");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        console.log("Ubicación actual (Bogotá):", latitude, longitude);
      },
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  const tieneVariasImagenes = state.previews.length > 1;

  const spotData = {
    nombre: state.nombreLugar || "Nombre del lugar",
    direccion: state.direccion || "Dirección del lugar",
    imagen: state.previews[0] || "/images/spots/spot-demo.jpg",
    rating: 0,
    totalResenas: 0,
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
        <h4 className="titulo-crear-publicacion">Crear nuevo spot</h4>

        <Row className="g-4">
          <Col xs={12}>
            {/* Upload de imagen */}
            <label className="form-label fw-medium" htmlFor="foto-lugar">
              Foto del lugar <FaCamera className="me-2" />
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Campo obligatorio</Tooltip>}
              >
                <span className="text-danger"> *</span>
              </OverlayTrigger>
            </label>
            <ImageUploader previews={state.previews} onImageChange={handleImagen} />

            <Row className="g-3 mb-2">
              <FormField label="Nombre del lugar" htmlFor="nombre-lugar" required>
                <input
                  id="nombre-lugar"
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ej: Mirador de Monserrate"
                  value={state.nombreLugar}
                  onChange={(e) => dispatch({ type: 'SET_NOMBRE_LUGAR', payload: e.target.value })}
                />
              </FormField>
            </Row>

            <Row className="g-3 mb-2">
              <FormField label="Ubicación" htmlFor="ubicacion-lugar" required icon={<FaMapMarkerAlt />}>
                <LocationSelector
                  direccion={state.direccion}
                  onDireccionChange={(val) => dispatch({ type: 'SET_DIRECCION', payload: val })}
                  onUseCurrentLocation={usarUbicacionActual}
                />
              </FormField>
            </Row>

            <CategorySelectors
              categoria={state.categoria}
              localidad={state.localidad}
              onCategoriaChange={(val) => dispatch({ type: 'SET_CATEGORIA', payload: val })}
              onLocalidadChange={(val) => dispatch({ type: 'SET_LOCALIDAD', payload: val })}
            />

            <TextAreaField
              label="Descripción de la(s) imagen(es)"
              htmlFor="descripcion-imagen"
              required
              value={state.descripcionImagen}
              onChange={(val) => dispatch({ type: 'SET_DESCRIPCION', payload: val })}
              rows={1}
              placeholder="Describe lo que se ve en la foto"
            />

            <TextAreaField
              label="¿Por qué recomiendas este lugar?"
              htmlFor="recomendacion-lugar"
              required
              icon={<FaHeart />}
              value={state.recomendacion}
              onChange={(val) => dispatch({ type: 'SET_RECOMENDACION', payload: val })}
              rows={3}
              placeholder="Cuéntanos tu experiencia"
            />

            <div className="mb-3">
              <label className="form-label" htmlFor="tips-foto">
                Tips de fotografía (opcional) <FaInfoCircle className="me-2" />
              </label>
              <textarea
                id="tips-foto"
                className="form-control rounded-4"
                rows={1}
                placeholder="Hora ideal, lente, ángulo, etc."
                value={state.tipsFoto}
                onChange={(e) => dispatch({ type: 'SET_TIPS_FOTO', payload: e.target.value })}
              />
            </div>
          </Col>
        </Row>

        <div className="botones-contenedor justify-content-between mt-3">
          <BackButton />
          <button
            type="button"
            className="btn-preview-modern rounded-pill px-4 py-2"
            onClick={() => dispatch({ type: 'SET_SHOW_MODAL', payload: true })}
          >
            <FaEye />
            Previsualizar Spot
          </button>

          <button className="btn-primary-custom rounded-pill px-5 py-2" type="button">
            <FaPaperPlane className="me-2" /> Publicar
          </button>
        </div>

        {/* Modal de previsualización */}
        <SpotPreviewModal
          show={state.showModal}
          onHide={() => dispatch({ type: 'SET_SHOW_MODAL', payload: false })}
          spotData={spotData}
          previews={state.previews}
        />
      </div>
    </div>
  );
}
