import Container from "react-bootstrap/Container";
import EnviarNotificacion from "@/components/admin/EnviarNotificacion/EnviarNotificacion";
import "./EnviarNotificacionPage.css";

const EnviarNotificacionPage = () => {
  return (
    <div className="enviar-notificacion-page">
      <Container fluid className="p-0">
        <EnviarNotificacion />
      </Container>
    </div>
  );
};

export default EnviarNotificacionPage;
