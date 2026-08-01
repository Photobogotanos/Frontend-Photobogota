import UsuarioPerfil from "@/components/perfil/UsuarioPerfil/UsuarioPerfil";
import Container from "react-bootstrap/Container";
import "./UsuarioPerfilPage.css";

const UsuarioPerfilPage = () => {
  return (
    <div className="perfil-page mt-3">
      <Container fluid className="mt-3">
        <UsuarioPerfil />
      </Container>
    </div>
  );
};

export default UsuarioPerfilPage;
