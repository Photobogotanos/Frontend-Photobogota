import { FaCheckCircle } from "react-icons/fa";
import { TfiStatsUp } from "react-icons/tfi";
import { TbTargetArrow } from "react-icons/tb";
import { Col, Row } from "react-bootstrap";

export default function PromocionStats({ activas, totalUsos, descuentoPromedio }) {
  return (
    <Row className="estadisticas-rapidas mb-4">
      <Col md={4}>
        <div className="stat-box">
          <div
            className="stat-icon-promociones"
            style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}
          >
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Promociones Activas</span>
            <span className="stat-number">{activas}</span>
          </div>
        </div>
      </Col>
      <Col md={4}>
        <div className="stat-box">
          <div
            className="stat-icon-promociones"
            style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}
          >
            <TfiStatsUp />
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Usos</span>
            <span className="stat-number">{totalUsos}</span>
          </div>
        </div>
      </Col>
      <Col md={4}>
        <div className="stat-box">
          <div
            className="stat-icon-promociones"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
          >
            <TbTargetArrow />
          </div>
          <div className="stat-content">
            <span className="stat-label">Descuentos Promedio</span>
            <span className="stat-number">{descuentoPromedio}</span>
          </div>
        </div>
      </Col>
    </Row>
  );
}