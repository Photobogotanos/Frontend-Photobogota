import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Swal from "sweetalert2";
import { FiShield, FiAlertTriangle } from "react-icons/fi";
import { obtenerEstadoEliminacionInfo, MOTIVOS_ELIMINACION_LABEL } from "@/services/admin.service";

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  return new Date(fecha).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ModalGestionEliminacion({
  show,
  solicitud,
  procesando,
  onCerrar,
  onProcesar,
  onRechazar,
}) {
  const [observacion, setObservacion] = useState("");

  useEffect(() => {
    if (solicitud) setObservacion("");
  }, [solicitud]);

  if (!solicitud) return null;

  const estado = obtenerEstadoEliminacionInfo(solicitud.estado);
  const motivoLabel = MOTIVOS_ELIMINACION_LABEL[solicitud.motivo] || solicitud.motivo || "Sin especificar";
  const yaFinalizada = solicitud.estado === "COMPLETADA" || solicitud.estado === "CANCELADA";
  const dep = solicitud.dependencias;

  const handleProcesar = async () => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Procesar esta eliminación ahora?",
      html:
        `Se anonimizarán de inmediato los datos personales de <b>${solicitud.nombreUsuario}</b>, ` +
        "sin esperar el plazo de 30 días. Esta acción resolverá sus dependencias pendientes " +
        "(reportes, spots) y no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, procesar ahora",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#806fbe",
    });
    if (confirmacion.isConfirmed) {
      onProcesar(solicitud.id, observacion.trim() || undefined);
    }
  };

  const handleRechazar = async () => {
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "¿Rechazar esta solicitud?",
      text: `La cuenta de ${solicitud.nombreUsuario} quedará activa nuevamente.`,
      showCancelButton: true,
      confirmButtonText: "Sí, rechazar",
      cancelButtonText: "Volver",
      confirmButtonColor: "var(--color-primary)",
    });
    if (confirmacion.isConfirmed) {
      onRechazar(solicitud.id, observacion.trim() || undefined);
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered size="lg" className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          Solicitud de {solicitud.nombreUsuario}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="elim-detalle-badges">
          <Badge bg="dark">{solicitud.rol}</Badge>
          <Badge bg={estado.variant}>{estado.etiqueta}</Badge>
          {solicitud.identidadVerificada ? (
            <Badge bg="success">
              <FiShield /> Identidad verificada automáticamente
            </Badge>
          ) : (
            <Badge bg="danger">
              <FiAlertTriangle /> No se pudo verificar la identidad
            </Badge>
          )}
        </div>

        <div className="elim-detalle-grid">
          <div>
            <span className="elim-detalle-label">Email</span>
            <p>{solicitud.email}</p>
          </div>
          <div>
            <span className="elim-detalle-label">Motivo</span>
            <p>{motivoLabel}</p>
          </div>
          <div>
            <span className="elim-detalle-label">Fecha de solicitud</span>
            <p>{formatearFecha(solicitud.fechaSolicitud)}</p>
          </div>
          <div>
            <span className="elim-detalle-label">Fecha de confirmación</span>
            <p>{formatearFecha(solicitud.fechaConfirmacion)}</p>
          </div>
          <div>
            <span className="elim-detalle-label">Programada para</span>
            <p>{formatearFecha(solicitud.fechaProgramadaEliminacion)}</p>
          </div>
          <div>
            <span className="elim-detalle-label">Días restantes</span>
            <p>{solicitud.diasRestantes != null ? solicitud.diasRestantes : "—"}</p>
          </div>
        </div>

        {solicitud.comentario && (
          <div className="elim-detalle-comentario">
            <span className="elim-detalle-label">Comentario del usuario</span>
            <p>"{solicitud.comentario}"</p>
          </div>
        )}

        <div className="elim-detalle-dependencias">
          <span className="elim-detalle-label">Dependencias detectadas</span>
          <ul>
            <li>Spots creados: <b>{dep?.spotsCreados ?? 0}</b></li>
            <li>Reportes pendientes presentados por el usuario: <b>{dep?.reportesPendientesComoAutor ?? 0}</b></li>
            <li>Reportes pendientes sobre su contenido: <b>{dep?.reportesPendientesSobreSuContenido ?? 0}</b></li>
          </ul>
          {dep?.tieneDependenciasPendientes && !yaFinalizada && (
            <p className="elim-dependencias-warning">
              <FiAlertTriangle /> Al procesar esta solicitud, estas dependencias se resolverán
              automáticamente (reportes cerrados y notificados, spots reasignados a un creador anónimo).
            </p>
          )}
        </div>

        {solicitud.procesadaManualmente && (
          <p className="elim-ya-procesada">
            Procesada manualmente por <b>{solicitud.procesadaPorAdmin}</b>
            {solicitud.observacionAdmin && <> — "{solicitud.observacionAdmin}"</>}
          </p>
        )}

        {!yaFinalizada && (
          <Form.Group className="mt-3">
            <Form.Label htmlFor="observacion-admin">Nota administrativa (opcional)</Form.Label>
            <Form.Control
              id="observacion-admin"
              as="textarea"
              rows={2}
              maxLength={500}
              placeholder="Ej: verificado manualmente por soporte, disputa resuelta, etc."
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar} disabled={procesando}>
          Cerrar
        </Button>
        {!yaFinalizada && (
          <>
            <Button variant="outline-dark" onClick={handleRechazar} disabled={procesando}>
              Rechazar solicitud
            </Button>
            <Button variant="danger" onClick={handleProcesar} disabled={procesando}>
              {procesando ? "Procesando..." : "Procesar eliminación ahora"}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
