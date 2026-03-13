import { Modal } from "react-bootstrap";
import "./FotoPerfilModal.css";

export default function FotoPerfilModal({ show, onHide, foto, nombre }) {
  return (
    <Modal show={show} onHide={onHide} centered className="foto-perfil-modal">
      <Modal.Body className="foto-perfil-modal-body">
        <div className="foto-perfil-container-modal">
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
