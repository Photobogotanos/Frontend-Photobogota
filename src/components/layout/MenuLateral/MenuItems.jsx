import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaMapMarkerAlt,
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
import SidebarLink from "./SidebarLink";

export default function MenuItems({ rol, cerrar }) {
  const location = useLocation();

  const esRutaActiva = (ruta) => {
    return location.pathname === ruta;
  };

  return (
    <>
      {/* Menú común para todos */}
      <SidebarLink
        icon={<FaMapMarkerAlt />}
        texto="Mapa"
        to="/mapa"
        onClick={cerrar}
        activo={esRutaActiva("/mapa")}
      />
      <SidebarLink
        icon={<FaUser />}
        texto="Mi Perfil"
        to="/perfil"
        onClick={cerrar}
        activo={esRutaActiva("/perfil")}
      />

      {/* Menú para socios */}
      {rol === "SOCIO" && (
        <>
          <SidebarLink
            icon={<FaStore />}
            texto="Locales"
            to="/locales"
            onClick={cerrar}
            activo={esRutaActiva("/locales")}
          />
          <SidebarLink
            icon={<FaBullhorn />}
            texto="Promociones"
            to="/socio-promociones"
            onClick={cerrar}
            activo={esRutaActiva("/socio-promociones")}
          />
          <SidebarLink
            icon={<FaChartBar />}
            texto="Estadísticas"
            to="/estadisticas"
            onClick={cerrar}
            activo={esRutaActiva("/estadisticas")}
          />
        </>
      )}

      {/* Menú para moderadores */}
      {rol === "MOD" && (
        <>
          <SidebarLink
            icon={<FaTachometerAlt />}
            texto="Dashboard Reportes"
            to="/dashboard-reportes"
            onClick={cerrar}
            activo={esRutaActiva("/dashboard-reportes")}
          />
          <SidebarLink
            icon={<FaFileAlt />}
            texto="Revisar Solicitudes de Socios"
            to="/moderador/revision-solicitudes"
            onClick={cerrar}
            activo={esRutaActiva("/moderador/revision-solicitudes") || esRutaActiva("/solicitudes-socios")}
          />
          <SidebarLink
            icon={<FaFileAlt />}
            texto="Gestionar Reportes"
            to="/gestionar-reportes"
            onClick={cerrar}
            activo={esRutaActiva("/gestionar-reportes")}
          />
          <SidebarLink
            icon={<FaUserCheck />}
            texto="Cambiar Rol Miembro a Socio"
            to="/cambiar-rol"
            onClick={cerrar}
            activo={esRutaActiva("/cambiar-rol")}
          />
          <SidebarLink
            icon={<FaTags />}
            texto="Categorías de Establecimiento"
            to="/categorias"
            onClick={cerrar}
            activo={esRutaActiva("/categorias")}
          />
        </>
      )}

      {/* Menú para administradores */}
      {rol === "ADMIN" && (
        <>
          <SidebarLink
            icon={<FaTachometerAlt />}
            texto="Dashboard"
            to="/admin-dashboard"
            onClick={cerrar}
            activo={esRutaActiva("/admin-dashboard")}
          />
          <SidebarLink
            icon={<FaFileAlt />}
            texto="Generar Reportes del Sistema"
            to="/generar-reportes"
            onClick={cerrar}
            activo={esRutaActiva("/generar-reportes")}
          />
          <SidebarLink
            icon={<FaUserPlus />}
            texto="Crear Cuentas"
            to="/admin/usuarios"
            onClick={cerrar}
            activo={esRutaActiva("/admin/usuarios")}
          />
          <SidebarLink
            icon={<FaCreditCard />}
            texto="Gestión Pago Socios"
            to="/gestion-pagos"
            onClick={cerrar}
            activo={esRutaActiva("/gestion-pagos")}
          />
          <SidebarLink
            icon={<FaBell />}
            texto="Notificaciones de Mantenimiento"
            to="/notificaciones-mantenimiento"
            onClick={cerrar}
            activo={esRutaActiva("/notificaciones-mantenimiento")}
          />
          <SidebarLink
            icon={<FaFileAlt />}
            texto="Ver Logs"
            to="/admin/ver-logs"
            onClick={cerrar}
            activo={esRutaActiva("/admin/ver-logs")}
          />
        </>
      )}

      {/* Botón de solicitud de socio para miembros */}
      {rol === "MIEMBRO" && (
        <SidebarLink
          icon={<FaHandshake />}
          texto="Ser Socio"
          to="/solicitud-socio/formulario"
          onClick={cerrar}
          activo={esRutaActiva("/solicitud-socio/formulario") || esRutaActiva("/solicitud-socio")}
        />
      )}
    </>
  );
}
