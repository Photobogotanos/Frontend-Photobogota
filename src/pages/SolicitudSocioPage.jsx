import SolicitudSocioForm from "../components/SolicitudSocioForm";
import Container from 'react-bootstrap/Container';

const SolicitudSocioPage = () => {
  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "var(--color-bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem"
    }}>
      <Container style={{ maxWidth: "600px" }}>
        <SolicitudSocioForm />
      </Container>
    </div>
  );
};

export default SolicitudSocioPage;