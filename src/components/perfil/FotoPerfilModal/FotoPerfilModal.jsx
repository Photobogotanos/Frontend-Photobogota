import { Modal } from "react-bootstrap";
import "./FotoPerfilModal.css";

export default function FotoPerfilModal({ show, onHide, foto, nombre }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="foto-perfil-modal"
      backdrop={true}
      keyboard={true}
    >
      <Modal.Body
        className="foto-perfil-modal-body"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onHide();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onHide();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div
          className="foto-perfil-container-modal"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          role="presentation"
        >
          <button
            type="button"
            className="foto-perfil-close-btn"
            onClick={onHide}
            aria-label="Cerrar foto de perfil"
          >
            ×
          </button>
          <img
            src={foto}
            alt={`Foto de perfil de ${nombre}`}
            className="foto-perfil-ampliada"
          />
        </div>
      </Modal.Body>
    </Modal>
  );
}