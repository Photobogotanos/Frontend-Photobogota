import { FiEdit3 } from "react-icons/fi";
import { FaUser, FaCrown, FaUserShield, FaStore } from "react-icons/fa";

// Componente BadgeRol definido dentro del mismo archivo
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

const PerfilHeader = ({ perfilData, dispatch, rol = "MIEMBRO", nivel = null, usandoMock = false }) => {
  const mostrarNivel = rol === "MIEMBRO" && nivel !== null && nivel !== undefined;
  
  return (
    <div className="perfil-header">
      <img
        src={perfilData.fotoPerfil || "/images/user-pfp/default-avatar.jpg"}
        alt="Foto perfil"
        className="perfil-avatar"
        onClick={() => dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true })}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true });
        }}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label="Cambiar foto de perfil"
      />

      <div className="perfil-info">
        <div className="perfil-badges">
          <BadgeRol rol={rol} />
          {mostrarNivel && <span className="badge-nivel">Nivel: {nivel}</span>}
        </div>

        <h3 className="perfil-nombre">{perfilData.nombresCompletos || "Usuario"}</h3>
        <p className="perfil-username">@{perfilData.nombreUsuario || "usuario"}</p>
        <p className="perfil-descripcion">{perfilData.biografia || "Sin descripción"}</p>
      </div>

      <div className="perfil-edit-wrapper">
        <button
          className="btn-editar-perfil"
          onClick={() => dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: true })}
        >
          <FiEdit3 size={18} /> Editar perfil
        </button>
      </div>
    </div>
  );
};

export default PerfilHeader;