import { Modal } from "react-bootstrap";
import { FaBell } from "react-icons/fa";
import PreferenciasNotificaciones from "./PreferenciasNotificaciones";
import "./PreferenciasNotificacionesModal.css";

export default function PreferenciasNotificacionesModal({
  show,
  onHide,
  onGuardado,
}) {
  return (
    <Modal
      key={show ? "preferencias-notif-open" : "preferencias-notif-closed"}
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="preferencias-notif-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <div className="modal-title-custom">
          <span className="mh-icon-box">
            <FaBell />
          </span>
          Preferencias de Notificaciones
        </div>
      </Modal.Header>

      <Modal.Body className="preferencias-notif-modal-body">
        {show && (
          <PreferenciasNotificaciones
            enModal
            onCerrar={onHide}
            onGuardado={onGuardado}
          />
        )}
      </Modal.Body>
    </Modal>
  );
}
