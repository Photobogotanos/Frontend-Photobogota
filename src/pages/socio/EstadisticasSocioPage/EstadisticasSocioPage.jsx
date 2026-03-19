import { lazy, Suspense } from 'react';
import Container from 'react-bootstrap/Container';
import './EstadisticasSocioPage.css';
import { FadeLoader } from 'react-spinners';

const EstadisticasSocio = lazy(() => import('@/components/socio/EstadisticasSocio/EstadisticasSocio'));

const EstadisticasSocioPage = () => {
  return (
    <div className="estadisticas-page">
      <Container fluid className="p-0">
        <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}><FadeLoader color="#806fbe" /></div>}>
          <EstadisticasSocio />
        </Suspense>
      </Container>
    </div>
  );
};

export default EstadisticasSocioPage;
