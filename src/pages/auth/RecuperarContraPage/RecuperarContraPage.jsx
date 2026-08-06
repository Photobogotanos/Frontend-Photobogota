import PageContainer from "@/components/common/PageContainer/PageContainer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RecuperarContraForm from "@/components/auth/RecuperarContraForm/RecuperarContraForm";
import "./RecuperarContraPage.css";

export default function RecuperarContraPage() {
  return (
    <PageContainer className="login" containerClassName="cajon">
      <Row>
        <Col>
          <RecuperarContraForm />
        </Col>
      </Row>
    </PageContainer>
  );
}
