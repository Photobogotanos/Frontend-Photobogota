import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import FiltrosMapa from "@/components/mapa/FiltrosMapa/FiltrosMapa";
import MapaBogota from "@/components/mapa/MapaBogota/MapaBogota";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./MapaContent.css";

const MapaContent = () => {
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);

  return (
    <div className="mapa-content-container">

      <button
        className="toggle-filtros-btn"
        onClick={() => setFiltrosVisibles(!filtrosVisibles)}
      >
        {filtrosVisibles ? <FaChevronUp /> : <FaChevronDown />}
        <span>{filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}</span>
      </button>

      {filtrosVisibles && (
        <Row className="mapa-row filtros-row">
          <Col className="p-0">
            <FiltrosMapa />
          </Col>
        </Row>
      )}

      <Row className="mapa-row">
        <Col className="p-0">
          <MapaBogota />
        </Col>
      </Row>
    </div>
  );
};

export default MapaContent;