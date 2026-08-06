import { useMemo, useState } from "react";
import { Modal } from "react-bootstrap";
import {
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaMapMarkerAlt,
  FaTag,
  FaStar,
  FaHeart,
  FaCamera,
  FaImages,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";
import GaleriaSpot from "./GaleriaSpot";

const normalizarImagenes = (spot) => {
  const fuentes = [];

  const agregarImagen = (valor, fallbackAlt) => {
    if (!valor) return;

    if (typeof valor === "string") {
      fuentes.push({ src: valor, alt: fallbackAlt });
      return;
    }

    if (typeof valor === "object") {
      const src = valor.url || valor.src || valor.imagen || valor.href;
      if (src) {
        fuentes.push({ src, alt: valor.alt || fallbackAlt });
      }
    }
  };

  if (Array.isArray(spot?.imagenes)) {
    spot.imagenes.forEach((imagen) => agregarImagen(imagen, spot?.nombre));
  }

  if (Array.isArray(spot?.fotos)) {
    spot.fotos.forEach((imagen) => agregarImagen(imagen, spot?.nombre));
  }

  agregarImagen(spot?.imagen, spot?.nombre);

  return fuentes.filter(
    (imagen, index, self) =>
      index === self.findIndex((item) => item.src === imagen.src),
  );
};

const SpotInfo = ({
  spot,
  esGuardado,
  guardandoSpot,
  handleGuardarSpot,
  abrirReporteSpot,
}) => {
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);

  const imagenes = useMemo(() => normalizarImagenes(spot), [spot]);

  const abrirImagen = (index) => {
    if (imagenes.length === 0) return;
    setImagenActiva(index);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);
  const irAImagenAnterior = () => {
    setImagenActiva((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };
  const irAImagenSiguiente = () => {
    setImagenActiva((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <GaleriaSpot
        imagenes={imagenes}
        spotNombre={spot.nombre}
        spotDireccion={spot.direccion}
        onAbrirImagen={abrirImagen}
      />

      {imagenes.length > 0 && (
        <Modal
          show={modalAbierto}
          onHide={cerrarModal}
          centered
          size="xl"
          dialogClassName="spot-image-modal"
        >
          <Modal.Body className="spot-image-modal-body">
            <button
              type="button"
              className="spot-image-modal-close"
              onClick={cerrarModal}
              aria-label="Cerrar vista ampliada"
            >
              <FaTimes />
            </button>

            <div className="spot-image-modal-view">
              {imagenes.length > 1 && (
                <button
                  type="button"
                  className="spot-image-modal-nav"
                  onClick={irAImagenAnterior}
                  aria-label="Ver imagen anterior"
                >
                  <FaChevronLeft />
                </button>
              )}

              <img
                src={imagenes[imagenActiva]?.src}
                alt={imagenes[imagenActiva]?.alt || spot.nombre}
              />

              {imagenes.length > 1 && (
                <button
                  type="button"
                  className="spot-image-modal-nav"
                  onClick={irAImagenSiguiente}
                  aria-label="Ver imagen siguiente"
                >
                  <FaChevronRight />
                </button>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="spot-image-modal-thumbs">
                {imagenes.map((imagen, index) => (
                  <button
                    key={`thumb-${imagen.src}`}
                    type="button"
                    className={`spot-image-thumb-btn ${index === imagenActiva ? "active" : ""}`}
                    onClick={() => setImagenActiva(index)}
                  >
                    <img src={imagen.src} alt={imagen.alt} />
                  </button>
                ))}
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}

      <div className="lugar-info-container">
        <div className="lugar-info-inner">
          <div className="lugar-nombre-fila">
            <h1 className="lugar-nombre">{spot.nombre}</h1>
            <div className="lugar-acciones-header">
              <button
                type="button"
                className={`btn-guardar-spot-detalle ${esGuardado ? "guardado" : ""}`}
                onClick={handleGuardarSpot}
                aria-label={esGuardado ? "Quitar de guardados" : "Guardar spot"}
                disabled={guardandoSpot}
              >
                {esGuardado ? <FaBookmark /> : <FaRegBookmark />}
                {esGuardado ? "Guardado" : "Guardar"}
              </button>
              <button
                type="button"
                className="btn-reportar-spot"
                onClick={abrirReporteSpot}
              >
                <FaFlag className="btn-icon" />
                Reportar
              </button>
            </div>
          </div>

          {imagenes.length > 1 && (
            <div className="lugar-galeria-tira">
              <h3 className="lugar-galeria-tira-titulo">
                <FaImages className="lugar-galeria-tira-icon" /> Fotos del spot
              </h3>
              <div className="lugar-galeria-tira-scroll">
                {imagenes.map((imagen, index) => (
                  <button
                    key={`tira-${imagen.src}`}
                    type="button"
                    className={`lugar-galeria-tira-thumb ${index === imagenActiva ? "activa" : ""}`}
                    onClick={() => abrirImagen(index)}
                    aria-label={`Ver foto ${index + 1} de ${imagenes.length}`}
                  >
                    <img src={imagen.src} alt={imagen.alt} loading="lazy" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="lugar-direccion">
            <FaMapMarkerAlt className="location-icon" />
            {spot.direccion}
          </p>

          <div className="lugar-badges">
            {spot.categoria && (
              <span className="badge-categoria">
                <FaTag className="category-icon" />
                {spot.categoria}
              </span>
            )}
            {spot.localidad && (
              <span className="badge-localidad">
                <FaMapMarkerAlt className="category-icon" />
                {spot.localidad}
              </span>
            )}
            <div className="lugar-rating-badge">
              <FaStar className="star-icon" />
              <span className="rating-text">{spot.rating}</span>
              <span className="reviews-text">({spot.totalResenas} reseñas)</span>
            </div>
          </div>

          {spot.descripcion && (
            <div className="lugar-descripcion">
              <h3>
                <FaMapMarkerAlt className="section-icon" /> Descripción
              </h3>
              <p>{spot.descripcion}</p>
            </div>
          )}

          {spot.recomendacion && (
            <div className="lugar-recomendacion">
              <h3>
                <FaHeart className="section-icon" /> ¿Por qué recomendarlo?
              </h3>
              <p>{spot.recomendacion}</p>
            </div>
          )}

          {spot.tipsFoto && (
            <div className="lugar-tips">
              <h3>
                <FaCamera className="section-icon" /> Tips de fotografía
              </h3>
              <p>{spot.tipsFoto}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SpotInfo;
