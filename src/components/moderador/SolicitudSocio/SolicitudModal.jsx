import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { FiCheck, FiX, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiTag, FiFileText, FiDownload } from "react-icons/fi";

// Igual que en SolicitudCard, estas funciones convierten
// el estado en color y texto legible para el moderador.
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

// Este componente muestra el detalle completo de una solicitud.
// Incluye documentos, información del negocio y propietario,
// estado con decisión, y la sección de comentarios internos.
export default function SolicitudModal({ show, solicitud, onCerrar, onAprobar, onRechazar, onAgregarComentario }) {

  // nuevoComentario es local a este componente — solo vive mientras el modal está abierto.
  const [nuevoComentario, setNuevoComentario] = useState("");

  // Cuando el moderador envía el comentario, lo pasamos al padre
  // y limpiamos el campo de texto.
  const handleEnviarComentario = () => {
    if (!nuevoComentario.trim()) return;
    onAgregarComentario(solicitud.solicitudId, nuevoComentario);
    setNuevoComentario("");
  };

  return (
    <Modal show={show} onHide={onCerrar} size="lg" centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          Detalle de Solicitud - {solicitud?.solicitudId}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* Documentos adjuntos — se pueden ver y descargar */}
        <div className="detalle-section">
          <h4>Documentación Adjunta</h4>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {solicitud?.documentos?.map((doc) => (
              <div
                key={doc.nombre}
                className="d-inline-flex align-items-center px-3 py-2"
                style={{ border: "1px solid #e0e0e0", borderRadius: "50px", backgroundColor: "#fff", cursor: "pointer" }}
              >
                <FiFileText className="me-2 text-muted" />
                <button
                  style={{ fontSize: "0.9rem", fontWeight: "500", color: "#333", background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  onClick={() => window.open(doc.url, "_blank")}
                >
                  {doc.nombre || "cedula.pdf"}
                </button>
                <a href={doc.url} download={doc.nombre} className="ms-3 text-dark d-flex align-items-center" style={{ textDecoration: "none" }}>
                  <FiDownload style={{ fontSize: "1.1rem" }} />
                </a>
              </div>
            ))}
          </div>
        </div>

        {solicitud && (
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
                  <span className="detalle-label"><FiMapPin className="label-icon" /> Dirección:</span>
                  <span>{solicitud.direccion}</span>
                </div>
              </div>
              <div className="detalle-item full-width">
                <span className="detalle-label">Descripción:</span>
                <p>{solicitud.descripcion}</p>
              </div>
            </div>

            {/* Datos de contacto del propietario */}
            <div className="detalle-section">
              <h4>Información del Propietario</h4>
              <div className="detalle-grid">
                <div className="detalle-item">
                  <span className="detalle-label"><FiUser className="label-icon" /> Nombre:</span>
                  <span>{solicitud.propietario}</span>
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
                  <span>{solicitud.fechaEnvio}</span>
                </div>
              </div>
            </div>

            {/* Estado actual de la solicitud con el registro de la decisión */}
            <div className="detalle-section">
              <h4>Estado</h4>
              <Badge bg={getBadgeVariant(solicitud.estado)} className="status">
                {getEstadoLabel(solicitud.estado)}
              </Badge>

              {/* Quién tomó la decisión y cuándo */}
              {solicitud.decisionPor && (
                <div className="mt-2">
                  <span className="detalle-label">
                    {solicitud.estado === "aprobada" ? "Aprobada por:" : "Rechazada por:"}
                  </span>
                  <span className="ms-2">{solicitud.decisionPor}</span>
                </div>
              )}
              {solicitud.decisionFecha && (
                <div className="mt-1">
                  <span className="detalle-label">Fecha de decisión:</span>
                  <span className="ms-2">{solicitud.decisionFecha}</span>
                </div>
              )}

              {/* El motivo solo aparece si fue rechazada */}
              {solicitud.estado === "rechazada" && solicitud.motivoRechazo && (
                <div className="mt-2">
                  <span className="detalle-label">Motivo de rechazo:</span>
                  <p className="mt-1">{solicitud.motivoRechazo}</p>
                </div>
              )}
            </div>

            {/* Sección de comentarios internos — solo visible para moderadores.
                Los comentarios se guardan con autor y fecha automáticamente. */}
            <div className="detalle-section mt-3">
              <h4>Comentarios internos</h4>

              {solicitud.comentarios && solicitud.comentarios.length > 0 ? (
                <div className="comentarios-lista mb-3">
                  {solicitud.comentarios.map((comentario, i) => (
                    <div
                      key={i}
                      className="comentario-item p-2 mb-2"
                      style={{ backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "3px solid #0d6efd" }}
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span style={{ fontWeight: "500", fontSize: "0.85rem" }}>{comentario.autor}</span>
                        <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>{comentario.fecha}</span>
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
        )}
      </Modal.Body>

      {/* Los botones de aprobar y rechazar solo aparecen si la solicitud está pendiente */}
      <Modal.Footer>
        {solicitud?.estado === "pendiente" && (
          <>
            <Button variant="success" onClick={() => { onAprobar(solicitud.solicitudId); onCerrar(); }}>
              <FiCheck /> Aprobar Solicitud
            </Button>
            <Button variant="danger" onClick={() => { onRechazar(solicitud.solicitudId); onCerrar(); }}>
              <FiX /> Rechazar Solicitud
            </Button>
          </>
        )}
        <Button variant="secondary" onClick={onCerrar}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
}