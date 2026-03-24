import Modal from "react-bootstrap/Modal";
import { FaTimes } from "react-icons/fa";

export default function ImageModal({ show, onHide, imgSrc, titulo }) {
  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="custom-modal">
      <Modal.Body className="p-0 position-relative">
        <button className="modal-close-btn" onClick={onHide} aria-label="Cerrar modal">
          <FaTimes />
        </button>
        {titulo && (
          <div className="modal-title p-3">
            <h4 className="mb-0">{titulo}</h4>
          </div>
        )}
        <div className="modal-image-container">
          <img src={imgSrc} alt="Vista previa" className="modal-image" />
        </div>
      </Modal.Body>
    </Modal>
  );
}