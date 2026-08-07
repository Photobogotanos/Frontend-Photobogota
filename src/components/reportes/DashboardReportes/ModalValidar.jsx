import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Modal para que un MOD valide la solución que un SOCIO o un ADMIN
// propusieron (estado PENDIENTE_VALIDACION). Si aprueba, se notifica al
// miembro afectado. Si rechaza, vuelve a EN_REVISION para que quien la
// propuso la revise de nuevo.
export default function ModalValidar({ show, reporte, onCerrar, onConfirmar }) {
  const [observacion, setObservacion] = useState("");

  const handleCerrar = () => {
    setObservacion("");
    onCerrar();
  };

  const handleAprobar = () => {
    onConfirmar(reporte.id, { aprobado: true, observacion: observacion.trim() || undefined });
    setObservacion("");
  };

  const handleRechazar = () => {
    onConfirmar(reporte.id, { aprobado: false, observacion: observacion.trim() || undefined });
    setObservacion("");
  };

  return (
    <Modal show={show} onHide={handleCerrar} centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">Validar solución</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reporte && (
          <p className="text-muted mb-3">
            Ticket <strong>{reporte.numeroTicket}</strong> fue marcado como solucionado por{" "}
            <strong>{reporte.resueltoPor}</strong>. Aprobalo para notificar al miembro afectado, o
            rechazalo para que lo revise de nuevo.
          </p>
        )}

        <Form.Group>
          <Form.Label htmlFor="observacion-validar">Observación (opcional al aprobar, recomendada al rechazar)</Form.Label>
          <Form.Control
            id="observacion-validar"
            as="textarea"
            rows={3}
            maxLength={500}
            placeholder="Dejá una nota sobre esta validación..."
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>Cancelar</Button>
        <Button variant="outline-danger" onClick={handleRechazar}>Rechazar</Button>
        <Button variant="success" onClick={handleAprobar}>Aprobar y notificar</Button>
      </Modal.Footer>
    </Modal>
  );
}
