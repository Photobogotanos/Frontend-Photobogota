import PreferenciasNotificaciones from "@/components/notificaciones/PreferenciasNotificaciones/PreferenciasNotificaciones";
import Container from "react-bootstrap/Container";
import "./PreferenciasNotificacionesPage.css";

const PreferenciasNotificacionesPage = () => {
  return (
    <div className="preferencias-page mt-3">
      <Container fluid className="mt-3">
        <PreferenciasNotificaciones />
      </Container>
    </div>
  );
};

export default PreferenciasNotificacionesPage;
