import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Este modal aparece cuando el moderador hace clic en "Rechazar".
// En vez de rechazar directo, pedimos el motivo primero
// para que quede registrado y el solicitante sepa por qué.
export default function ModalRechazo({ show, onCerrar, onConfirmar }) {
  const [motivo, setMotivo] = useState("");

  // Al confirmar validamos que haya escrito algo — no tiene sentido
  // rechazar sin dar una razón.
  const handleConfirmar = () => {
    if (!motivo.trim()) {
      alert("Debes escribir un motivo de rechazo");
      return;
    }
    onConfirmar(motivo);
    setMotivo("");
  };

  // Al cerrar limpiamos el campo por si el moderador
  // abre el modal de nuevo en otra solicitud.
  const handleCerrar = () => {
    setMotivo("");
    onCerrar();
  };

  return (
    <Modal show={show} onHide={handleCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>Motivo de rechazo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label htmlFor="motivo-rechazo">
            Explica por qué se rechaza esta solicitud:
          </Form.Label>
          <Form.Control
            id="motivo-rechazo"
            as="textarea"
            rows={4}
            placeholder="Ej: Documentación incompleta, RUT vencido..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>Cancelar</Button>
        <Button variant="danger" onClick={handleConfirmar}>Confirmar rechazo</Button>
      </Modal.Footer>
    </Modal>
  );
}