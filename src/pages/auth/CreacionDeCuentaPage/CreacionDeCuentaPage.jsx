import Container from 'react-bootstrap/Container';
import FormularioCreacion from '@/components/auth/CreacionDeCuentaForm/CreacionDeCuentaForm';
import  "./CreacionDeCuentaPage.css"

function CreacionDeCuentaPage() {
  return (
    <div className="creacion-cuenta">
    <Container >
        <FormularioCreacion></FormularioCreacion>
    </Container>
    </div>
  );
}

export default CreacionDeCuentaPage;
