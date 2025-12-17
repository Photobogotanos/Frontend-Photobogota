import { Link } from "react-router-dom";
import "./SidebarLink.css";

export default function SidebarLink({
  icon,
  texto,
  to,
  onClick,
  esBoton = false,
  className = "",
  activo = false,
}) {
  const clases = `sidebar-link ${className} ${activo ? "active" : ""}`;

  if (esBoton) {
    return (
      <button onClick={onClick} className={clases}>
        <span className="sidebar-link-icon">{icon}</span>
        <span className="sidebar-link-text">{texto}</span>
      </button>
    );
  }

  return (
    <Link to={to} onClick={onClick} className={clases}>
      <span className="sidebar-link-icon">{icon}</span>
      <span className="sidebar-link-text">{texto}</span>
    </Link>
  );
}