import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import './Menu.css';

export default function Menu(){
    return( 
        <Navbar expand="lg" className="menu-navbar" >
      <Container fluid className="menu-container">
        <Navbar.Brand href="#home" className="menu-inicio-logo">Photo Bogotá</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="menu-nav">
            <Nav.Link href="#home">¿Quieres ser socio?</Nav.Link>
            <Nav.Link href="#link">Quienes somos</Nav.Link>
            <button className="menu-button-login rounded-pill" type="submit"><b>Enviar solicitud</b></button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    ) 
}