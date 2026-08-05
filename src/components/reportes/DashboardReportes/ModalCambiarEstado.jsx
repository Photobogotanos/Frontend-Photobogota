import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { ESTADOS_REPORTE } from "@/services/reporte.service";

// Modal para cambiar el estado de un reporte. Si el nuevo estado es
// RESUELTO, avisamos que eso dispara la validación del moderador
// (Etapa 2, punto 4) una vez esté conectado el sistema de notificaciones.
export default function ModalCambiarEstado({ show, reporte, onCerrar, onConfirmar }) {
  const [estado, setEstado] = useState(reporte?.estado || "");
  const [observacion, setObservacion] = useState("");

  const handleCerrar = () => {
    setObservacion("");
    onCerrar();
  };

  const handleConfirmar = () => {
    onConfirmar(reporte.id, { estado, observacion: observacion.trim() || undefined });
  };

  return (
    <Modal show={show} onHide={handleCerrar} centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">Cambiar estado del reporte</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reporte && (
          <p className="text-muted mb-3">
            Ticket <strong>{reporte.numeroTicket}</strong>
          </p>
        )}

        <Form.Group className="mb-3">
          <Form.Label htmlFor="nuevo-estado">Nuevo estado</Form.Label>
          <Form.Select
            id="nuevo-estado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
          >
            {ESTADOS_REPORTE.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.etiqueta}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="observacion-estado">Observación (opcional)</Form.Label>
          <Form.Control
            id="observacion-estado"
            as="textarea"
            rows={3}
            maxLength={500}
            placeholder="Dejá una nota sobre esta decisión..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </Form.Group>

        {estado === "RESUELTO" && (
          <p className="reporte-aviso-notificacion">
            Al marcar como resuelto se debería notificar al moderador para su validación.
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>Cancelar</Button>
        <Button variant="primary" onClick={handleConfirmar}>Guardar estado</Button>
      </Modal.Footer>
    </Modal>
  );
}
