import Container from "react-bootstrap/Container";
import CrearPublicacion from "@/components/comunidad/CreacionPublicacionForm/CreacionPublicacionForm";
import "./CreacionPublicacionPage.css";

export default function CreacionPublicacionPage() {
  return (
    <div className="creacion-publicacion">
      <Container className="mt-3">
        <CrearPublicacion></CrearPublicacion>
      </Container>
    </div>
  );
}
