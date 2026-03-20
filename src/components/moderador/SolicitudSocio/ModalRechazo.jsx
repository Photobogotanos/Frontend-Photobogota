import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function ModalRechazo({ show, onCerrar, onConfirmar }) {
  const [motivo, setMotivo] = useState("");

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      alert("Debes escribir un motivo de rechazo");
      return;
    }
    onConfirmar(motivo);
    setMotivo("");
  };

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
        <Button variant="secondary" onClick={handleCerrar}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={handleConfirmar}>
          Confirmar rechazo
        </Button>
      </Modal.Footer>
    </Modal>
  );
}