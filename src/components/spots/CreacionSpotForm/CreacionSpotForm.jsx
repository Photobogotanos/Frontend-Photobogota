import { useState } from "react";
import Select from "react-select";
import {
  FaMapMarkerAlt,
  FaCamera,
  FaInfoCircle,
  FaHeart,
  FaCommentDots,
  FaShare,
  FaRegHeart,
  FaRegBookmark,
  FaBookmark,
  FaChevronLeft,
  FaChevronRight,
  FaPaperPlane,
  FaEye,
  FaStar,
  FaRegStar,
  FaImages,
  FaMap,
  FaClock,
  FaComments,
  FaPencilAlt,
  FaTag,
} from "react-icons/fa";
import "./CreacionSpotForm.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function CrearSpot() {
  const [imagenes, setImagenes] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Estados del formulario
  const [nombreLugar, setNombreLugar] = useState("");
  const [direccion, setDireccion] = useState("");
  const [descripcionImagen, setDescripcionImagen] = useState("");
  const [recomendacion, setRecomendacion] = useState("");
  const [tipsFoto, setTipsFoto] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [localidad, setLocalidad] = useState(null);

  // Estados para la previsualización del spot (como en SpotPage)
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: "" });
  const [hoverRating, setHoverRating] = useState(0);

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

  const handleImagen = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagenes(files);
    setPreviews(newPreviews);
    setIndiceImagenActual(0);
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
        // Aquí podrías hacer reverse geocoding si lo deseas en el futuro
      },
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  // Datos para la previsualización (como en SpotPage)
  const spotData = {
    nombre: nombreLugar || "Nombre del lugar",
    direccion: direccion || "Dirección del lugar",
    imagen: previews[0] || "/images/spots/spot-demo.jpg",
    rating: 0,
    totalResenas: 0,
    categoria: categoria?.label || "Categoría",
    localidad: localidad?.label || null,
    descripcion: descripcionImagen || "Descripción del lugar...",
    recomendacion: recomendacion || null,
    tipsFoto: tipsFoto || null,
    resenas: [],
  };

  const tieneVariasImagenes = previews.length > 1;

  // Función para renderizar estrellas (igual que en SpotContent)
  const renderStars = (rating, isInteractive = false) => {
    return [1, 2, 3, 4, 5].map((starValue) => {
      const isFilled = isInteractive
        ? starValue <= (hoverRating || rating)
        : starValue <= rating;
      return (
        <span
          key={starValue}
          className="star-icon"
          style={{ cursor: isInteractive ? "pointer" : "default" }}
          onClick={isInteractive ? () => setNuevaResena({ ...nuevaResena, rating: starValue }) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
        >
          {isFilled ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
        </span>
      );
    });
  };

  const imagenAnterior = (e) => {
    e.stopPropagation();
    setIndiceImagenActual((prev) =>
      prev === 0 ? previews.length - 1 : prev - 1
    );
  };

  const imagenSiguiente = (e) => {
    e.stopPropagation();
    setIndiceImagenActual((prev) =>
      prev === previews.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        <h4 className="titulo-crear-publicacion">Crear nuevo spot</h4>

        <Row className="g-4">
          {/* Formulario principal */}
          <Col xs={12}>
            {/* Upload de imagen */}
            <label className="form-label fw-medium">
              Foto del lugar <FaCamera className="me-2" />
              <RequiredMark />
            </label>

            <div className="image-upload rounded-4 mb-3">
              {previews.length > 0 ? (
                <img
                  src={previews[0]}
                  alt="Preview primera"
                  className="img-preview"
                />
              ) : (
                <span className="text-muted">
                  Previsualización de la imagen
                </span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              className="form-control rounded-pill mb-3"
              onChange={handleImagen}
            />

            <Row className="g-3 mb-2">
              <Col xs={12}>
                <label className="form-label">
                  Nombre del lugar
                  <RequiredMark />
                </label>
                <input
                  type="text"
                  className="form-control rounded-pill"
                  placeholder="Ej: Mirador de Monserrate"
                  value={nombreLugar}
                  onChange={(e) => setNombreLugar(e.target.value)}
                />
              </Col>
            </Row>

            <Row className="g-3 mb-2">
              <Col xs={12}>
                <label className="form-label">
                  Ubicación <FaMapMarkerAlt className="me-2" />
                  <RequiredMark />
                </label>
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    placeholder="Dirección o referencia"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Obtener ubicación actual</Tooltip>}
                  >
                    <button
                      type="button"
                      className="btn-primary-custom rounded-pill px-4"
                      onClick={usarUbicacionActual}
                    >
                      <FaMapMarkerAlt className="me-2" />
                    </button>
                  </OverlayTrigger>
                </div>
              </Col>
            </Row>

            <Row className="g-3 mb-3">
              <Col xs={12} md={6}>
                <label className="form-label">
                  Categoría
                  <RequiredMark />
                </label>
                <Select
                  options={categorias}
                  classNamePrefix="react-select"
                  value={categoria}
                  onChange={setCategoria}
                  placeholder="Seleccionar..."
                />
              </Col>
              <Col xs={12} md={6}>
                <label className="form-label">
                  Localidad
                  <RequiredMark />
                </label>
                <Select
                  options={localidades}
                  classNamePrefix="react-select"
                  value={localidad}
                  onChange={setLocalidad}
                  placeholder="Seleccionar..."
                />
              </Col>
            </Row>

            <div className="mb-2">
              <label className="form-label">
                Descripción de la(s) imagen(es)
                <RequiredMark />
              </label>
              <textarea
                className="form-control rounded-4"
                rows="1"
                placeholder="Describe lo que se ve en la foto"
                value={descripcionImagen}
                onChange={(e) => setDescripcionImagen(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="form-label">
                ¿Por qué recomiendas este lugar?
                <RequiredMark />
              </label>
              <textarea
                className="form-control rounded-4"
                rows="3"
                placeholder="Cuéntanos tu experiencia"
                value={recomendacion}
                onChange={(e) => setRecomendacion(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Tips de fotografía (opcional) <FaInfoCircle className="me-2" />
              </label>
              <textarea
                className="form-control rounded-4"
                rows="1"
                placeholder="Hora ideal, lente, ángulo, etc."
                value={tipsFoto}
                onChange={(e) => setTipsFoto(e.target.value)}
              />
            </div>
          </Col>
        </Row>

        <div className="botones-contenedor justify-content-between mt-3">
          <BackButton />
          <button
            type="button"
            className="btn-preview-modern rounded-pill px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            <FaEye />
            Previsualizar Spot
          </button>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Crear publicación</Tooltip>}
          >
            <button className="btn-primary-custom rounded-pill px-5 py-2">
              <FaPaperPlane className="me-2" /> Publicart
            </button>
          </OverlayTrigger>
        </div>

        {/* Modal de previsualización estilo SpotPage */}
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="xl"
          centered
          className="modal-preview-spot"
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold">
              Previsualización del Spot
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-2">
            <div className="lugar-content-wrapper">
              {/* Imagen principal */}
              <div className="lugar-imagen-principal">
                {previews.length > 0 ? (
                  <img src={previews[0]} alt={nombreLugar || "Preview"} />
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light" style={{ height: "100%", minHeight: "300px" }}>
                    <span className="text-muted">Sube una imagen para ver la previsualización</span>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className="lugar-info-container">
                <h1 className="lugar-nombre">
                  {nombreLugar || "Nombre del lugar"}
                </h1>
                <p className="lugar-direccion">
                  <FaMapMarkerAlt className="location-icon" />
                  {direccion || "Dirección del lugar"}
                </p>

                <div className="lugar-badges">
                  <span className="badge-categoria">
                    <FaTag className="category-icon" />
                    {categoria?.label || "Categoría"}
                  </span>
                  {localidad && (
                    <span className="badge-localidad ms-2">
                      <FaMapMarkerAlt className="category-icon" />
                      {localidad.label}
                    </span>
                  )}
                  <div className="lugar-rating-badge">
                    <FaStar className="star-icon" />
                    <span className="rating-text">0.0</span>
                    <span className="reviews-text">(0 reseñas)</span>
                  </div>
                </div>

                <div className="lugar-acciones">
                  <button className="btn-ver-mapa">
                    <FaMap className="btn-icon" />
                    Ver en mapa
                  </button>
                  <button className="btn-galeria">
                    <FaImages className="btn-icon" />
                    Galería
                  </button>
                </div>

                {/* Descripción / Sobre este lugar */}
                <div className="lugar-descripcion">
                  <h3>
                    <FaInfoCircle className="section-icon" />
                    Sobre este lugar
                  </h3>
                  <p>{descripcionImagen || "Descripción del lugar..."}</p>
                </div>

                {/* Recomendación del usuario */}
                {recomendacion && (
                  <div className="lugar-recomendacion mt-3">
                    <h3>
                      <FaHeart className="section-icon" />
                      ¿Por qué recomendarlo?
                    </h3>
                    <p>{recomendacion}</p>
                  </div>
                )}

                {/* Tips de fotografía */}
                {tipsFoto && (
                  <div className="lugar-tips mt-3">
                    <h3>
                      <FaCamera className="section-icon" />
                      Tips de fotografía
                    </h3>
                    <p>{tipsFoto}</p>
                  </div>
                )}
              </div>

              {/* Sección de Reseñas */}
              <div className="resenas-container">
                <h2 className="resenas-titulo">
                  <FaComments className="section-icon" />
                  Reseñas
                </h2>

                {/* Mensaje cuando no hay reseñas */}
                <div className="no-resenas">
                  <FaComments className="no-resenas-icon" />
                  <p>Aún no hay reseñas para este lugar.</p>
                  <p className="text-muted">¡Sé el primero en compartir tu experiencia!</p>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
