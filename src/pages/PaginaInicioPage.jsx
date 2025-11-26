import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./PaginaInicioPage.css";
import PaginaInicioContent from "../components/PaginaInicioContent";

function PaginaInicioPage() {
  return (
    <>
      <div className="pagina-inicio-page">
        <Container className="mt-6">
            <PaginaInicioContent></PaginaInicioContent>
        </Container>
      </div>
    </>
  );
}

export default PaginaInicioPage;
