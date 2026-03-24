import Modal from "react-bootstrap/Modal";
import { motion } from "framer-motion";
import { FaLock, FaCamera, FaStar, FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function LoginPromptModal({ show, onHide }) {
  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Header closeButton>
        <h4>Contenido exclusivo</h4>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center py-3">

          <div className="mb-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <FaLock size={48} className="icono-demo-modal mb-3" />
            </motion.div>
            <h5>¡Desbloquea todas las funcionalidades!</h5>
          </div>

          <p className="mb-4">Al registrarte en PhotoBogotá podrás:</p>

          <ul className="apple-list mb-4">
            <li><FaCamera /> Fotos detalladas de cada lugar</li>
            <li><FaStar />   Reseñas completas de otros usuarios</li>
            <li><FaHeart />  Guarda tus spots favoritos</li>
            <li><FaPlus />   Agrega nuevos lugares a la comunidad</li>
          </ul>

          <div className="d-grid gap-2">
            <button
              className="button-register-modal-demo"
              onClick={() => navigate("/creacion-cuenta")}
            >
              Regístrate Gratis
            </button>
            <button
              className="button-login-modal-demo"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </button>
          </div>

        </div>
      </Modal.Body>
    </Modal>
  );
}