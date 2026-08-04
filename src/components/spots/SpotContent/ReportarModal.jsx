import { useState, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import {
  FaFlag,
  FaPaperclip,
  FaTimes,
  FaCheckCircle,
  FaCopy,
} from "react-icons/fa";
import {
  CATEGORIAS_REPORTE,
  subirEvidenciasReporte,
  crearReporte,
  reportarUsuario,
} from "@/services/reporte.service";
import "./ReportarModal.css";

const MAX_DESCRIPCION = 1000;
const MAX_EVIDENCIAS = 3;

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
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const [ticket, setTicket] = useState(null);
  const inputFileRef = useRef(null);

  const esReporteDeResena = Boolean(resenaId);
  const esReporteDeUsuario = Boolean(usuarioAReportar);

  const resetearEstado = () => {
    setCategoria("");
    setDescripcion("");
    setArchivos([]);
    setEnviando(false);
    setTicket(null);
    if (inputFileRef.current) inputFileRef.current.value = "";
  };

  const handleCerrar = () => {
    resetearEstado();
    onCerrar();
  };

  const handleAgregarArchivos = (e) => {
    const nuevos = Array.from(e.target.files || []);
    if (archivos.length + nuevos.length > MAX_EVIDENCIAS) {
      toast.error(`Puedes adjuntar máximo ${MAX_EVIDENCIAS} capturas`);
      return;
    }

    const invalidos = nuevos.filter((f) => !f.type.startsWith("image/"));
    if (invalidos.length > 0) {
      toast.error("Solo se permiten imágenes (capturas de pantalla)");
      return;
    }

    const muyPesados = nuevos.filter((f) => f.size > 5 * 1024 * 1024);
    if (muyPesados.length > 0) {
      toast.error("Cada captura debe pesar máximo 5MB");
      return;
    }

    setArchivos((prev) => [...prev, ...nuevos]);
    e.target.value = "";
  };

  const quitarArchivo = (index) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleEnviar = async () => {
    if (!categoria) {
      toast.error("Selecciona una categoría para el reporte");
      return;
    }
    if (!descripcion.trim()) {
      toast.error("Describe brevemente el problema");
      return;
    }

    setEnviando(true);

    let evidencias = [];
    if (archivos.length > 0) {
      const resultadoEvidencia = await subirEvidenciasReporte(archivos);
      if (!resultadoEvidencia.exitoso) {
        toast.error(resultadoEvidencia.mensaje);
        setEnviando(false);
        return;
      }
      evidencias = resultadoEvidencia.urls;
    }

    const resultado = esReporteDeUsuario
      ? await reportarUsuario(usuarioAReportar, {
          categoria,
          descripcion: descripcion.trim(),
          evidencias,
        })
      : await crearReporte({
          categoria,
          descripcion: descripcion.trim(),
          spotId: spotId || undefined,
          resenaId: resenaId || undefined,
          evidencias,
        });

    setEnviando(false);

    if (resultado.exitoso) {
      setTicket(resultado.datos.numeroTicket);
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const copiarTicket = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket);
    toast.success("Número de ticket copiado");
  };

  return (
    <Modal
      show={show}
      onHide={handleCerrar}
      centered
      className="reportar-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title className="modal-title-top">
          <FaFlag className="modal-title-icon" />
          {ticket ? "Reporte enviado" : "Reportar"}
        </Modal.Title>
      </Modal.Header>

      {ticket ? (
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
            <Button variant="secondary" onClick={handleCerrar}>
              Cerrar
            </Button>
          </Modal.Footer>
        </>
      ) : (
        <>
          <Modal.Body>
          {esReporteDeResena && (
            <div className="reportar-contexto">
              Estás reportando la reseña de{" "}
              <strong>{nombreAutorResena}</strong>
            </div>
          )}

          {esReporteDeUsuario && (
            <div className="reportar-contexto">
              Estás reportando el perfil de{" "}
              <strong>@{usuarioAReportar}</strong>
            </div>
          )}

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS_REPORTE.map((c) => (
                  <option key={c.valor} value={c.valor}>
                    {c.etiqueta}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                maxLength={MAX_DESCRIPCION}
                placeholder="Cuéntanos qué pasó..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
              <span className="descripcion-contador">
                {descripcion.length}/{MAX_DESCRIPCION}
              </span>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Evidencia (opcional)</Form.Label>
              <div className="evidencia-uploader">
                <button
                  type="button"
                  className="btn-adjuntar-evidencia"
                  onClick={() => inputFileRef.current?.click()}
                  disabled={archivos.length >= MAX_EVIDENCIAS}
                >
                  <FaPaperclip className="btn-icon" />
                  Adjuntar captura
                </button>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleAgregarArchivos}
                />
                <span className="evidencia-hint">
                  Hasta {MAX_EVIDENCIAS} imágenes, 5MB c/u
                </span>
              </div>

              {archivos.length > 0 && (
                <div className="evidencia-previews">
                  {archivos.map((file, index) => (
                    <div className="evidencia-preview" key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Evidencia ${index + 1}`}
                      />
                      <button
                        type="button"
                        className="btn-quitar-evidencia"
                        onClick={() => quitarArchivo(index)}
                        aria-label="Quitar imagen"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCerrar}>
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleEnviar}
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Enviar reporte"}
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ReportarModal;
