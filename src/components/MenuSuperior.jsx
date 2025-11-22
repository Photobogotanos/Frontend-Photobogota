import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import "./MenuSuperior.css";
import logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";

export default function MenuSuperior() {
  return (
    <Navbar expand="lg" fixed="top" className="navbar-custom shadow-sm py-2">
      <Container fluid className="menu-container px-4">
        <Navbar.Brand
          href="/"
          className="brand-wrapper d-flex align-items-center"
        >
          <Image src={logo} alt="Logo PhotoBogotá" className="brand-logo" />
          <span className="brand-title ms-2">Photo Bogotá</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto menu-links">
            <Nav.Link as={Link} to="/solicitud-socio">
              ¿Quieres ser socio?
            </Nav.Link>

            <Nav.Link as={Link} to="/">
              Quiénes somos
            </Nav.Link>

            <Nav.Link as={Link} to="/login" className="inicio-sesion">
              Iniciar Sesión
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
