import Container from 'react-bootstrap/Container';
import ConfirmacionCodigoForm from '@/components/auth/ConfirmacionCodigoForm/ConfirmacionCodigoForm';
import "./ConfirmacionCodigoPage.css"
export default function ConfirmacionCodigoPage(){

    return(
    <div className="confirmacion-codigo">
    <Container >
        <ConfirmacionCodigoForm></ConfirmacionCodigoForm>
    </Container>
    </div>
    );

}
