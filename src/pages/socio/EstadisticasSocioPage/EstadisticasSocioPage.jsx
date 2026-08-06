import { lazy, Suspense } from 'react';
import PageContainer from '@/components/common/PageContainer/PageContainer';
import { FadeLoader } from 'react-spinners';

const EstadisticasSocio = lazy(() => import('@/components/socio/EstadisticasSocio/EstadisticasSocio'));

const EstadisticasSocioPage = () => {
  return (
    <PageContainer content>
      <Suspense fallback={<div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}><FadeLoader color="#806fbe" /></div>}>
        <EstadisticasSocio />
      </Suspense>
    </PageContainer>
  );
};

export default EstadisticasSocioPage;
