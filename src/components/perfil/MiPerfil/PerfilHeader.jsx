import { FiEdit3, FiBell, FiFlag } from "react-icons/fi";
import { FaUser, FaCrown, FaUserShield, FaStore } from "react-icons/fa";
import UserAvatar from "@/components/common/UserAvatar/UserAvatar";

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

const esFotoReal = (url) => {
  if (!url || typeof url !== "string") return false;
  const u = url.trim();
  if (!u) return false;
  if (u.includes("default-avatar")) return false;
  return true;
};

const PerfilHeader = ({
  perfilData,
  dispatch,
  rol = "MIEMBRO",
  nivel = null,
  usandoMock = false,
  esPerfilPropio = true,
  onReportar,
}) => {
  const mostrarNivel =
    rol === "MIEMBRO" && nivel !== null && nivel !== undefined;

  const fotoSrc = esFotoReal(perfilData?.fotoPerfil)
    ? perfilData.fotoPerfil
    : null;

  const abrirFoto = () => {
    if (fotoSrc) {
      dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: true });
    }
  };

  return (
    <div className="perfil-header">
      <UserAvatar
        src={fotoSrc}
        nombreUsuario={perfilData?.nombreUsuario}
        nombre={perfilData?.nombresCompletos}
        alt="Foto perfil"
        className="perfil-avatar"
        onClick={abrirFoto}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            abrirFoto();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={fotoSrc ? "Ver foto de perfil" : "Sin foto de perfil"}
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
        {esPerfilPropio ? (
          <>
            <button
              className="btn-editar-perfil"
              onClick={() =>
                dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: true })
              }
            >
              <FiEdit3 size={18} /> Editar perfil
            </button>

        <button
          type="button"
          className="btn-notificaciones"
          title="Configurar notificaciones"
          onClick={() =>
            dispatch({ type: "SET_MOSTRAR_NOTIFICACIONES", payload: true })
          }
        >
          <FiBell size={18} /> Notificaciones
        </button>
      </div>
    </div>
  );
};

export default PerfilHeader;
