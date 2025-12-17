import SolicitudSocioForm from "@/components/socio/SolicitudSocioForm/SolicitudSocioForm";
import Container from 'react-bootstrap/Container';
import './SolicitudSocioPage.css';

const SolicitudSocioPage = () => {
  return (
    <div className="solicitud-socio-page mt-5">
      <Container className="mt-3">
        <SolicitudSocioForm />
      </Container>
    </div>
  );
};

export default SolicitudSocioPage;