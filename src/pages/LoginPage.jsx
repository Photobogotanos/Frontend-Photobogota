import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from "../components/LoginForm";
import "../pages/Login.css";

export default function Login() {
  return (
    <div className="login">
    <Container fluid>
      <Row>
        <Col>
          <LoginForm/>
        </Col>
      </Row>
    </Container>
    </div>
  );
}
