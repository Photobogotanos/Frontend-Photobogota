import Modal from "react-bootstrap/Modal";
import { LazyMotion, m, domAnimation } from "framer-motion";
import { FaLock, FaCamera, FaStar, FaHeart, FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BENEFICIOS = [
  { icon: FaCamera, text: "Fotos detalladas de cada lugar" },
  { icon: FaStar, text: "Reseñas completas de la comunidad" },
  { icon: FaHeart, text: "Guarda tus spots favoritos" },
  { icon: FaPlus, text: "Agrega nuevos lugares a la ciudad" },
];

export default function LoginPromptModal({ show, onHide }) {
  const navigate = useNavigate();

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      dialogClassName="login-prompt-modal"
      contentClassName="login-prompt-modal-content"
      backdropClassName="inicio-modal-backdrop"
    >
      <Modal.Body className="login-prompt-body">
        <button
          type="button"
          className="inicio-modal-close login-prompt-close"
          onClick={onHide}
          aria-label="Cerrar"
        >
          <FaTimes />
        </button>

        <div className="login-prompt-inner">
          <LazyMotion features={domAnimation}>
            <m.div
              className="login-prompt-icon-wrap"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaLock className="login-prompt-icon" />
            </m.div>
          </LazyMotion>

          <h3 className="login-prompt-title">Contenido exclusivo</h3>
          <p className="login-prompt-lead">
            Desbloquea todo PhotoBogotá y forma parte de la comunidad.
          </p>

          <ul className="login-prompt-list">
            {BENEFICIOS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="login-prompt-list-icon">
                  <Icon />
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div className="login-prompt-actions">
            <button
              type="button"
              className="btn-login-primary"
              onClick={() => navigate("/creacion-cuenta")}
            >
              Regístrate gratis
            </button>
            <button
              type="button"
              className="btn-login-ghost"
              onClick={() => navigate("/login")}
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
