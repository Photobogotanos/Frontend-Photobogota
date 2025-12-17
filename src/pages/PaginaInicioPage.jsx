import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import "./PaginaInicioPage.css";
import PaginaInicioContent from "@/components/pagina-inicio/PaginaInicioContent/PaginaInicioContent";

function PaginaInicioPage() {
  const navegar = useNavigate();

  useEffect(() => {
    const estaLogueado = localStorage.getItem("logueado") === "true";
    
    if (estaLogueado) {
      navegar("/comunidad");
    }
  }, [navegar]);

  return (
    <Container fluid className="p-0 mt-5">
      <div className="pagina-inicio-page">
        <PaginaInicioContent></PaginaInicioContent>
      </div>
    </Container>
  );
}

export default PaginaInicioPage;