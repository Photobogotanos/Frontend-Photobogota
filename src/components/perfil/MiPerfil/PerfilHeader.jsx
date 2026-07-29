import { FiEdit3, FiBell } from "react-icons/fi";
import { FaUser, FaCrown, FaUserShield, FaStore } from "react-icons/fa";
import { Link } from "react-router-dom";

const BadgeRol = ({ rol }) => {
  const getBadgeConfig = () => {
    switch (rol) {
      case "ADMIN":
        return { clase: "badge-admin", icono: <FaCrown />, texto: "Admin" };
      case "MOD":
        return {
          clase: "badge-mod",
          icono: <FaUserShield />,
          texto: "Moderador",
        };
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

const PerfilHeader = ({
  perfilData,
  dispatch,
  rol = "MIEMBRO",
  nivel = null,
  usandoMock = false,
}) => {
  const mostrarNivel =
    rol === "MIEMBRO" && nivel !== null && nivel !== undefined;

  return (
    <div className="perfil-header">
      <img
        src={perfilData.fotoPerfil || "/images/user-pfp/default-avatar.jpg"}
        alt="Foto perfil"
        className="perfil-avatar"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/images/user-pfp/default-avatar.jpg";
        }}
        onClick={() =>
          dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true })
        }
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true });
        }}
        style={{ cursor: "pointer" }}
        tabIndex={0}
        role="button"
        aria-label="Ver foto de perfil"
      />

      <div className="perfil-info">
        <div className="perfil-badges">
          <BadgeRol rol={rol} />
          {mostrarNivel && <span className="badge-nivel">Nivel {nivel}</span>}
          {usandoMock && <span className="badge-demo">Demo</span>}
        </div>

        <h2 className="perfil-nombre">
          {perfilData.nombresCompletos || "Usuario"}
        </h2>
        <p className="perfil-username">
          @{perfilData.nombreUsuario || "usuario"}
        </p>
        <p className="perfil-descripcion">
          {perfilData.biografia || "Sin descripción"}
        </p>
      </div>

      <div className="perfil-edit-wrapper">
        <button
          className="btn-editar-perfil"
          onClick={() =>
            dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: true })
          }
        >
          <FiEdit3 size={18} /> Editar perfil
        </button>

        {/* Botón que redirige a Preferencias de Notificaciones */}
        <Link
          to="/perfil/preferencias-notificaciones"
          className="btn-notificaciones"
          title="Configurar notificaciones"
        >
          <FiBell size={18} /> Notificaciones
        </Link>
      </div>
    </div>
  );
};

export default PerfilHeader;
