import SpotContent from "@/components/spots/SpotContent/SpotContent";
import Container from 'react-bootstrap/Container';
import './SpotPage.css';

const SpotPage = () => {
  return (
    <div className="lugar-page">
      <Container fluid className="p-0">
        <SpotContent />
      </Container>
    </div>
  );
};

export default SpotPage;
