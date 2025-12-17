import { useState, useEffect } from "react";
import { Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaHandshake,
  FaStore,
  FaBullhorn,
  FaChartBar,
  FaTachometerAlt,
  FaFileAlt,
  FaUserCheck,
  FaTags,
  FaUserPlus,
  FaCreditCard,
  FaCog,
  FaBell,
} from "react-icons/fa";
import "./MenuLateral.css";

export default function MenuLateral({ mostrar, cerrar, cerrarSesion }) {
  const [usuario, setUsuario] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (mostrar) {
      const datosUsuario = localStorage.getItem("miembro");
      if (datosUsuario) {
        setUsuario(JSON.parse(datosUsuario));
      } else {
        setUsuario({
          nombre: "Usuario Demo",
          username: "@usuario_demo",
          rol: "miembro",
        });
      }
    }
  }, [mostrar]);

  const rol = usuario?.rol || 'miembro';

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
            {rol === "socio" && (
              <>
                <MenuLateralLink
                  icon={<FaStore />}
                  texto="Locales"
                  to="/locales"
                  onClick={cerrar}
                  activo={esRutaActiva("/locales")}
                />
                <MenuLateralLink
                  icon={<FaBullhorn />}
                  texto="Promociones"
                  to="/promociones"
                  onClick={cerrar}
                  activo={esRutaActiva("/promociones")}
                />
                <MenuLateralLink
                  icon={<FaChartBar />}
                  texto="Estadísticas"
                  to="/estadisticas"
                  onClick={cerrar}
                  activo={esRutaActiva("/estadisticas")}
                />
              </>
            )}
            {rol === "moderador" && (
              <>
                <MenuLateralLink
                  icon={<FaTachometerAlt />}
                  texto="Dashboard Reportes"
                  to="/dashboard-reportes"
                  onClick={cerrar}
                  activo={esRutaActiva("/dashboard-reportes")}
                />
                <MenuLateralLink
                  icon={<FaFileAlt />}
                  texto="Solicitudes de Socios"
                  to="/solicitudes-socios"
                  onClick={cerrar}
                  activo={esRutaActiva("/solicitudes-socios")}
                />
                <MenuLateralLink
                  icon={<FaFileAlt />}
                  texto="Gestionar Reportes"
                  to="/gestionar-reportes"
                  onClick={cerrar}
                  activo={esRutaActiva("/gestionar-reportes")}
                />
                <MenuLateralLink
                  icon={<FaUserCheck />}
                  texto="Cambiar Rol Miembro a Socio"
                  to="/cambiar-rol"
                  onClick={cerrar}
                  activo={esRutaActiva("/cambiar-rol")}
                />
                <MenuLateralLink
                  icon={<FaTags />}
                  texto="Categorías de Establecimiento"
                  to="/categorias"
                  onClick={cerrar}
                  activo={esRutaActiva("/categorias")}
                />
              </>
            )}
            {rol === "administrador" && (
              <>
                <MenuLateralLink
                  icon={<FaTachometerAlt />}
                  texto="Dashboard"
                  to="/admin-dashboard"
                  onClick={cerrar}
                  activo={esRutaActiva("/admin-dashboard")}
                />
                <MenuLateralLink
                  icon={<FaFileAlt />}
                  texto="Generar Reportes del Sistema"
                  to="/generar-reportes"
                  onClick={cerrar}
                  activo={esRutaActiva("/generar-reportes")}
                />
                <MenuLateralLink
                  icon={<FaFileAlt />}
                  texto="Reportes Escalados"
                  to="/reportes-escalados"
                  onClick={cerrar}
                  activo={esRutaActiva("/reportes-escalados")}
                />
                <MenuLateralLink
                  icon={<FaUserPlus />}
                  texto="Crear Cuentas"
                  to="/crear-cuentas"
                  onClick={cerrar}
                  activo={esRutaActiva("/crear-cuentas")}
                />
                <MenuLateralLink
                  icon={<FaCreditCard />}
                  texto="Gestión Pago Socios"
                  to="/gestion-pagos"
                  onClick={cerrar}
                  activo={esRutaActiva("/gestion-pagos")}
                />
                <MenuLateralLink
                  icon={<FaCog />}
                  texto="Configurar Parámetros"
                  to="/configurar-parametros"
                  onClick={cerrar}
                  activo={esRutaActiva("/configurar-parametros")}
                />
                <MenuLateralLink
                  icon={<FaBell />}
                  texto="Notificaciones de Mantenimiento"
                  to="/notificaciones-mantenimiento"
                  onClick={cerrar}
                  activo={esRutaActiva("/notificaciones-mantenimiento")}
                />
              </>
            )}
          </div>

          {/* Sección inferior con perfil y logout */}
          <div className="sidebar-bottom-section">
            {rol === "usuario" && (
              <MenuLateralLink
                icon={<FaHandshake />}
                texto="¿Quieres ser socio?"
                to="/solicitud-socio"
                onClick={cerrar}
                activo={esRutaActiva("/solicitud-socio")}
              />
            )}
            <div className="sidebar-profile">
              <div className="profile-avatar">
                {usuario?.nombre?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="profile-info">
                <div className="profile-name">
                  {usuario?.nombre || "Usuario"}
                </div>
                <div className="profile-username">
                  {usuario?.username || "@usuario"}
                </div>
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
  activo = false,
}) {
  const clases = `sidebar-link ${className} ${activo ? "active" : ""} ${
    esBotonCrear ? "btn-add-post" : ""
  }`;

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
