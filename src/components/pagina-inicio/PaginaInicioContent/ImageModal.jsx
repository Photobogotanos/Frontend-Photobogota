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
      <Modal.Body className="inicio-image-modal-body">
        <button
          type="button"
          className="inicio-modal-close"
          onClick={onHide}
          aria-label="Cerrar modal"
        >
          <FaTimes />
        </button>

        {imgSrc ? (
          <img
            src={imgSrc}
            alt={titulo || "Vista previa de la foto"}
            className="inicio-modal-image"
            decoding="async"
          />
        ) : null}
      </Modal.Body>
    </Modal>
  );
}
