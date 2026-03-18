import SolicitudSocio from '../components/moderador/SolicitudSocio/SolicitudSocio';
import './RevisionSolicitudesSocioPage.css'
import Container from 'react-bootstrap/Container';

export default function RevisionSolicitudesSocioPage(){

    return(
        <div className='revision-solicitudes-socio mt-5'>
            <Container className='mt-3'>
                <SolicitudSocio></SolicitudSocio>
            </Container>
        </div>
    );
}
