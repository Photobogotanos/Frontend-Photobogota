import LugarContent from "../components/LugarContent";
import Container from 'react-bootstrap/Container';
import './LugarPage.css';

const LugarPage = () => {
  return (
    <div className="lugar-page">
      <Container fluid className="p-0">  
        <LugarContent />
      </Container>
    </div>
  );
};

export default LugarPage;