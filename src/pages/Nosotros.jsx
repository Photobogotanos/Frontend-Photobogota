import "./Nosotros.css";
import NosotrosContent from "@/components/pagina-inicio/NosotrosContent/NosotrosContent";
import { Container } from "react-bootstrap";

const Nosotros = () => {
    return (
        <>
            <div className="nosotros-page">
                <Container className="mt-3">
                    <NosotrosContent></NosotrosContent>
                </Container>
            </div>
    </>
    );
};

export default Nosotros;



