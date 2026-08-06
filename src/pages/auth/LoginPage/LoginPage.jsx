import PageContainer from "@/components/common/PageContainer/PageContainer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LoginForm from "@/components/auth/LoginForm/LoginForm";
import "./LoginPage.css";

export default function LoginPage() {
  return (
    <PageContainer className="login" containerClassName="cajon">
      <Row>
        <Col>
          <LoginForm />
        </Col>
      </Row>
    </PageContainer>
  );
}
