import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Menu from '../components/Menu';
import logo from "../assets/images/logo.png";
import './PaginaInicio.css'

function PaginaInicioPage() {
  return (
    <div className='pagina-inicio-page'> 
      <Container > 
          <Menu> </Menu>
          <Row>
            <h1>Photo Bogotá</h1>
            <p>Un espacio para compartir miradas fotográficas y redescubrir Bogotá desde diferentes perspectivas</p>
            <img src={logo} alt="Logo" className="solicitud-form-logo" />
          </Row>
          
          <Col>2 of 2</Col>
        
      </Container>
    </div>
  );
}

export default PaginaInicioPage;