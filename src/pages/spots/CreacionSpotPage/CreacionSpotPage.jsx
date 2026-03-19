import Container from "react-bootstrap/Container";
import CrearPublicacionForm from "@/components/spots/CreacionSpotForm/CreacionSpotForm";
import "./CreacionSpotPage.css";

export default function CreacionSpotPage() {
  return (
    <div className="creacion-spot">
      <Container className="mt-3">
        <CrearPublicacionForm></CrearPublicacionForm>
      </Container>
    </div>
  );
}
