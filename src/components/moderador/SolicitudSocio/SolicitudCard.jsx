import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FiCheck, FiX, FiEye, FiUser, FiCalendar, FiTag } from "react-icons/fi";

// Estas dos funciones las usamos para mostrar el color y texto
// correcto según el estado de cada solicitud.
function getBadgeVariant(estado) {
  switch (estado) {
    case "pendiente": return "warning";
    case "aprobada": return "success";
    case "rechazada": return "danger";
    default: return "secondary";
  }
}

function getEstadoLabel(estado) {
  switch (estado) {
    case "pendiente": return "Pendiente";
    case "aprobada": return "Aprobada";
    case "rechazada": return "Rechazada";
    default: return estado;
  }
}

// Este componente muestra la tarjeta de cada solicitud en la lista.
// Recibe la solicitud y las funciones del padre para manejar las acciones.
export default function SolicitudCard({ solicitud, onVerDetalle, onAprobar, onRechazar }) {
  return (
    <div className="solicitud-card">
      <div className="solicitud-card-header">
        <div className="solicitud-id">
          <span className="id-label">ID:</span>
          <span className="id-value">{solicitud.solicitudId}</span>
        </div>
        <Badge bg={getBadgeVariant(solicitud.estado)}>
          {getEstadoLabel(solicitud.estado)}
        </Badge>
      </div>

      <div className="solicitud-card-body">
        <h3 className="razon-social">{solicitud.razonSocial}</h3>
        <p className="categoria">
          <FiTag className="info-icon" />{solicitud.categoria}
        </p>
        <div className="info-row">
          <FiUser className="info-icon" />
          <span>{solicitud.propietario}</span>
        </div>
        <div className="info-row">
          <FiCalendar className="info-icon" />
          <span>{solicitud.fechaEnvio}</span>
        </div>
      </div>

      {/* Los botones de aprobar y rechazar solo aparecen
          si la solicitud todavía está pendiente */}
      <div className="solicitud-card-actions">
        <Button variant="outline-primary" size="sm" onClick={() => onVerDetalle(solicitud)} className="btn-view">
          <FiEye /> Ver Detalle
        </Button>
        {solicitud.estado === "pendiente" && (
          <Stack direction="horizontal" gap={2}>
            <Button variant="outline-success" size="sm" onClick={() => onAprobar(solicitud.solicitudId)} className="btn-approve">
              <FiCheck /> Aprobar
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onRechazar(solicitud.solicitudId)} className="btn-reject">
              <FiX /> Rechazar
            </Button>
          </Stack>
        )}
      </div>
    </div>
  );
}