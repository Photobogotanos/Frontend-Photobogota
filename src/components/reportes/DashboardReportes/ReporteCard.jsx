import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import {
  FiUser,
  FiCalendar,
  FiArrowUpCircle,
  FiEdit3,
  FiMapPin,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";
import {
  obtenerEtiquetaCategoria,
  obtenerEstado,
  obtenerGravedad,
} from "@/services/reporte.service";

const ETIQUETAS_ROL = { SOCIO: "socio", MOD: "moderación", ADMIN: "administración" };

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

export default function ReporteCard({ reporte, puedeEscalar, puedeValidar, onCambiarEstado, onEscalar, onValidar }) {
  const estado = obtenerEstado(reporte.estado);
  const gravedad = obtenerGravedad(reporte.gravedad);
  const esResena = reporte.tipoObjetivo === "RESENA";
  const objetivoLabel = esResena
    ? `Reseña de ${reporte.autorResenaReportada || "usuario"}`
    : reporte.esLocalDeSocio
      ? `Local: ${reporte.nombreSpot || "sin nombre"}`
      : `Spot: ${reporte.nombreSpot || "sin nombre"}`;

  return (
    <div className={`reporte-card gravedad-${(reporte.gravedad || "").toLowerCase()}`}>
      <div className="reporte-card-header">
        <div className="reporte-ticket">
          <span className="id-label">Ticket:</span>
          <span className="id-value">{reporte.numeroTicket}</span>
        </div>
        <div className="reporte-badges">
          {reporte.escalado && <Badge bg="dark">Escalado</Badge>}
          <Badge bg={gravedad.variant}>{gravedad.etiqueta}</Badge>
          <Badge bg={estado.variant}>{estado.etiqueta}</Badge>
        </div>
      </div>

      <div className="reporte-card-body">
        <h3 className="reporte-categoria">{obtenerEtiquetaCategoria(reporte.categoria)}</h3>

        <div className="info-row">
          {esResena ? <FiMessageSquare className="info-icon" /> : <FiMapPin className="info-icon" />}
          <span>{objetivoLabel}</span>
        </div>
        <div className="info-row">
          <FiUser className="info-icon" />
          <span>Reportado por {reporte.reportadoPor}</span>
        </div>
        <div className="info-row">
          <FiCalendar className="info-icon" />
          <span>{formatearFecha(reporte.fechaCreacion)}</span>
        </div>
        {reporte.asignadoA && (
          <div className="info-row">
            <span>Asignado a {ETIQUETAS_ROL[reporte.asignadoA] || reporte.asignadoA.toLowerCase()}</span>
          </div>
        )}

        <p className="reporte-descripcion">{reporte.descripcion}</p>

        {reporte.evidencias?.length > 0 && (
          <div className="reporte-evidencias">
            {reporte.evidencias.map((url) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                <img src={url} alt="Evidencia del reporte" />
              </a>
            ))}
          </div>
        )}

        {reporte.escalado && (
          <p className="reporte-motivo-escalado">
            {reporte.escaladoAutomaticamente ? "Escalado automáticamente" : `Escalado por ${reporte.escaladoPor}`}
            {" — "}
            {reporte.motivoEscalado || "sin motivo indicado"}
          </p>
        )}

        {reporte.estado === "PENDIENTE_VALIDACION" && (
          <p className="reporte-motivo-escalado">
            {reporte.resueltoPor} lo marcó como solucionado, esperando validación de un moderador.
          </p>
        )}
      </div>

      <div className="reporte-card-actions">
        <Stack direction="horizontal" gap={2}>
          {puedeValidar && (
            <Button variant="success" size="sm" onClick={() => onValidar(reporte)}>
              <FiCheckCircle /> Validar
            </Button>
          )}
          {!puedeValidar && reporte.estado !== "PENDIENTE_VALIDACION" && (
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => onCambiarEstado(reporte)}
            >
              <FiEdit3 /> Cambiar estado
            </Button>
          )}
          {puedeEscalar && !puedeValidar && !reporte.escalado && reporte.estado !== "PENDIENTE_VALIDACION" && (
            <Button
              variant="outline-dark"
              size="sm"
              onClick={() => onEscalar(reporte)}
            >
              <FiArrowUpCircle /> Escalar
            </Button>
          )}
        </Stack>
      </div>
    </div>
  );
}
