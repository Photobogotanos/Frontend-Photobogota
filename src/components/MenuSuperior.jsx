import { useState, useEffect } from "react";
import { Container, Nav, Navbar, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaBell, FaPlus } from "react-icons/fa";
import MenuLateral from "./MenuLateral";
import "./MenuSuperior.css";
import logo from "../assets/images/logo.png";

export default function MenuSuperior() {
  const [logueado, setLogueado] = useState(false);
  const [mostrarSidebar, setMostrarSidebar] = useState(false);
  const [notificaciones] = useState(3);
  const navegar = useNavigate();

  useEffect(() => {
    const verificarLogin = () => {
      const estadoLogin = localStorage.getItem("logueado") === "true";
      setLogueado(estadoLogin);
    };

    verificarLogin();
    window.addEventListener("storage", verificarLogin);

    return () => {
      window.removeEventListener("storage", verificarLogin);
    };
  }, []);

  const abrirSidebar = () => setMostrarSidebar(true);
  const cerrarSidebar = () => setMostrarSidebar(false);

  const manejarCerrarSesion = () => {
    localStorage.removeItem("logueado");
    localStorage.removeItem("usuario");
    setLogueado(false);
    setMostrarSidebar(false);
    navegar("/");
  };

  return (
    <>
      <Navbar expand="lg" fixed="top" className="navbar-custom shadow-sm py-2">
        <Container fluid className="menu-container px-4">
          {logueado && (
            <button
              onClick={abrirSidebar}
              className="hamburger-btn p-0 me-3"
            >
              <FaBars />
            </button>
          )}

          <Navbar.Brand 
            as={Link} 
            to={logueado ? "/comunidad" : "/"}
            className="brand-wrapper d-flex align-items-center"
          >
            <Image src={logo} alt="Logo PhotoBogotá" className="brand-logo" />
            <span className="brand-title ms-2">Photo Bogotá</span>
          </Navbar.Brand>

          {!logueado ? (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto menu-links">
                  <Nav.Link as={Link} to="/solicitud-socio">
                    ¿Quieres ser socio?
                  </Nav.Link>
                  <Nav.Link as={Link} to="/nosotros">
                    Quiénes somos
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login" className="inicio-sesion">
                    Iniciar Sesión
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            <div className="d-flex align-items-center ms-auto acciones-usuario">
              <Button
                as={Link}
                to="/crear-publicacion"
                className="btn-crear-publicacion me-3"
              >
                <FaPlus className="me-2" /> 
                <span className="texto-completo">Crear Publicación</span>
                <span className="texto-corto">Crear</span>
              </Button>
              
              <button 
                className="btn-notificaciones position-relative"
                as={Link}
                to="/notificaciones"
              >
                <FaBell />
                {notificaciones > 0 && (
                  <span className="badge-notificaciones">{notificaciones}</span>
                )}
              </button>
            </div>
          )}
        </Container>
      </Navbar>

      <MenuLateral 
        mostrar={mostrarSidebar}
        cerrar={cerrarSidebar}
        cerrarSesion={manejarCerrarSesion}
      />
    </>
  );
}