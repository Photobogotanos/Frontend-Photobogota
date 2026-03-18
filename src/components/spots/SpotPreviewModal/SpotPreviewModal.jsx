import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTag, FaStar, FaHeart, FaCamera } from "react-icons/fa";
import "./SpotPreviewModal.css";

const SpotPreviewModal = ({ show, onHide, spotData, lugar }) => {
  const navigate = useNavigate();

  // Aceptar datos del spot desde spotData o lugar (compatibilidad hacia atrás)
  const data = spotData || lugar;

  const handleIr = () => {
    onHide();
    if (data?.id) {
      navigate(`/spot/${data.id}`);
    }
  };

  if (!data) return null;

  return (
    <Modal show={show} onHide={onHide} centered className="lugar-preview-modal">
      <Modal.Body className="p-0">
        <div className="preview-image-container">
          <img
            src={data.imagen}
            alt={data.nombre}
            className="preview-image"
          />
        </div>
        <div className="preview-content">
          <h3 className="preview-title">{data.nombre}</h3>
          <p className="preview-ubicacion">
            <FaMapMarkerAlt className="preview-icon" />
            {data.direccion}
          </p>
          
          <div className="preview-badges">
            {data.categoria && (
              <span className="preview-badge-categoria">
                <FaTag className="preview-badge-icon" />
                {data.categoria}
              </span>
            )}
            {data.localidad && (
              <span className="preview-badge-localidad">
                <FaMapMarkerAlt className="preview-badge-icon" />
                {data.localidad}
              </span>
            )}
          </div>

          <div className="preview-rating">
            <FaStar className="preview-star" />
            <span className="rating-number">{data.rating}</span>
            <span className="reviews-count">
              ({data.totalResenas} reseñas)
            </span>
          </div>

          {data.descripcion && (
            <p className="preview-descripcion">{data.descripcion}</p>
          )}

          {data.recomendacion && (
            <div className="preview-recomendacion">
              <h5><FaHeart className="preview-section-icon" /> ¿Por qué recomendarlo?</h5>
              <p>{data.recomendacion}</p>
            </div>
          )}

          {data.tipsFoto && (
            <div className="preview-tips">
              <h5><FaCamera className="preview-section-icon" /> Tips de fotografía</h5>
              <p>{data.tipsFoto}</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" className="btn-ir-spot" onClick={handleIr}>
          Ir al spot
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SpotPreviewModal;
