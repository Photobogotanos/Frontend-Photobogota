import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

// Modal para escalar un reporte al siguiente nivel de la cadena
// SOCIO -> MOD -> ADMIN. El motivo es opcional en el backend, pero lo
// pedimos igual para que quede registro de por qué.
export default function ModalEscalar({ show, reporte, siguienteNivelEtiqueta = "un administrador", onCerrar, onConfirmar }) {
  const [motivo, setMotivo] = useState("");

  const handleCerrar = () => {
    setMotivo("");
    onCerrar();
  };

  const handleConfirmar = () => {
    onConfirmar(reporte.id, { motivo: motivo.trim() || undefined });
    setMotivo("");
  };

  return (
    <Modal show={show} onHide={handleCerrar} centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">Escalar a {siguienteNivelEtiqueta}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {reporte && (
          <p className="text-muted mb-3">
            Ticket <strong>{reporte.numeroTicket}</strong> pasará a estar asignado a {siguienteNivelEtiqueta}{" "}
            con gravedad crítica.
          </p>
        )}
        <Form.Group>
          <Form.Label htmlFor="motivo-escalado">Motivo (opcional)</Form.Label>
          <Form.Control
            id="motivo-escalado"
            as="textarea"
            rows={3}
            maxLength={500}
            placeholder={`Explicá por qué este reporte necesita revisión de ${siguienteNivelEtiqueta}...`}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>Cancelar</Button>
        <Button variant="dark" onClick={handleConfirmar}>Confirmar escalamiento</Button>
      </Modal.Footer>
    </Modal>
  );
}
