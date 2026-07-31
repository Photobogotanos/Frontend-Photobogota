import UserAvatar from "@/components/common/UserAvatar/UserAvatar";
import "./SidebarProfile.css";

const esFotoReal = (url) => {
  if (!url || typeof url !== "string") return false;
  const u = url.trim();
  if (!u) return false;
  if (u.includes("default-avatar")) return false;
  return true;
};

export default function SidebarProfile({ usuario }) {
  const fotoSrc = esFotoReal(usuario?.fotoPerfil) ? usuario.fotoPerfil : null;

  const nombreUsuarioRaw =
    usuario?.nombreUsuario ||
    usuario?.username?.replace(/^@/, "") ||
    "";

  const nombre =
    usuario?.nombresCompletos ||
    usuario?.nombre ||
    "";

  const usernameDisplay =
    usuario?.username ||
    (nombreUsuarioRaw ? `@${nombreUsuarioRaw}` : "@usuario");

  return (
    <div className="sidebar-profile">
      <UserAvatar
        src={fotoSrc}
        nombreUsuario={nombreUsuarioRaw}
        nombre={nombre}
        alt="Avatar"
        className="profile-avatar"
      />
      <div className="profile-info">
        <div className="profile-name">
          {usuario?.nombre || nombre || nombreUsuarioRaw || "Usuario"}
        </div>
        <div className="profile-username">{usernameDisplay}</div>
      </div>
    </div>
  );
}
