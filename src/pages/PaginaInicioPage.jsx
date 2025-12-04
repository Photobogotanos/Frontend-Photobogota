import Container from "react-bootstrap/Container";
import "./PaginaInicioPage.css";
import PaginaInicioContent from "../components/PaginaInicioContent";

function PaginaInicioPage() {
  return (
    <>
      <div className="pagina-inicio-page">
        <Container className="mt-5" fluid>
            <PaginaInicioContent></PaginaInicioContent>
        </Container>
      </div>
    </>
  );
}

export default PaginaInicioPage;
