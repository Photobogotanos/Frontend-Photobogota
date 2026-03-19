import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import RecuperarContraForm from "@/components/auth/RecuperarContraForm/RecuperarContraForm";
import "./RecuperarContraPage.css";

export default function RecuperarContraPage() {
  return (
    <div className="login">
      <Container fluid className='cajon'>
        <Row>
          <Col>
            <RecuperarContraForm/>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
