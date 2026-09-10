import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaTicketAlt, FaCopy, FaCheckCircle } from "react-icons/fa";
import {
  canjearPromocion,
  formatearFechaCanje,
  DIAS_VIGENCIA_CANJE,
} from "@/services/canje.service";
import "./CanjearPromocionModal.css";

const CanjearPromocionModal = ({
  show,
  onCerrar,
  promocion,
  spotNombre,
  onCanjeado,
}) => {
  const [canjeando, setCanjeando] = useState(false);
  const [canje, setCanje] = useState(null);
  const [error, setError] = useState(null);

  const manejarCanje = async () => {
    if (!promocion?.id) return;
    setCanjeando(true);
    setError(null);
    const resultado = await canjearPromocion(promocion.id);
    setCanjeando(false);
    if (resultado.exitoso) {
      setCanje(resultado.datos);
      onCanjeado?.(resultado.datos);
      toast.success(resultado.mensaje);
    } else {
      setError(resultado.mensaje);
    }
  };

  const copiarCodigo = async () => {
    if (!canje?.codigo) return;
    await navigator.clipboard.writeText(canje.codigo);
    toast.success("Código copiado");
  };

  const fechaVencimiento = canje?.fechaExpiracion || promocion?.fechaFin;

  return (
    <Modal show={show} onHide={onCerrar} centered className="canjear-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          <FaTicketAlt className="modal-title-icon" />
          {canje ? "¡Promoción canjeada!" : "Canjear promoción"}
        </Modal.Title>
      </Modal.Header>

      {canje ? (
        <>
          <Modal.Body>
            <p className="canjear-ok-text">
              <FaCheckCircle className="canjear-ok-icon" />
              Presenta este código en <strong>{spotNombre}</strong> para
              acceder a la promoción.
            </p>

            <div className="canjear-codigo-caja">
              <code className="canjear-codigo-valor">{canje.codigo}</code>
              <Button
                variant="outline-primary"
                size="sm"
                className="btn-canjear-copiar"
                onClick={copiarCodigo}
              >
                <FaCopy /> Copiar
              </Button>
            </div>

            {fechaVencimiento && (
              <p className="canjear-vencimiento">
                Vence el {formatearFechaCanje(fechaVencimiento)} — úsalo antes
                de esa fecha.
              </p>
            )}

            <div className="canjear-mis-canjes">
              <Link to="/perfil?tab=canjes" className="canjear-enlace">
                Ver todos mis canjes
              </Link>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={onCerrar}>
              Listo
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body>
            {promocion?.titulo && (
              <h3 className="canjear-titulo">{promocion.titulo}</h3>
            )}

            <div className="canjear-detalles">
              {promocion?.descuento && (
                <span className="canjear-descuento">
                  {promocion.descuento} OFF
                </span>
              )}
              {promocion?.usosMaximos ? (
                <span className="canjear-usos">
                  Cupos: {promocion.usos} / {promocion.usosMaximos}
                </span>
              ) : (
                <span className="canjear-usos">Cupos ilimitados</span>
              )}
            </div>

            <p className="canjear-explica">
              Al canjear recibirás un <strong>código único</strong> que deberás
              presentar en {spotNombre} al momento de usar la promoción. El
              código vence en hasta {DIAS_VIGENCIA_CANJE} días o cuando
              termine la promoción, lo que ocurra primero.
            </p>

            {error && <div className="canjear-error">{error}</div>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onCerrar}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={manejarCanje} disabled={canjeando}>
              {canjeando ? "Canjeando..." : "Canjear promoción"}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default CanjearPromocionModal;