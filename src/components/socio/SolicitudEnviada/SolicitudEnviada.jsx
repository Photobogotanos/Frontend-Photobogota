import { Badge } from "react-bootstrap";
import {
  FiClock,
  FiFileText,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiTag,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import "./SolicitudEnviada.css";

const SolicitudEnviada = ({ solicitudData }) => {
  const solicitudId =
    solicitudData.solicitudId || `SOL-${Date.now().toString().slice(-8)}`;
  const fechaActual =
    solicitudData.fechaEnvio ||
    new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="solicitud-enviada-component">
      {/* Detalles de la Solicitud - Grid compacto */}
      <div className="details-section">
        <div className="details-header">
          <FiFileText className="details-icon" />
          <h3 className="details-title">Detalles de la Solicitud</h3>
        </div>

        {/* Estado - En una línea */}
        <div className="status-line">
          <FiClock className="status-icon" />
          <div className="status-content">
            <span className="status-label">Estado:</span>
            <Badge className="status-badge">Pendiente de revisión</Badge>
          </div>
        </div>
        
        <div className="info-grid-compact">
          <div className="info-row">
            <div className="info-label-small">Fecha de envío</div>
            <div className="info-value-small">{fechaActual}</div>
          </div>

          <div className="info-row">
            <div className="info-label-small">Razón Social</div>
            <div className="info-value-small">{solicitudData.razonSocial}</div>
          </div>

          <div className="info-row">
            <div className="info-label-small">Propietario</div>
            <div className="info-value-small">{solicitudData.propietario}</div>
          </div>

          <div className="info-row">
            <div className="info-label-small">Categoría</div>
            <div>
              <div className="info-value-small">{solicitudData.categoria}</div>
              <span className="category-tag">{solicitudData.categoria}</span>
            </div>
          </div>

          <div className="info-row">
            <div className="info-label-small">Correo electrónico</div>
            <div className="info-value-small">{solicitudData.email}</div>
          </div>

          <div className="info-row">
            <div className="info-label-small">Teléfono</div>
            <div className="info-value-small">{solicitudData.telefono}</div>
          </div>
        </div>
      </div>

      {/* Próximos pasos - Compacto */}
      <div className="next-steps">
        <div className="next-steps-content">
          <FiAlertCircle className="next-steps-icon" />
          <p className="next-steps-text">
            Te notificaremos por correo cuando tu solicitud sea revisada.
            Proceso: <strong>hasta 7 días hábiles</strong>. Usa tu código para
            consultar el estado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SolicitudEnviada;
