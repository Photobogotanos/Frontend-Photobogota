import MiPerfil from "@/components/perfil/MiPerfil/MiPerfil";
import PageContainer from '@/components/common/PageContainer/PageContainer';
import './MiPerfilPage.css';

const MiPerfilPage = () => {
  return (
    <PageContainer className="perfil-page mt-3" containerClassName="mt-3">
      <MiPerfil />
    </PageContainer>
  );
};

export default MiPerfilPage;
