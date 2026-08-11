import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import toast from "react-hot-toast";
import "./ResolverApelacionModal.css";

const ResolverApelacionModal = ({
  mostrar,
  aprobar,
  nombreUsuario,
  onCerrar,
  onConfirmar,
}) => {
  const [respuesta, setRespuesta] = useState("");
  const [guardando, setGuardando] = useState(false);

  const manejarConfirmar = async (e) => {
    e.preventDefault();
    if (!respuesta.trim()) {
      toast.error("Debes escribir una respuesta para el usuario");
      return;
    }
    setGuardando(true);
    await onConfirmar(respuesta.trim());
    setGuardando(false);
  };

  return (
    <Modal show={mostrar} onHide={onCerrar} centered>
      <Form onSubmit={manejarConfirmar}>
        <Modal.Header closeButton>
          <Modal.Title>
            {aprobar ? "Aprobar apelación" : "Rechazar apelación"} — @{nombreUsuario}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-muted small">
            {aprobar
              ? "Al aprobar, se eliminará la sanción y la cuenta será reactivada."
              : "Al rechazar, se mantendrá la suspensión indefinida."}
          </p>
          <Form.Group>
            <Form.Label>
              Respuesta para el usuario <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder="Explica la decisión..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant={aprobar ? "success" : "danger"} disabled={guardando}>
            {guardando && <Spinner as="span" animation="border" size="sm" className="me-1" />}
            {aprobar ? "Aprobar y reactivar" : "Rechazar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ResolverApelacionModal;
