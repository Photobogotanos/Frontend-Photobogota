import SolicitudSocioForm from "../components/SolicitudSocioForm";
import Container from 'react-bootstrap/Container';
import './SolicitudSocioPage.css';

const SolicitudSocioPage = () => {
  return (
    <div className="solicitud-socio-page">
      <Container>
        <SolicitudSocioForm />
      </Container>
    </div>
  );
};

export default SolicitudSocioPage;