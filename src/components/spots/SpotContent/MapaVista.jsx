import { Row, Col } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import FiltrosMapa from "@/components/mapa/FiltrosMapa/FiltrosMapa";
import MapaBogota from "@/components/mapa/MapaBogota/MapaBogota";

const MapaVista = ({ filtrosVisibles, onToggleFiltros, onFiltrar, filtros }) => (
  <div className="mapa-content-container">
    <button
      type="button"
      className="toggle-filtros-btn"
      onClick={onToggleFiltros}
    >
      {filtrosVisibles ? <FaChevronUp /> : <FaChevronDown />}
      <span>{filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}</span>
    </button>

    {filtrosVisibles && (
      <Row className="mapa-row filtros-row">
        <Col className="p-0">
          <FiltrosMapa onFiltrar={onFiltrar} />
        </Col>
      </Row>
    )}

    <Row className="mapa-row">
      <Col className="p-0">
        <MapaBogota filtros={filtros} />
      </Col>
    </Row>
  </div>
);

export default MapaVista;
