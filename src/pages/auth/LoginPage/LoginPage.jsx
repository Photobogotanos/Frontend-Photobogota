import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <div className="login">
    <Container fluid className='cajon'>
      <Row>
        <Col>
          
          <LoginForm/>
        </Col>
      </Row>
    </Container>
    </div>
  );
}
