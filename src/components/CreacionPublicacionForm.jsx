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
} from "react-icons/fa";
import "./CreacionPublicacionForm.css";
import "./PublicacionFeed.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Modal from "react-bootstrap/Modal";

export default function CrearPublicacion() {
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

  // Datos para la previsualización (simulando PublicacionFeed)
  const publicacionPreview = {
    id: 1,
    usuario: "Tú",
    nombreUsuario: "@tunombre",
    avatar: "/images/user-pfp/default-avatar.jpg",
    tiempo: "Ahora",
    imagenes: previews,
    texto: recomendacion || "Cuéntanos por qué recomiendas este lugar...",
    meGustas: 0,
    comentarios: 0,
    meGustaDado: false,
    guardado: false,
  };

  const tieneVariasImagenes = previews.length > 1;

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
        <h4 className="titulo-crear-publicacion">Crear nueva publicación</h4>

        <Row className="g-4">
          {/* Formulario principal */}
          <Col xs={12}>
            {/* Upload de imagen */}
            <label className="form-label fw-medium">
              Foto del lugar <FaCamera className="me-2" />
              <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Campo obligatorio</Tooltip>}
              >
                <span className="text-danger"> *</span>
              </OverlayTrigger>
            </label>

            <div className="image-upload rounded-4 mb-3">
              {previews.length > 0 ? (
                <img
                  src={previews[0]}
                  alt="Preview primera"
                  className="img-preview"
                />
              ) : (
                <span className="text-muted">Previsualización de la imagen</span>
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
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Campo obligatorio</Tooltip>}
                  >
                    <span className="text-danger"> *</span>
                  </OverlayTrigger>
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
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Campo obligatorio</Tooltip>}
                  >
                    <span className="text-danger"> *</span>
                  </OverlayTrigger>
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
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Campo obligatorio</Tooltip>}
                  >
                    <span className="text-danger"> *</span>
                  </OverlayTrigger>
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
                  <OverlayTrigger
                    placement="right"
                    overlay={<Tooltip>Campo obligatorio</Tooltip>}
                  >
                    <span className="text-danger"> *</span>
                  </OverlayTrigger>
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
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span className="text-danger"> *</span>
                </OverlayTrigger>
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
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span className="text-danger"> *</span>
                </OverlayTrigger>
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

        {/* Botón publicar */}
        <div className="text-end mt-3">
          <button
            type="button"
            className="btn-preview-modern me-2 rounded-pill px-4 py-2"
            onClick={() => setShowModal(true)}
          >
            <FaEye />
            Previsualizar publicación
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


          

        {/* Modal de previsualización */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          size="lg" 
          centered
          className="modal-preview"
        >
          <Modal.Header closeButton className="modal-header-custom">
            <h2 className="modal-title-custom">Previsualización de la publicación</h2>
          </Modal.Header>
          <Modal.Body className="modal-body-custom">
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
              <div className="tarjeta-publicacion">
                {/* Header */}
                <div className="d-flex align-items-center mb-3">
                  <img
                    src="/images/user-pfp/default-avatar.jpg"
                    className="rounded-circle me-3"
                    width={45}
                    height={45}
                    alt="usuario"
                  />
                  <div className="flex-grow-1">
                    <strong className="d-block texto-usuario">Tú</strong>
                    <div className="texto-secundario">@tunombre · Ahora</div>
                  </div>
                  {nombreLugar && <span className="ms-auto insignia-popular">Popular 🔥</span>}
                </div>

                {/* Imagen */}
                {previews.length > 0 ? (
                  <div className="contenedor-imagen-feed mb-3">
                    <div className="carrusel-imagenes">
                      <img src={previews[indiceImagenActual]} alt="Preview" className="imagen-feed" />

                      {tieneVariasImagenes && (
                        <>
                          <button
                            className="boton-nav-carrusel izquierda"
                            onClick={imagenAnterior}
                            aria-label="Imagen anterior"
                          >
                            <FaChevronLeft />
                          </button>

                          <button
                            className="boton-nav-carrusel derecha"
                            onClick={imagenSiguiente}
                            aria-label="Imagen siguiente"
                          >
                            <FaChevronRight />
                          </button>

                          <div className="indicador-carrusel">
                            {indiceImagenActual + 1} / {previews.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="contenedor-imagen-feed mb-3 d-flex align-items-center justify-content-center bg-light">
                    <span className="text-muted">Sube una imagen para ver la previsualización</span>
                  </div>
                )}

                {/* Interacciones */}
                <div className="d-flex justify-content-between align-items-center my-3">
                  <div className="d-flex gap-4">
                    <button className="boton-interaccion">
                      <FaRegHeart />
                      <span className="ms-1 contador-interaccion">0</span>
                    </button>
                    <button className="boton-interaccion">
                      <FaCommentDots />
                      <span className="ms-1 contador-interaccion">0</span>
                    </button>
                    <button className="boton-interaccion">
                      <FaShare />
                    </button>
                  </div>
                  <button className="boton-interaccion boton-guardar">
                    <FaRegBookmark />
                  </button>
                </div>

                {/* Texto */}
                <p className="mb-2 texto-publicacion">
                  {recomendacion || "Aquí aparecerá tu recomendación..."}
                </p>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}