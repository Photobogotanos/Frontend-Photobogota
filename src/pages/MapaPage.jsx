import ComunidadContent from "../components/ComunidadContent";
import Container from 'react-bootstrap/Container';
import './MapaPage.css';

const MapaPage = () => {
  return (
    <div className="mapa-page mt-5">
      <Container className="mt-3">
        <ComunidadContent />
      </Container>
    </div>
  );
};

export default MapaPage;