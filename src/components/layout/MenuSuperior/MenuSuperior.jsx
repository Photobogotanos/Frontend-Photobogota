import { useState, useEffect } from "react";
import { Container, Nav, Navbar, Image } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import MenuLateral from "@/components/layout/MenuLateral/MenuLateral";
import "./MenuSuperior.css";
import logo from "@/assets/images/logo.jpg";
import Notificaciones from "@/components/notificaciones/Notificaciones/Notificaciones";
import { estaLogueado, cerrarSesion } from "@/utils/sessionHelper";
import { resetEstadoServidor } from "@/utils/serverStatus";

export default function MenuSuperior() {
  const [logueado, setLogueado] = useState(false);
  const [mostrarSidebar, setMostrarSidebar] = useState(false);
  const [notificaciones] = useState(3);
  const [pulsando, setPulsando] = useState(false);
  const navegar = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verificarLogin = () => {
      setLogueado(estaLogueado()); // ← usa el helper en vez de leer localStorage directo
    };

    verificarLogin();

    const handleStorageChange = (e) => {
      if (e.key === "logueado" || e.key === null) {
        verificarLogin();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [location]);

  useEffect(() => {
    if (logueado) {
      const interval = setInterval(() => {
        setPulsando(true);
        setTimeout(() => setPulsando(false), 2000);
      }, 15000);

      return () => clearInterval(interval);
    }
  }, [logueado]);

  const abrirSidebar = () => setMostrarSidebar(true);
  const cerrarSidebar = () => setMostrarSidebar(false);

  const manejarCerrarSesion = () => {
    resetEstadoServidor(); // limpia el caché del servidor para que al volver a loguearse se reverifique
    cerrarSesion();        // elimina "logueado", "miembro", accessToken y refreshToken
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
              aria-label="Abrir menú lateral"
            >
              <FaBars />
            </button>
          )}

          <Navbar.Brand
            as={Link}
            to={logueado ? "/mapa" : "/"}
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
                  <Nav.Link as={Link} to="/solicitud-socio/formulario">
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
              <Link
                to="/crear-spot"
                className={`btn-crear-publicacion ${pulsando ? "pulsing" : ""}`}
                onMouseEnter={() => setPulsando(false)}
                aria-label="Crear nuevo spot"
              >
                <FaPlus />
                <span className="texto-completo">Crear Spot</span>
                <span className="texto-corto">Crear</span>
              </Link>

              <Notificaciones notificaciones={notificaciones} />
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