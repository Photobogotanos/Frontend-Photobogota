import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import MenuSuperior from "../components/MenuSuperior";
import "./PaginaInicioPage.css";

function PaginaInicioPage() {
  return (
    <>
      <div className="pagina-inicio-page">
        <Container className="mt-4">
          <Row>
            <Col>1 of 2</Col>
            <Col>2 of 2</Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default PaginaInicioPage;
