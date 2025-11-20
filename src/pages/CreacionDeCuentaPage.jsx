import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormularioCreacion from '../components/CreacionDeCuentaForm';


export default function CreacionDeCuentaPage() {
  return (
    <Container fluid>
      <Row>
        <Col>
        <FormularioCreacion></FormularioCreacion>
        </Col>
      </Row>
    </Container>
  );
}

