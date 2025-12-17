import ComunidadContent from "@/components/comunidad/ComunidadContent/ComunidadContent";
import Container from 'react-bootstrap/Container';
import './ComunidadPage.css';

const ComunidadPage = () => {
  return (
    <div className="comunidad-page mt-5">
      <Container fluid className="mt-3">
        <ComunidadContent />
      </Container>
    </div>
  );
};

export default ComunidadPage;