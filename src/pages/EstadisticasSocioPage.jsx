import EstadisticasSocio from "@/components/socio/EstadisticasSocio/EstadisticasSocio";
import Container from 'react-bootstrap/Container';
import './EstadisticasSocioPage.css';

const EstadisticasSocioPage = () => {
  return (
    <div className="estadisticas-page">
      <Container fluid className="p-0">
        <EstadisticasSocio />
      </Container>
    </div>
  );
};

export default EstadisticasSocioPage;
