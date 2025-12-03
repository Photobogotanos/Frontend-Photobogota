import MapaContent from "../components/MapaContent";
import Container from 'react-bootstrap/Container';
import './MapaPage.css';

const MapaPage = () => {
  return (
    <div className="mapa-page">
      <Container fluid className="p-0">  
        <MapaContent />
      </Container>
    </div>
  );
};

export default MapaPage;