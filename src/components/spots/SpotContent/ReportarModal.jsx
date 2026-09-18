import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { FaFlag } from "react-icons/fa";
import TicketConfirmacion from "./TicketConfirmacion";
import ReportarFormulario from "./ReportarFormulario";
import "./ReportarModal.css";

// Popup para reportar una reseña o un spot. Se puede abrir desde una reseña
// puntual (pasando resenaId/nombreAutorResena) o desde el spot en general
// (solo con spotId). El backend hoy solo acepta spotId, así que cuando el
// reporte viene de una reseña puntual dejamos esa referencia visible en el
// modal y la anteponemos a la descripción para que quede trazable para
// moderación.
//
// También admite un `usuarioAReportar` (nombreUsuario) para reportar el
// perfil de otro usuario. No existe endpoint dedicado, por lo que se reenvía
// a POST /reportes con spotId/resenaId en undefined y el nombre de usuario
// como contexto en la descripción (ver reportarUsuario en reporte.service).

const ReportarModal = ({
  show,
  onCerrar,
  spotId,
  resenaId = null,
  nombreAutorResena = null,
  usuarioAReportar = null,
}) => {
  const [ticket, setTicket] = useState(null);

  const handleCerrar = () => {
    setTicket(null);
    onCerrar();
  };

  return (
    <Modal
      show={show}
      onHide={handleCerrar}
      centered
      className="reportar-modal"
    >
      <Modal.Header closeButton className="reportar-header">
        <Modal.Title className="reportar-title">
          <span className="reportar-title-icon">
            <FaFlag />
          </span>
          {ticket ? "Reporte enviado" : "Reportar"}
        </Modal.Title>
      </Modal.Header>

      {ticket ? (
        <TicketConfirmacion ticket={ticket} onCerrar={handleCerrar} />
      ) : (
        show && (
          <ReportarFormulario
            spotId={spotId}
            resenaId={resenaId}
            nombreAutorResena={nombreAutorResena}
            usuarioAReportar={usuarioAReportar}
            onTicket={setTicket}
            onCerrar={handleCerrar}
          />
        )
      )}
    </Modal>
  );
};

export default ReportarModal;
