import { Row, Col } from "react-bootstrap";
import FiltrosMapa from "./FiltrosMapa";
import MapaBogota from "./MapaBogota";
import "./MapaContent.css";

const MapaContent = () => {
  return (
    <div className="mapa-content-container">
      <Row className="mapa-row">
        <Col className="p-0">
          <FiltrosMapa />
          <MapaBogota />
        </Col>
      </Row>
    </div>
  );
};

export default MapaContent;