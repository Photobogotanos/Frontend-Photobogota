import "./Footer.css";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-principal">
      <Container className="footer-container">
        <Row className="align-items-center gy-4">
          {/* Columna izquierda - Logo y redes */}
          <Col lg={6} md={12} className="text-center text-md-start">
            <h3 className="footer-brand mb-3">Photo Bogotá</h3>
            <p className="footer-copyright mb-4">
              © {currentYear} Photo Bogotá. Todos los derechos reservados.
            </p>

            <div className="footer-social">
              <a href="#" className="footer-social-link" aria-label="Facebook">
                <FaFacebookF size={26} />
              </a>
              <a href="#" className="footer-social-link" aria-label="YouTube">
                <FaYoutube size={26} />
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <FaInstagram size={26} />
              </a>
            </div>
          </Col>

          {/* Columna derecha - Créditos del equipo */}
          <Col lg={6} md={12}>
            <div className="text-center text-md-end">
              <p className="footer-credits-title mb-3">Desarrollado con ❤️ por:</p>
              <div className="footer-credits">
                <span>Sergiño</span>
                <span>SotoProgramador</span>
                <span>Sebastacho</span>
                <span>Yanpol</span>
                <span>Danfel</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}