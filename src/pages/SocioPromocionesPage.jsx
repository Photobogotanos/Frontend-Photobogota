import "./SocioPromocionesPage.css";
import SocioPromociones from "../components/socio/SocioPromociones/SocioPromociones";
import { Container } from  "react-bootstrap"

const Sociolocales = () =>{
    return(
        <div className="socio-promociones">
            <Container>
                <SocioPromociones></SocioPromociones>
            </Container>
        </div>
    )
}

export default SocioPromocionesPage;