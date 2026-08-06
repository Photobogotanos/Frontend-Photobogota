import UsuarioPerfil from "@/components/perfil/UsuarioPerfil/UsuarioPerfil";
import PageContainer from "@/components/common/PageContainer/PageContainer";
import "./UsuarioPerfilPage.css";

const UsuarioPerfilPage = () => {
  return (
    <PageContainer className="perfil-page mt-3" containerClassName="mt-3">
      <UsuarioPerfil />
    </PageContainer>
  );
};

export default UsuarioPerfilPage;
