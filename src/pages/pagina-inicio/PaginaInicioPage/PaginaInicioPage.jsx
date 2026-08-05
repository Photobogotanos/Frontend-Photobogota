import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./PaginaInicioPage.css";
import PaginaInicioContent from "@/components/pagina-inicio/PaginaInicioContent/PaginaInicioContent";
import { estaLogueado } from "@/utils/sessionHelper";

function PaginaInicioPage() {
  const navegar = useNavigate();

  useEffect(() => {
    if (estaLogueado()) {
      navegar("/mapa");
    }
  }, [navegar]);

  return (
    <Container fluid className="p-0 mt-0">
      <div className="pagina-inicio-page">
        <PaginaInicioContent></PaginaInicioContent>
      </div>
    </Container>
  );
}

export default PaginaInicioPage;
