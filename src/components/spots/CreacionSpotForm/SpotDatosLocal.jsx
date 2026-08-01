import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPhone, FaClock, FaGlobe } from "react-icons/fa";

export default function SpotDatosLocal({
  telefono,
  horario,
  sitioWeb,
  onTelefonoChange,
  onHorarioChange,
  onSitioWebChange,
}) {
  return (
    <div className="mb-3">
      <h5 className="section-title mb-2">Datos del local</h5>
      <Row className="g-3">
        <Col xs={12} md={4}>
          <label className="spot-label" htmlFor="telefono-local">
            <FaPhone className="me-2" />
            Teléfono
          </label>
          <input
            id="telefono-local"
            type="tel"
            className="spot-input"
            placeholder="Ej: 300 123 4567"
            value={telefono}
            onChange={(e) => onTelefonoChange(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <label className="spot-label" htmlFor="horario-local">
            <FaClock className="me-2" />
            Horario
          </label>
          <input
            id="horario-local"
            type="text"
            className="spot-input"
            placeholder="Ej: Lun–Vie 9:00–18:00"
            value={horario}
            onChange={(e) => onHorarioChange(e.target.value)}
          />
        </Col>
        <Col xs={12} md={4}>
          <label className="spot-label" htmlFor="web-local">
            <FaGlobe className="me-2" />
            Sitio web
          </label>
          <input
            id="web-local"
            type="url"
            className="spot-input"
            placeholder="https://..."
            value={sitioWeb}
            onChange={(e) => onSitioWebChange(e.target.value)}
          />
        </Col>
      </Row>
    </div>
  );
}