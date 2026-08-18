import "./Footer.css";
import {
  FaGithub,
  FaHeart,
  FaMapMarkedAlt,
  FaCamera,
  FaUsers,
  FaEnvelope,
} from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/", label: "Inicio", icon: FaCamera },
  { to: "/mapa", label: "Mapa", icon: FaMapMarkedAlt },
  { to: "/nosotros", label: "Nosotros", icon: FaUsers },
];

const TEAM = ["Sergiño", "SotoProgramador", "Sebastacho", "Yanpol", "Danfel"];

export default function Footer() {
  const { pathname } = useLocation();
  const currentYear = new Date().getFullYear();

  if (pathname.startsWith("/mapa")) {
    return null;
  }

  return (
    <footer className="footer-principal">
      <div className="footer-accent" aria-hidden="true" />

      <Container className="footer-container">
        <Row className="gy-5">
          <Col lg={4} md={12}>
            <div className="footer-brand-block">
              <Link to="/" className="footer-brand">
                Photo Bogotá
              </Link>
              <p className="footer-tagline">
                Descubre los mejores spots fotográficos de Bogotá. Explora,
                guarda y comparte lugares únicos de la ciudad.
              </p>

              <div className="footer-social">
                <a
                  href="https://github.com/Photobogotanos"
                  className="footer-social-link"
                  aria-label="GitHub de Photobogotanos"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub size={20} />
                </a>
              </div>
            </div>
          </Col>

          <Col lg={3} md={6} sm={6}>
            <h4 className="footer-col-title">Explorar</h4>
            <ul className="footer-nav-list">
              {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link to={to} className="footer-nav-link">
                    <Icon className="footer-nav-icon" aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={2} md={6} sm={6}>
            <h4 className="footer-col-title">Contacto</h4>
            <ul className="footer-nav-list">
              <li>
                <a
                  href="mailto:photobogota123@gmail.com"
                  className="footer-nav-link"
                >
                  <FaEnvelope className="footer-nav-icon" aria-hidden="true" />
                  Escribenos
                </a>
              </li>
              <li>
                <Link
                  to="/solicitud-socio/formulario"
                  className="footer-nav-link"
                >
                  <FaUsers className="footer-nav-icon" aria-hidden="true" />
                  Ser socio
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={12}>
            <h4 className="footer-col-title">
              <FaHeart className="footer-heart" aria-hidden="true" />
              Equipo
            </h4>
            <div className="footer-credits">
              {TEAM.map((name) => (
                <Link key={name} to="/nosotros" className="footer-credit-chip">
                  {name}
                </Link>
              ))}
            </div>
          </Col>
        </Row>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Photo Bogotá. Todos los derechos reservados.
          </p>
          <p className="footer-bottom-note">Hecho en Bogotá</p>
        </div>
      </Container>
    </footer>
  );
}
