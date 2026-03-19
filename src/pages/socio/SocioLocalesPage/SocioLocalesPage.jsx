import "./SocioLocalesPage.css";
import SociosLocales from "@/components/socio/SocioLocales/SocioLocales";
import { Container } from "react-bootstrap";

const SocioLocalesPage = () => {
    return (
        <>
            <div className="socio-locales-page">
                <Container className="mt-3">
                    <SociosLocales></SociosLocales>
                </Container>
            </div>
    </>
    );
};

export default SocioLocalesPage;
