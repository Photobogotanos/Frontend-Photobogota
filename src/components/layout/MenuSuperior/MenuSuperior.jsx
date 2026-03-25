import { useEffect, useReducer } from "react";
import { Container, Nav, Navbar, Image } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import MenuLateral from "@/components/layout/MenuLateral/MenuLateral";
import "./MenuSuperior.css";
import logo from "@/assets/images/logo.jpg";
import Notificaciones from "@/components/notificaciones/Notificaciones/Notificaciones";
import { estaLogueado, cerrarSesion } from "@/utils/sessionHelper";
import { resetEstadoServidor } from "@/utils/serverStatus";

// Reducer para manejar el estado del menú
const initialState = {
  logueado: false,
  mostrarSidebar: false,
  notificaciones: 3,
  pulsando: false,
};

function menuReducer(state, action) {
  switch (action.type) {
    case "SET_LOGUEADO":
      return { ...state, logueado: action.payload };
    case "SET_MOSTRAR_SIDEBAR":
      return { ...state, mostrarSidebar: action.payload };
    case "SET_PULSANDO":
      return { ...state, pulsando: action.payload };
    case "RESET_SESION":
      return { ...state, logueado: false, mostrarSidebar: false };
    default:
      return state;
  }
}

export default function MenuSuperior() {
  const [state, dispatch] = useReducer(menuReducer, initialState);
  const { logueado, mostrarSidebar, pulsando } = state;
  const notificaciones = 3; // Valor fijo, no necesita estado
  const navegar = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verificarLogin = () => {
      dispatch({ type: "SET_LOGUEADO", payload: estaLogueado() });
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
    const interval = setInterval(() => {
      dispatch({ type: "SET_PULSANDO", payload: true });
      setTimeout(() => dispatch({ type: "SET_PULSANDO", payload: false }), 2000);
    }, 15000);

    return () => clearInterval(interval);
  }, [logueado]);

  const abrirSidebar = () => dispatch({ type: "SET_MOSTRAR_SIDEBAR", payload: true });
  const cerrarSidebar = () => dispatch({ type: "SET_MOSTRAR_SIDEBAR", payload: false });

  const manejarCerrarSesion = () => {
    resetEstadoServidor();
    cerrarSesion();
    dispatch({ type: "RESET_SESION" });
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
                onMouseEnter={() => dispatch({ type: "SET_PULSANDO", payload: false })}
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