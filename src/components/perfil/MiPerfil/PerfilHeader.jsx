import { FaUser, FaCrown, FaUserShield, FaStore } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";

const BadgeRol = ({ rol }) => {
  const getBadgeConfig = () => {
    switch (rol) {
      case "ADMIN":
        return { clase: "badge-admin", icono: <FaCrown />, texto: "Admin" };
      case "MOD":
        return { clase: "badge-mod", icono: <FaUserShield />, texto: "Moderador" };
      case "SOCIO":
        return { clase: "badge-socio", icono: <FaStore />, texto: "Socio" };
      case "MIEMBRO":
      default:
        return { clase: "badge-miembro", icono: <FaUser />, texto: "Miembro" };
    }
  };

  const config = getBadgeConfig();

  return (
    <span className={`badge-rol ${config.clase}`}>
      {config.icono} {config.texto}
    </span>
  );
};

const PerfilHeader = ({ perfilData, dispatch, rol = "MIEMBRO" }) => {
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
            <BadgeRol rol={rol} />
            <span className="badge-nivel">Nivel: 320</span>
          </div>

          <h3 className="perfil-nombre">{perfilData.nombreCompleto}</h3>
          <p className="perfil-username">@{perfilData.nombreUsuario}</p>
          <p className="perfil-descripcion">{perfilData.descripcion}</p>
        </div>

        {/* BOTÓN EDITAR PERFIL - Lado derecho */}
        <div className="perfil-edit-wrapper">
          <button
            className="btn-editar-perfil"
            onClick={() => dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: true })}
          >
            <FiEdit3 size={18} /> Editar perfil
          </button>
        </div>
      </div>
    </>
  );
};

export default PerfilHeader;