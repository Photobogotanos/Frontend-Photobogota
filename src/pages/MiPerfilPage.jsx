import MiPerfil from "@/components/perfil/MiPerfil/MiPerfil";
import Container from 'react-bootstrap/Container';
import './MiPerfilPage.css';

const MiPerfilPage = () => {
  return (
    <div className="perfil-page mt-3">
      <Container fluid className="mt-3">
        <MiPerfil />
      </Container>
    </div>
  );
};

export default MiPerfilPage;