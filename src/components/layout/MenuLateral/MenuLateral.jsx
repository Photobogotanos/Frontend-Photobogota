import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import SidebarHeader from "./SidebarHeader";
import SidebarProfile from "./SidebarProfile";
import SidebarLink from "./SidebarLink";
import MenuItems from "./MenuItems";
import "./MenuLateral.css";
import { obtenerSesion } from "@/utils/sessionHelper";

export default function MenuLateral({ mostrar, cerrar, cerrarSesion }) {
  const [usuario, setUsuario] = useState(null);

  const handleShow = () => {
    const datosUsuario = obtenerSesion();
    if (datosUsuario) {
      setUsuario(datosUsuario);
    } else {
      setUsuario({
        nombre: "Usuario Demo",
        username: "@usuario_demo",
        rol: "MIEMBRO",
      });
    }
  };

  // Normalizar rol a mayúsculas para comparaciones consistentes
  const rol = (usuario?.rol || "MIEMBRO").toUpperCase();

  return (
    <Offcanvas
      show={mostrar}
      onHide={cerrar}
      onShow={handleShow}
      placement="start"
      className="sidebar-moderna"
    >
      <SidebarHeader />

      <Offcanvas.Body className="p-0 d-flex flex-column">
        <nav className="sidebar-nav">
          <div className="nav-items-top">
            <MenuItems rol={rol} cerrar={cerrar} />
          </div>

          <div className="sidebar-bottom-section">
            <SidebarProfile usuario={usuario} />
            <SidebarLink
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