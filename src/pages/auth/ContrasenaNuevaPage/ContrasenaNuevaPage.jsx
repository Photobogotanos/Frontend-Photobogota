import Container from 'react-bootstrap/Container';
import  "./ContrasenaNuevaPage.css"
import PasswordResetForm from '../../../components/auth/RecuperarContraForm/PasswordResetForm';

function ContrasenaNuevaPage() {
  return (
    <div className="nueva-contrasena">
    <Container >
    <PasswordResetForm></PasswordResetForm>
    </Container>
    </div>
  );
}

export default ContrasenaNuevaPage;
