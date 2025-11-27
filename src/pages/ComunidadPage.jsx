import ComunidadContent from "../components/ComunidadContent";
import Container from 'react-bootstrap/Container';
import './ComunidadPage.css';

const ComunidadPage = () => {
  return (
    <div className="comunidad-page mt-5">
      <Container className="mt-3">
        <ComunidadContent />
      </Container>
    </div>
  );
};

export default ComunidadPage;