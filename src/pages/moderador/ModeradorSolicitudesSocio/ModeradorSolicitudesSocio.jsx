import SolicitudSocio from '@/components/moderador/SolicitudSocio/SolicitudSocio';
import './ModeradorSolicitudesSocio.css'
import Container from 'react-bootstrap/Container';
export default function ModeradorSolicitudesSocio(){

    return(
        <div className='moderador-solicitudes mt-5'>
            <Container className='mt-3'>
                <SolicitudSocio></SolicitudSocio>
            </Container>
        </div>
    );
}
