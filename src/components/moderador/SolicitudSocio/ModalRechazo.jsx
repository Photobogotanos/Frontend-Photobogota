import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";

// Este modal se reutiliza tanto para "Rechazar" como para "Solicitar
// correcciones": en ambos casos necesitamos que el moderador escriba una
// justificación antes de confirmar, para que quede registrada y el
// aspirante sepa exactamente qué pasó / qué debe corregir.
export default function ModalRechazo({
  show,
  onCerrar,
  onConfirmar,
  titulo = "Motivo de rechazo",
  etiqueta = "Explica por qué se rechaza esta solicitud:",
  textoConfirmar = "Confirmar rechazo",
  varianteConfirmar = "danger",
  mensajeValidacion = "Para poder confirmar un rechazo de solicitud, es necesario que des una razón valida",
}) {
  const [motivo, setMotivo] = useState("");

  // Al confirmar validamos que haya escrito algo — no tiene sentido
  // rechazar (o pedir corrección) sin dar una razón.
  const handleConfirmar = () => {
    if (!motivo.trim()) {
      toast(mensajeValidacion, { duration: 6000 });
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
    <Modal show={show} onHide={handleCerrar} centered className="solicitud-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Label htmlFor="motivo-rechazo">{etiqueta}</Form.Label>
          <Form.Control
            id="motivo-rechazo"
            as="textarea"
            rows={4}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCerrar}>Cancelar</Button>
        <Button variant={varianteConfirmar} onClick={handleConfirmar}>{textoConfirmar}</Button>
      </Modal.Footer>
    </Modal>
  );
}
