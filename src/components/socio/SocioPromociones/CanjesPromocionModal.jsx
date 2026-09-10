import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Badge, Spinner } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { FaTicketAlt, FaCheckCircle } from "react-icons/fa";
import {
  obtenerCanjesDePromocion,
  validarCanje,
  obtenerEtiquetaEstadoCanje,
  ESTADOS_CANJE,
  formatearFechaCanje,
} from "@/services/canje.service";

const CanjesPromocionModal = ({ show, onCerrar, promocion }) => {
  const [canjes, setCanjes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [validando, setValidando] = useState(false);
  const [ultimoValidado, setUltimoValidado] = useState(null);

  const cargarCanjes = async () => {
    if (!promocion?.id) return;
    setCargando(true);
    const resultado = await obtenerCanjesDePromocion(promocion.id);
    if (resultado.exitoso) {
      setCanjes(resultado.datos || []);
    } else {
      toast.error(resultado.mensaje);
    }
    setCargando(false);
  };

  useEffect(() => {
    // oxlint-disable-next-line react-doctor/no-set-state-after-await-in-effect -- fetch inicial al montar; remount con key reinicia el modal
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cargarCanjes() inicia con setCargando(true); el fetch real es tras await del servicio
    cargarCanjes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const manejarValidar = async () => {
    const codigoLimpio = codigo.trim().toUpperCase();
    if (!codigoLimpio) {
      toast.error("Ingresa el código que te mostró el cliente");
      return;
    }
    const spotId =
      promocion?.spotId ?? promocion?.localId ?? promocion?.spot?.id;
    if (!spotId) {
      toast.error("No se pudo determinar el local de esta promoción");
      return;
    }
    setValidando(true);
    const resultado = await validarCanje({ codigo: codigoLimpio, spotId });
    setValidando(false);
    if (resultado.exitoso) {
      setUltimoValidado(resultado.datos || { codigo: codigoLimpio });
      setCodigo("");
      toast.success("Cobro efectivizado");
      cargarCanjes();
    } else {
      setUltimoValidado(null);
      toast.error(resultado.mensaje);
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered className="canjes-modal">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          <FaTicketAlt className="modal-title-icon" />
          Canjes de la promoción
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {promocion?.titulo && (
          <h3 className="canjes-titulo">{promocion.titulo}</h3>
        )}

        <div className="canjes-validador">
          <label className="canjes-label" htmlFor="codigo-validar">
            Validar código presentado en el local
          </label>
          <div className="canjes-validador-fila">
            <Form.Control
              id="codigo-validar"
              type="text"
              value={codigo}
              onChange={(e) =>
                setCodigo(e.target.value.toUpperCase().slice(0, 12))
              }
              placeholder="Ej: K7F2M9Q3"
              onKeyDown={(e) => {
                if (e.key === "Enter") manejarValidar();
              }}
            />
            <Button
              variant="success"
              onClick={manejarValidar}
              disabled={validando}
            >
              {validando ? "Validando..." : "Validar"}
            </Button>
          </div>
          {ultimoValidado && (
            <div className="canjes-validado-ok">
              <FaCheckCircle /> Código {ultimoValidado.codigo} validado: cobro
              efectivizado.
            </div>
          )}
        </div>

        <div className="canjes-lista">
          <span className="canjes-lista-titulo">Historial de canjes</span>

          {cargando ? (
            <div className="canjes-cargando text-center py-4">
              <Spinner
                animation="border"
                size="sm"
                style={{ color: "#806fbe" }}
              />
            </div>
          ) : canjes.length === 0 ? (
            <p className="canjes-vacio text-muted">
              Aún no hay canjes para esta promoción.
            </p>
          ) : (
            canjes.map((canje) => {
              const variant =
                ESTADOS_CANJE.find((e) => e.valor === canje.estado)?.variant ||
                "secondary";
              return (
                <div key={canje.id} className="canje-linea">
                  <div className="canje-linea-titulos">
                    <code className="canje-linea-codigo">{canje.codigo}</code>
                    {canje.miembroNombre && (
                      <span className="canje-linea-miembro">
                        {canje.miembroNombre}
                      </span>
                    )}
                  </div>
                  <div className="canje-linea-meta">
                    <Badge bg={variant}>
                      {obtenerEtiquetaEstadoCanje(canje.estado)}
                    </Badge>
                    {canje.fechaCanje && (
                      <span>{formatearFechaCanje(canje.fechaCanje)}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCerrar}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CanjesPromocionModal;