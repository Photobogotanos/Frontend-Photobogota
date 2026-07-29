import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { FiUser, FiCalendar, FiShield, FiAlertTriangle, FiEye } from "react-icons/fi";
import { obtenerEstadoEliminacionInfo, MOTIVOS_ELIMINACION_LABEL } from "@/services/admin.service";

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function SolicitudEliminacionCard({ solicitud, onVerDetalle }) {
  const estado = obtenerEstadoEliminacionInfo(solicitud.estado);
  const motivoLabel = MOTIVOS_ELIMINACION_LABEL[solicitud.motivo] || solicitud.motivo || "Sin especificar";
  const tieneDependencias = solicitud.dependencias?.tieneDependenciasPendientes;

  return (
    <div className={`eliminacion-card estado-${(solicitud.estado || "").toLowerCase()}`}>
      <div className="eliminacion-card-header">
        <div className="eliminacion-usuario">
          <span className="id-label">Usuario:</span>
          <span className="id-value">{solicitud.nombreUsuario}</span>
        </div>
        <div className="eliminacion-badges">
          <Badge bg="dark">{solicitud.rol}</Badge>
          {solicitud.identidadVerificada ? (
            <Badge bg="success">
              <FiShield /> Identidad verificada
            </Badge>
          ) : (
            <Badge bg="danger">
              <FiAlertTriangle /> Identidad no verificada
            </Badge>
          )}
          <Badge bg={estado.variant}>{estado.etiqueta}</Badge>
        </div>
      </div>

      <div className="eliminacion-card-body">
        <div className="info-row">
          <FiUser className="info-icon" />
          <span>{solicitud.email}</span>
        </div>
        <div className="info-row">
          <FiCalendar className="info-icon" />
          <span>Solicitada el {formatearFecha(solicitud.fechaSolicitud)}</span>
        </div>

        <p className="eliminacion-motivo">
          Motivo: <b>{motivoLabel}</b>
        </p>
        {solicitud.comentario && <p className="eliminacion-comentario">"{solicitud.comentario}"</p>}

        {solicitud.estado === "PROGRAMADA" && solicitud.diasRestantes != null && (
          <p className="eliminacion-dias-restantes">
            {solicitud.diasRestantes} día(s) restantes para la anonimización automática
          </p>
        )}

        {tieneDependencias && (
          <p className="eliminacion-dependencias-aviso">
            <FiAlertTriangle /> Tiene dependencias pendientes:{" "}
            {solicitud.dependencias.spotsCreados > 0 && `${solicitud.dependencias.spotsCreados} spot(s), `}
            {solicitud.dependencias.reportesPendientesComoAutor > 0 &&
              `${solicitud.dependencias.reportesPendientesComoAutor} reporte(s) propio(s), `}
            {solicitud.dependencias.reportesPendientesSobreSuContenido > 0 &&
              `${solicitud.dependencias.reportesPendientesSobreSuContenido} reporte(s) sobre su contenido`}
          </p>
        )}

        {solicitud.procesadaManualmente && (
          <p className="eliminacion-procesada-admin">
            Procesada manualmente por {solicitud.procesadaPorAdmin}
          </p>
        )}
      </div>

      <div className="eliminacion-card-actions">
        <Stack direction="horizontal" gap={2}>
          <Button variant="outline-primary" size="sm" onClick={() => onVerDetalle(solicitud)}>
            <FiEye /> Ver detalle
          </Button>
        </Stack>
      </div>
    </div>
  );
}
