import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./LugarPreviewModal.css";

const LugarPreviewModal = ({ show, onHide, lugar }) => {
  const navigate = useNavigate();

  const handleIr = () => {
    onHide();
    navigate(`/lugar/${lugar.id}`);
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
          <p className="preview-ubicacion">{lugar.direccion}</p>
          <div className="preview-rating">
            <span className="star">⭐</span>
            <span className="rating-number">{lugar.rating}</span>
            <span className="reviews-count">
              ({lugar.totalResenas} reseñas)
            </span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleIr}>
          Ir al lugar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LugarPreviewModal;
