import { useEffect, useReducer, useRef } from "react";
import { Container, Nav, Navbar, Image } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import MenuLateral from "@/components/layout/MenuLateral/MenuLateral";
import "./MenuSuperior.css";
import logo from "@/assets/images/logo.jpg";
import Notificaciones from "@/components/notificaciones/Notificaciones/Notificaciones";
import { estaLogueado } from "@/utils/sessionHelper";
import { useAuth } from "@/context/AuthContext";
import { resetEstadoServidor } from "@/utils/serverStatus";

// Reducer para manejar el estado del menú
const initialState = {
  logueado: false,
  mostrarSidebar: false,
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

  const navegar = useNavigate();
  const location = useLocation();
  const { cerrarSesion } = useAuth();

  // Ref para controlar el collapse del menú responsive
  const navbarCollapseRef = useRef(null);

  // Función segura para cerrar el menú en modo responsive
  const cerrarMenuResponsive = () => {
    const collapseElement = navbarCollapseRef.current;
    if (!collapseElement) return;

    try {
      // Intentar cerrar con Bootstrap 5
      if (window.bootstrap?.Collapse) {
        const collapseInstance = window.bootstrap.Collapse.getOrCreateInstance(collapseElement);
        if (collapseInstance) {
          collapseInstance.hide();
          return;
        }
      }
    } catch (error) {
      console.warn("No se pudo cerrar el collapse con Bootstrap:", error);
    }

    // Fallback manual 
    collapseElement.classList.remove("show");

    // Actualizar el estado visual del botón toggler
    const toggler = document.querySelector(".navbar-toggler");
    if (toggler) {
      toggler.setAttribute("aria-expanded", "false");
      toggler.classList.add("collapsed");
    }
  };

  // Verificar si el usuario está logueado
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
  }, []);

  // Cerrar el menú responsive automáticamente al cambiar de página
  useEffect(() => {
    cerrarMenuResponsive();
  }, [location.pathname]);

  const abrirSidebar = () => dispatch({ type: "SET_MOSTRAR_SIDEBAR", payload: true });
  const cerrarSidebar = () => dispatch({ type: "SET_MOSTRAR_SIDEBAR", payload: false });

  const manejarCerrarSesion = async () => {
    resetEstadoServidor();
    await cerrarSesion();
    dispatch({ type: "RESET_SESION" });
    navegar("");
    cerrarMenuResponsive();
  };

  return (
    <>
      <Navbar 
        expand="lg" 
        fixed="top" 
        className="navbar-custom shadow-sm py-2"
        collapseOnSelect   
      >
        <Container fluid className="menu-container px-4">
          {/* Botón hamburguesa para usuarios logueados (menú lateral) */}
          {logueado && (
            <button
              onClick={abrirSidebar}
              className="hamburger-btn p-0 me-3"
              aria-label="Abrir menú lateral"
            >
              <FaBars />
            </button>
          )}

          {/* Logo */}
          <Navbar.Brand
            as={Link}
            to={logueado ? "/mapa" : "/"}
            className="brand-wrapper d-flex align-items-center"
          >
            <Image src={logo} alt="Logo PhotoBogotá" className="brand-logo" />
            <span className="brand-title ms-2">Photo Bogotá</span>
          </Navbar.Brand>

          {/* Menú para usuarios NO logueados */}
          {!logueado ? (
            <>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse 
                id="basic-navbar-nav" 
                ref={navbarCollapseRef}
              >
                <Nav className="ms-auto menu-links">
                  <Nav.Link 
                    as={Link} 
                    to="/solicitud-socio/formulario"
                    onClick={cerrarMenuResponsive}
                  >
                    ¿Quieres ser socio?
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/nosotros"
                    onClick={cerrarMenuResponsive}
                  >
                    Quiénes somos
                  </Nav.Link>
                  <Nav.Link 
                    as={Link} 
                    to="/login" 
                    className="inicio-sesion"
                    onClick={cerrarMenuResponsive}
                  >
                    Iniciar Sesión
                  </Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </>
          ) : (
            /* Menú para usuarios logueados */
            <div className="d-flex align-items-center ms-auto acciones-usuario">
              <Link
                to="/crear-spot"
                className={`btn-crear-publicacion ${pulsando ? "pulsing" : ""}`}
                onMouseEnter={() => dispatch({ type: "SET_PULSANDO", payload: false })}
                onClick={cerrarMenuResponsive}
                aria-label="Crear nuevo spot"
              >
                <FaPlus />
                <span className="texto-completo">Crear Spot</span>
                <span className="texto-corto">Crear</span>
              </Link>

              <Notificaciones notificaciones={3} />
            </div>
          )}
        </Container>
      </Navbar>

      {/* Menú lateral */}
      <MenuLateral
        mostrar={mostrarSidebar}
        cerrar={cerrarSidebar}
        cerrarSesion={manejarCerrarSesion}
      />
    </>
  );
}