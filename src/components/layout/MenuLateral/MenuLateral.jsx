import { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaPlus,
  FaSignOutAlt,
  FaHandshake
} from "react-icons/fa";
import "./MenuLateral.css";

export default function MenuLateral({ mostrar, cerrar, cerrarSesion }) {
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (mostrar) {
      const datosUsuario = localStorage.getItem("usuario");
      if (datosUsuario) {
        setUsuario(JSON.parse(datosUsuario));
      } else {
        setUsuario({
          nombre: "Usuario Demo",
          username: "@usuario_demo"
        });
      }
    }
  }, [mostrar]);

  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  return (
    <Offcanvas 
      show={mostrar} 
      onHide={cerrar}
      placement="start"
      className="sidebar-moderna"
    >
      <Offcanvas.Header closeButton className="sidebar-header">
        <Offcanvas.Title>Photo Bogotá</Offcanvas.Title>
      </Offcanvas.Header>
      
      <Offcanvas.Body className="p-0 d-flex flex-column">
        <nav className="sidebar-nav">
          <div className="nav-items-top">
            <MenuLateralLink 
              icon={<FaHome />} 
              texto="Comunidad" 
              to="/comunidad"
              onClick={cerrar}
              activo={esRutaActiva("/comunidad")}
            />
            <MenuLateralLink 
              icon={<FaMapMarkerAlt />} 
              texto="Mapa" 
              to="/mapa"
              onClick={cerrar}
              activo={esRutaActiva("/mapa")}
            />
            <MenuLateralLink 
              icon={<FaUser />} 
              texto="Mi Perfil" 
              to="/perfil"
              onClick={cerrar}
              activo={esRutaActiva("/perfil")}
            />
          </div>

          {/* Sección inferior con perfil y logout */}
          <div className="sidebar-bottom-section">
            <MenuLateralLink
              icon={<FaHandshake />}
              texto="¿Quieres ser socio?"
              to="/solicitud-socio"
              onClick={cerrar}
              activo={esRutaActiva("/solicitud-socio")}
            />
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="profile-info">
                <div className="profile-name">{usuario?.nombre || "Usuario"}</div>
                <div className="profile-username">{usuario?.username || "@usuario"}</div>
              </div>
            </div>

            <MenuLateralLink 
              icon={<FaSignOutAlt />} 
              texto="Cerrar Sesión" 
              onClick={cerrarSesion}
              esBoton={true}
              className="sidebar-logout"
            />
          </div>
        </nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

function MenuLateralLink({ 
  icon, 
  texto, 
  to, 
  onClick, 
  esBoton = false, 
  esBotonCrear = false, 
  className = "", 
  activo = false 
}) {
  const clases = `sidebar-link ${className} ${activo ? 'active' : ''} ${esBotonCrear ? 'btn-add-post' : ''}`;

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