import { Modal } from "react-bootstrap";
import "./FotoPerfilModal.css";

export default function FotoPerfilModal({ show, onHide, foto, nombre }) {
  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      centered 
      className="foto-perfil-modal"
      backdrop="static"       
      keyboard={true}
    >
      <Modal.Body
        className="foto-perfil-modal-body"
        onClick={onHide}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onHide();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="foto-perfil-container-modal" onClick={(e) => e.stopPropagation()}>
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