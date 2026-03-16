import { FaCamera } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";

const PerfilHeader = ({ perfilData, dispatch }) => {
  return (
    <>
      {/* FOTO + INFO DEL USUARIO */}
      <div className="perfil-header">
        <img
          src={perfilData.foto}
          alt="Foto perfil"
          className="perfil-avatar"
          onClick={() => dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true })}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ")
              dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true });
          }}
          tabIndex={0}
          style={{ cursor: "pointer" }}
          aria-label="Cambiar foto de perfil"
        />

        <div className="perfil-info">
          <div className="perfil-badges">
            <span className="badge-miembro">
              <FaCamera /> Miembro
            </span>
            <span className="badge-nivel">Nivel: 320</span>
          </div>

          <h3 className="perfil-nombre">{perfilData.nombreCompleto}</h3>
          <p className="perfil-username">@{perfilData.nombreUsuario}</p>
          <p className="perfil-descripcion">{perfilData.descripcion}</p>
        </div>
      </div>

      {/* BOTÓN EDITAR PERFIL */}
      <div className="perfil-edit-wrapper">
        <button
          className="btn-editar-perfil"
          onClick={() => dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: true })}
        >
          <FiEdit3 size={18} /> Editar perfil
        </button>
      </div>
    </>
  );
};

export default PerfilHeader;