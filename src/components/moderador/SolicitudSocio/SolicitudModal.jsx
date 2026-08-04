import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  FiCheck, FiX, FiEdit3, FiUser, FiMail, FiPhone, FiMapPin,
  FiCalendar, FiTag, FiFileText, FiDownload, FiHash, FiSend,
} from "react-icons/fi";
import { getEstadoMeta, estaEnRevision, puedeEnviarCredenciales, formatearFecha } from "@/utils/estadoAspiranteUtils";

// Este componente muestra el detalle completo de una solicitud.
// Incluye el documento adjunto, información del negocio y propietario,
// estado con la decisión tomada, y la sección de comentarios internos.
export default function SolicitudModal({
  show, solicitud, onCerrar, onAprobar, onRechazar, onSolicitarCorreccion, onEnviarCredenciales, onAgregarComentario,
}) {

  // nuevoComentario es local a este componente — solo vive mientras el modal está abierto.
  const [nuevoComentario, setNuevoComentario] = useState("");

  if (!solicitud) return null;

  const { label, variant } = getEstadoMeta(solicitud.estado);
  const enRevision = estaEnRevision(solicitud.estado);
  const listoParaCredenciales = puedeEnviarCredenciales(solicitud.estado);

  // Cuando el moderador envía el comentario, lo pasamos al padre
  // y limpiamos el campo de texto.
  const handleEnviarComentario = () => {
    if (!nuevoComentario.trim()) return;
    onAgregarComentario(solicitud.id, nuevoComentario);
    setNuevoComentario("");
  };

  return (
    <Modal show={show} onHide={onCerrar} size="lg" centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          Detalle de Solicitud - {solicitud.codigo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* Documento adjunto — se puede ver y descargar */}
        <div className="detalle-section">
          <h4>Documentación Adjunta</h4>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {solicitud.rutaArchivo ? (
              <div
                className="d-inline-flex align-items-center px-3 py-2"
                style={{ border: "1px solid #e0e0e0", borderRadius: "50px", backgroundColor: "#fff" }}
              >
                <FiFileText className="me-2 text-muted" />
                <button
                  style={{ fontSize: "0.9rem", fontWeight: "500", color: "#333", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={() => window.open(solicitud.rutaArchivo, "_blank")}
                >
                  {solicitud.tipoArchivo === "pdf" ? "Documento (PDF)" : "Documento (imagen)"}
                </button>
                <a href={solicitud.rutaArchivo} download className="ms-3 text-dark d-flex align-items-center" style={{ textDecoration: "none" }}>
                  <FiDownload style={{ fontSize: "1.1rem" }} />
                </a>
              </div>
            ) : (
              <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>No se adjuntó ningún documento</p>
            )}
          </div>
        </div>

        <div className="solicitud-detalle">

          {/* Información del negocio que quiere ser socio */}
          <div className="detalle-section mt-3">
            <h4>Información del Negocio</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label"><FiTag className="label-icon" /> Categoría:</span>
                <span>{solicitud.categoria}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiMapPin className="label-icon" /> Localidad:</span>
                <span>{solicitud.localidad}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiMapPin className="label-icon" /> Dirección:</span>
                <span>{solicitud.direccion}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiHash className="label-icon" /> NIT:</span>
                <span>{solicitud.nit}</span>
              </div>
            </div>
            <div className="detalle-item full-width">
              <span className="detalle-label">Razón social:</span>
              <p>{solicitud.razonSocial}</p>
            </div>
          </div>

          {/* Datos de contacto del propietario/aspirante */}
          <div className="detalle-section">
            <h4>Información del Aspirante</h4>
            <div className="detalle-grid">
              <div className="detalle-item">
                <span className="detalle-label"><FiUser className="label-icon" /> Nombre:</span>
                <span>{solicitud.nombres} {solicitud.apellidos}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiMail className="label-icon" /> Correo:</span>
                <span>{solicitud.email}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiPhone className="label-icon" /> Teléfono:</span>
                <span>{solicitud.telefono}</span>
              </div>
              <div className="detalle-item">
                <span className="detalle-label"><FiCalendar className="label-icon" /> Fecha de envío:</span>
                <span>{formatearFecha(solicitud.fechaSolicitud)}</span>
              </div>
            </div>
          </div>

          {/* Estado actual de la solicitud con el registro de la decisión */}
          <div className="detalle-section">
            <h4>Estado</h4>
            <Badge bg={variant} className="status">{label}</Badge>

            {solicitud.vecesCorregida > 0 && (
              <div className="mt-2">
                <span className="detalle-label">Veces corregida:</span>
                <span className="ms-2">{solicitud.vecesCorregida}</span>
                {solicitud.fechaReenvio && (
                  <span className="ms-2 text-muted">(último reenvío: {formatearFecha(solicitud.fechaReenvio)})</span>
                )}
              </div>
            )}

            {/* Quién tomó la decisión y cuándo */}
            {solicitud.decididoPor && (
              <div className="mt-2">
                <span className="detalle-label">Decidido por:</span>
                <span className="ms-2">{solicitud.decididoPor}</span>
              </div>
            )}
            {solicitud.fechaDecision && (
              <div className="mt-1">
                <span className="detalle-label">Fecha de decisión:</span>
                <span className="ms-2">{formatearFecha(solicitud.fechaDecision)}</span>
              </div>
            )}

            {/* Si ya se enviaron las credenciales, mostramos cuándo y con qué usuario */}
            {solicitud.nombreUsuarioGenerado && (
              <div className="mt-2">
                <span className="detalle-label">Cuenta de socio creada:</span>
                <span className="ms-2">{solicitud.nombreUsuarioGenerado}</span>
                {solicitud.fechaEnvioCredenciales && (
                  <span className="ms-2 text-muted">({formatearFecha(solicitud.fechaEnvioCredenciales)})</span>
                )}
              </div>
            )}

            {/* El motivo aparece si fue rechazada o devuelta para corrección */}
            {(solicitud.estado === "RECHAZADO" || solicitud.estado === "EN_CORRECCION") && solicitud.motivoDecision && (
              <div className="mt-2">
                <span className="detalle-label">
                  {solicitud.estado === "RECHAZADO" ? "Motivo de rechazo:" : "Correcciones solicitadas:"}
                </span>
                <p className="mt-1">{solicitud.motivoDecision}</p>
              </div>
            )}
          </div>

          {/* Sección de comentarios internos — solo visible para moderadores.
              Los comentarios se guardan con autor y fecha automáticamente. */}
          <div className="detalle-section mt-3">
            <h4>Comentarios internos</h4>

            {solicitud.comentariosInternos && solicitud.comentariosInternos.length > 0 ? (
              <div className="comentarios-lista mb-3">
                {solicitud.comentariosInternos.map((comentario, idx) => (
                  <div
                    key={idx}
                    className="comentario-item p-2 mb-2"
                    style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "3px solid #0d6efd" }}
                  >
                    <div className="d-flex justify-content-between mb-1">
                      <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>{comentario.autor}</span>
                      <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>{formatearFecha(comentario.fecha)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: "0.9rem" }}>{comentario.texto}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "#6c757d", fontSize: "0.9rem" }} className="mb-3">
                No hay comentarios aún
              </p>
            )}

            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Escribe un comentario interno..."
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
            />
            <Button variant="outline-primary" size="sm" className="mt-2" onClick={handleEnviarComentario}>
              Agregar comentario
            </Button>
          </div>

        </div>
      </Modal.Body>

      {/* Los botones de aprobar, rechazar y solicitar corrección solo
          aparecen mientras la solicitud está en revisión */}
      <Modal.Footer>
        {enRevision && (
          <>
            <Button variant="success" onClick={() => onAprobar(solicitud.id)}>
              <FiCheck /> Aprobar Solicitud
            </Button>
            <Button variant="warning" onClick={() => onSolicitarCorreccion(solicitud.id)}>
              <FiEdit3 /> Solicitar corrección
            </Button>
            <Button variant="danger" onClick={() => onRechazar(solicitud.id)}>
              <FiX /> Rechazar Solicitud
            </Button>
          </>
        )}
        {listoParaCredenciales && (
          <Button variant="success" onClick={() => onEnviarCredenciales(solicitud.id)}>
            <FiSend /> Enviar credenciales
          </Button>
        )}
        <Button variant="secondary" onClick={onCerrar}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}
