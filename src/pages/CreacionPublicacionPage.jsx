import Container from 'react-bootstrap/Container';
import CrearPublicacion from '../components/CreacionPublicacionForm';
export default function CreacionPublicacionPage(){

    return(
    <div className="creacion-publicacion">
    <Container >
        <CrearPublicacion></CrearPublicacion>
    </Container>
    </div>
    );

}