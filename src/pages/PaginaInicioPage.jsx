import Container from "react-bootstrap/Container";
import "./PaginaInicioPage.css";
import PaginaInicioContent from "../components/PaginaInicioContent";

function PaginaInicioPage() {
  return (

    <Container fluid className="p-0 mt-5">
      <div className="pagina-inicio-page">
        <PaginaInicioContent></PaginaInicioContent>
      </div>
    </Container >

  );
}

export default PaginaInicioPage;
