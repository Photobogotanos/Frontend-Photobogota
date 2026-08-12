import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import { FaExclamationTriangle, FaPaperPlane, FaPause, FaStop, FaUserSlash } from "react-icons/fa";
import { apelarMiBan } from "@/services/moderacion.service";
import "./ModalSancion.css";

const DETALLES = {
  NOTIFICACION: {
    titulo: "Aviso de moderación",
    descripcion: "Tu contenido no se publicó por una primera advertencia del sistema.",
    variant: "warning",
  },
  MUTE: {
    titulo: "Has sido silenciado",
    descripcion:
      "No puedes publicar contenido mientras dure el silencio. Si crees que es un error, puedes enviar una apelación.",
    variant: "warning",
  },
  SUSPENSION: {
    titulo: "Tu cuenta está suspendida temporalmente",
    descripcion:
      "No puedes publicar contenido mientras dure la suspensión. Si crees que es un error, puedes enviar una apelación.",
    variant: "danger",
  },
  BAN: {
    titulo: "Tu cuenta está suspendida",
    descripcion:
      "No puedes publicar contenido. Puedes enviar una apelación para que un administrador revise tu caso.",
    variant: "danger",
  },
};

const formatearFecha = (fechaIso) => {
  if (!fechaIso) return "";
  try {
    return new Date(fechaIso).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return fechaIso;
  }
};

export default function ModalSancion({ sancion, show, onCerrar, onVerEstado }) {
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [apelacionEnviada, setApelacionEnviada] = useState(false);

  if (!sancion) return null;

  const tipo = sancion.tipo;
  const esBan = tipo === "BAN";
  const esSancionBloqueante = tipo !== "NOTIFICACION";
  // MUTE, SUSPENSION y BAN son apelables; si el backend ya informa
  // "puedeApelar", se respeta ese valor.
  const puedeApelar =
    sancion.puedeApelar !== undefined
      ? Boolean(sancion.puedeApelar)
      : ["MUTE", "SUSPENSION", "BAN"].includes(tipo);
  const info = DETALLES[tipo] || DETALLES.NOTIFICACION;

  const manejarApelar = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) return;
    setEnviando(true);
    const resultado = await apelarMiBan({ motivo: motivo.trim() });
    setEnviando(false);
    if (resultado.exitoso) {
      setApelacionEnviada(true);
      setMotivo("");
      toast.success(resultado.mensaje);
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <Modal show={show} onHide={onCerrar} centered className="modal-sancion">
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          <span className={`ms-icono ms-icono-${info.variant}`}>
            {esBan ? <FaUserSlash /> : tipo === "SUSPENSION" ? <FaStop /> : tipo === "MUTE" ? <FaPause /> : <FaExclamationTriangle />}
          </span>
          {info.titulo}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="ms-descripcion">{info.descripcion}</p>

        {sancion.palabrasDetectadas?.length > 0 && (
          <p className="ms-castigo">
            Tu reseña fue rechazada por contener lenguaje inapropiado:{" "}
            <strong>{sancion.palabrasDetectadas.join(", ")}</strong>.
          </p>
        )}

        {sancion.mensaje && <p className="ms-mensaje">{sancion.mensaje}</p>}

        {esSancionBloqueante && (
          <p className="ms-detalle">
            {esBan ? (
              <>
                Tu cuenta queda suspendida <b>indefinidamente</b>.
              </>
            ) : (
              <>
                Vuelve a la normalidad el{" "}
                <b>{formatearFecha(sancion.fechaExpiracion) || "cuando expire la sanción"}</b>.
              </>
            )}
          </p>
        )}

        {sancion.contadorInfracciones != null && (
          <p className="ms-detalle">
            Infracciones registradas: <b>{sancion.contadorInfracciones}</b>
          </p>
        )}

        {puedeApelar && !apelacionEnviada && (
          <Form onSubmit={manejarApelar} className="ms-form">
            <Form.Label className="ms-label" htmlFor="motivo-apelacion">
              Motivo de la apelación
            </Form.Label>
            <Form.Control
              as="textarea"
              id="motivo-apelacion"
              rows={4}
              maxLength={600}
              placeholder="Explica por qué crees que la suspensión es un error..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="danger" disabled={enviando}>
                <FaPaperPlane /> {enviando ? "Enviando..." : "Enviar apelación"}
              </Button>
            </div>
          </Form>
        )}

        {puedeApelar && apelacionEnviada && (
          <p className="ms-success">
            Tu apelación fue enviada. Un administrador la revisará y te notificará la
            decisión.
          </p>
        )}
      </Modal.Body>

      <Modal.Footer>
        {esSancionBloqueante && (
          <Button variant="danger" onClick={onVerEstado}>
            Ver estado de mi cuenta
          </Button>
        )}
        <Button variant="secondary" onClick={onCerrar}>
          Entendido
        </Button>
      </Modal.Footer>
    </Modal>
  );
}