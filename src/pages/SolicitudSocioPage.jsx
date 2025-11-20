import SolicitudSocioForm from "../components/SolicitudSocioForm";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SolicitudSocioPage = () => {
  return (
    <Container fluid>
      <Row className="justify-content-center mt-5">
        <Col>
          <SolicitudSocioForm />
        </Col>
      </Row>
    </Container>
  );
};

export default SolicitudSocioPage;
