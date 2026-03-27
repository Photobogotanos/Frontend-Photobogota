import Container from "react-bootstrap/Container";
import CrearPromocion from "@/components/socio/SocioPromociones/CrearPromocion";
import "./CrearPromocionPage.css";

const  CrearPromocionPage = () => {
    return(
        <div className="crear-promocion">
            <Container className="mt-3">
                <CrearPromocion></CrearPromocion>
            </Container>
        </div>
    )
}

export default CrearPromocionPage;
