import { FaUser, FaShieldAlt, FaUserSlash } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { Modal } from "react-bootstrap";

export default function PerfilModalHeader({
  esMiembro,
  tabActiva,
  onCambiarTab,
}) {
  return (
    <>
      <Modal.Header closeButton className="modal-header-custom">
        <div className="modal-title-custom">
          <span className="mh-icon-box">
            <FiEdit3 />
          </span>
          Editar perfil
        </div>
      </Modal.Header>

      <div className="modal-tabs-nav">
        <button
          type="button"
          className={`mtab ${tabActiva === "perfil" ? "active" : ""}`}
          onClick={() => onCambiarTab("perfil")}
        >
          <FaUser className="mtab-icon" />
          Perfil
        </button>
        <button
          type="button"
          className={`mtab ${tabActiva === "contrasena" ? "active" : ""}`}
          onClick={() => onCambiarTab("contrasena")}
        >
          <FaShieldAlt className="mtab-icon" />
          Contraseña
        </button>
        {esMiembro && (
          <button
            type="button"
            className={`mtab mtab-danger ${tabActiva === "eliminar" ? "active" : ""}`}
            onClick={() => onCambiarTab("eliminar")}
          >
            <FaUserSlash className="mtab-icon" />
            Eliminar cuenta
          </button>
        )}
      </div>
    </>
  );
}
