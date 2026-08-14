import Modal from "react-bootstrap/Modal";
import { FaTimes } from "react-icons/fa";

export default function ImageModal({ show, onHide, imgSrc, titulo }) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      dialogClassName="inicio-image-modal"
      contentClassName="inicio-image-modal-content"
      backdropClassName="inicio-modal-backdrop"
    >
      {/* Botón de cerrar por fuera del body para fijarlo de forma estable al modal */}
      <button
        type="button"
        className="inicio-modal-close"
        onClick={onHide}
        aria-label="Cerrar modal"
      >
        <FaTimes />
      </button>

      <Modal.Body className="inicio-image-modal-body">
        {imgSrc ? (
          <div className="inicio-modal-img-wrapper">
            <img
              src={imgSrc}
              alt={titulo || "Vista previa de la foto"}
              className="inicio-modal-image"
              decoding="async"
              onContextMenu={(e) => e.preventDefault()}
              draggable={false}
            />
            {/* Protege la foto abierta en pantalla completa */}
            <div className="card-inspo-protect" aria-hidden="true" />

            <span
              className="card-inspo-credits"
              style={{ bottom: "16px", top: "auto" }}
            >
              Foto por Sebastián Sotomayor
            </span>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
}
