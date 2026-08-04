import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FiCheck, FiX, FiEye, FiUser, FiCalendar, FiTag, FiEdit3, FiSend } from "react-icons/fi";
import { getEstadoMeta, estaEnRevision, puedeEnviarCredenciales, formatearFecha } from "@/utils/estadoAspiranteUtils";

// Este componente muestra la tarjeta de cada solicitud en la lista.
// Recibe la solicitud y las funciones del padre para manejar las acciones.
export default function SolicitudCard({ solicitud, onVerDetalle, onAprobar, onRechazar, onSolicitarCorreccion, onEnviarCredenciales }) {
  const { label, variant } = getEstadoMeta(solicitud.estado);
  const enRevision = estaEnRevision(solicitud.estado);
  const listoParaCredenciales = puedeEnviarCredenciales(solicitud.estado);

  return (
    <div className="solicitud-card">
      <div className="solicitud-card-header">
        <div className="solicitud-id">
          <span className="id-label">Código:</span>
          <span className="id-value">{solicitud.codigo}</span>
        </div>
        <Badge bg={variant}>{label}</Badge>
      </div>

      <div className="solicitud-card-body">
        <h3 className="razon-social">{solicitud.razonSocial}</h3>
        <p className="categoria">
          <FiTag className="info-icon" />{solicitud.categoria}
        </p>
        <div className="info-row">
          <FiUser className="info-icon" />
          <span>{solicitud.nombres} {solicitud.apellidos}</span>
        </div>
        <div className="info-row">
          <FiCalendar className="info-icon" />
          <span>{formatearFecha(solicitud.fechaSolicitud)}</span>
        </div>
      </div>

      {/* Los botones de aprobar, rechazar y solicitar corrección solo
          aparecen mientras la solicitud está en revisión */}
      <div className="solicitud-card-actions">
        <Button variant="outline-primary" size="sm" onClick={() => onVerDetalle(solicitud)} className="btn-view">
          <FiEye /> Ver Detalle
        </Button>
        {enRevision && (
          <Stack direction="horizontal" gap={2} className="flex-wrap">
            <Button variant="outline-success" size="sm" onClick={() => onAprobar(solicitud.id)} className="btn-approve">
              <FiCheck /> Aprobar
            </Button>
            <Button variant="outline-warning" size="sm" onClick={() => onSolicitarCorreccion(solicitud.id)} className="btn-correccion">
              <FiEdit3 /> Corregir
            </Button>
            <Button variant="outline-danger" size="sm" onClick={() => onRechazar(solicitud.id)} className="btn-reject">
              <FiX /> Rechazar
            </Button>
          </Stack>
        )}
        {listoParaCredenciales && (
          <Button variant="success" size="sm" onClick={() => onEnviarCredenciales(solicitud.id)} className="btn-credenciales">
            <FiSend /> Enviar credenciales
          </Button>
        )}
      </div>
    </div>
  );
}
