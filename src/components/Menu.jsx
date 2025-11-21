import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import './Menu.css';

export default function Menu(){
    return( 
        <Navbar expand="lg" className="bg-body-tertiary" fill="true">
      <Container className="menu-container">
        <Navbar.Brand href="#home" className="menu-inicio-logo">Photo Bogotá</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">¿Quieres ser socio?</Nav.Link>
            <Nav.Link href="#link">Quienes somos</Nav.Link>
            <Nav.Link href="#login" className='inicio-sesion'>Iniciar Sesión</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    ) 
}