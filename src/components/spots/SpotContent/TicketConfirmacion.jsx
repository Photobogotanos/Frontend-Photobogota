import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { FaCheckCircle, FaCopy } from "react-icons/fa";
import { toast } from "react-hot-toast";

const TicketConfirmacion = ({ ticket, onCerrar }) => {
  const copiarTicket = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket);
    toast.success("Número de ticket copiado");
  };

  return (
    <>
      <Modal.Body className="reportar-confirmacion">
        <FaCheckCircle className="confirmacion-icono" />
        <p className="confirmacion-texto">
          Gracias, tu reporte fue enviado y quedará asignado al equipo
          correspondiente para su revisión.
        </p>
        <div className="ticket-box">
          <span className="ticket-label">Número de ticket</span>
          <div className="ticket-valor-fila">
            <span className="ticket-valor">{ticket}</span>
            <button
              type="button"
              className="btn-copiar-ticket"
              onClick={copiarTicket}
              aria-label="Copiar número de ticket"
            >
              <FaCopy />
            </button>
          </div>
        </div>
        <p className="confirmacion-nota">
          Guarda este número para hacer seguimiento a tu reporte.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>
          Cerrar
        </Button>
      </Modal.Footer>
    </>
  );
};

export default TicketConfirmacion;
