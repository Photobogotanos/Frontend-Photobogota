import "./SocioLocalesPage.css";
import SocioLocales from "@/components/socio/SocioLocales/SocioLocales";
import { Container } from "react-bootstrap";

const SocioLocalesPage = () => {
  return (
    <div className="locales">
      <Container>
        <SocioLocales></SocioLocales>
      </Container>
    </div>
  );
};

export default SocioLocalesPage;
