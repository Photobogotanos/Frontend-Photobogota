import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MenuSuperior from '../components/MenuSuperior';
import './PaginaInicio.css'

function PaginaInicioPage() {
  return (
    <div className='pagina-inicio-page'> 
      <Container > 
          <MenuSuperior> </MenuSuperior>
          <Col>1 of 2</Col>
          <Col>2 of 2</Col>
        
      </Container>
    </div>
  );
}

export default PaginaInicioPage;