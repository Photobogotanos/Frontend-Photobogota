import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaTag, FaStar, FaHeart, FaCamera } from "react-icons/fa";
import "./SpotPreviewModal.css";

const SpotPreviewModal = ({ show, onHide, lugar }) => {
  const navigate = useNavigate();

  const handleIr = () => {
    onHide();
    navigate(`/spot/${lugar.id}`);
  };

  if (!lugar) return null;

  return (
    <Modal show={show} onHide={onHide} centered className="lugar-preview-modal">
      <Modal.Body className="p-0">
        <div className="preview-image-container">
          <img
            src={lugar.imagen}
            alt={lugar.nombre}
            className="preview-image"
          />
        </div>
        <div className="preview-content">
          <h3 className="preview-title">{lugar.nombre}</h3>
          <p className="preview-ubicacion">
            <FaMapMarkerAlt className="preview-icon" />
            {lugar.direccion}
          </p>
          
          <div className="preview-badges">
            {lugar.categoria && (
              <span className="preview-badge-categoria">
                <FaTag className="preview-badge-icon" />
                {lugar.categoria}
              </span>
            )}
            {lugar.localidad && (
              <span className="preview-badge-localidad">
                <FaMapMarkerAlt className="preview-badge-icon" />
                {lugar.localidad}
              </span>
            )}
          </div>

          <div className="preview-rating">
            <FaStar className="preview-star" />
            <span className="rating-number">{lugar.rating}</span>
            <span className="reviews-count">
              ({lugar.totalResenas} reseñas)
            </span>
          </div>

          {lugar.descripcion && (
            <p className="preview-descripcion">{lugar.descripcion}</p>
          )}

          {lugar.recomendacion && (
            <div className="preview-recomendacion">
              <h5><FaHeart className="preview-section-icon" /> ¿Por qué recomendarlo?</h5>
              <p>{lugar.recomendacion}</p>
            </div>
          )}

          {lugar.tipsFoto && (
            <div className="preview-tips">
              <h5><FaCamera className="preview-section-icon" /> Tips de fotografía</h5>
              <p>{lugar.tipsFoto}</p>
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