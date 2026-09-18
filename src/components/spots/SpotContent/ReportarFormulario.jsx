import { useState, useRef, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { toast } from "react-hot-toast";
import {
  FaFlag,
  FaPaperclip,
  FaTimes,
  FaExclamationTriangle,
  FaAlignLeft,
  FaImage,
  FaPaperPlane,
} from "react-icons/fa";
import {
  CATEGORIAS_REPORTE,
  subirEvidenciasReporte,
  crearReporte,
  reportarUsuario,
} from "@/services/reporte.service";

const MAX_DESCRIPCION = 1000;
const MAX_EVIDENCIAS = 3;

const esUrlSegura = (url) => {
  return (
    typeof url === "string" &&
    (url.startsWith("blob:") || url.startsWith("data:image/"))
  );
};

// Formulario de reporte. Se monta solo cuando el modal está visible, por lo
// que su estado se reinicia al cerrar/reabrir. Al enviar con éxito avisa al
// padre con el número de ticket mediante `onTicket`.
const ReportarFormulario = ({
  spotId,
  resenaId = null,
  nombreAutorResena = null,
  usuarioAReportar = null,
  onTicket,
  onCerrar,
}) => {
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [enviando, setEnviando] = useState(false);
  const inputFileRef = useRef(null);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => {
        if (preview?.url) URL.revokeObjectURL(preview.url);
      });
      previewsRef.current = [];
    };
  }, []);

  const esReporteDeResena = Boolean(resenaId);
  const esReporteDeUsuario = Boolean(usuarioAReportar);

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

    const nuevosPreviews = nuevos.map((f) => {
      // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke -- se revoca en quitarArchivo y en unmount (previewsRef)
      const url = URL.createObjectURL(f);
      return { file: f, url };
    });
    setPreviews((prev) => [...prev, ...nuevosPreviews]);
    setArchivos((prev) => [...prev, ...nuevos]);
    e.target.value = "";
  };

  const quitarArchivo = (index) => {
    const preview = previews[index];
    if (preview?.url) {
      URL.revokeObjectURL(preview.url);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
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
      onTicket(resultado.datos.numeroTicket);
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <>
      <Modal.Body className="reportar-body">
        {esReporteDeResena && (
          <div className="reportar-contexto">
            <FaFlag className="reportar-contexto-icono" />
            <span>
              Estás reportando la reseña de{" "}
              <strong>{nombreAutorResena}</strong>
            </span>
          </div>
        )}

        {esReporteDeUsuario && (
          <div className="reportar-contexto">
            <FaFlag className="reportar-contexto-icono" />
            <span>
              Estás reportando el perfil de <strong>@{usuarioAReportar}</strong>
            </span>
          </div>
        )}

        <div className="reportar-block">
          <div className="reportar-block-heading">
            <FaExclamationTriangle />
            <span>Categoría</span>
          </div>
          <Form.Group>
            <Form.Label className="reportar-label">
              ¿Qué estás reportando?
            </Form.Label>
            <Form.Select
              className="reportar-input"
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
        </div>

        <div className="reportar-sep" />

        <div className="reportar-block">
          <div className="reportar-block-heading">
            <FaAlignLeft />
            <span>Descripción</span>
          </div>
          <Form.Group>
            <Form.Label className="reportar-label">Cuéntanos qué pasó</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              maxLength={MAX_DESCRIPCION}
              placeholder="Cuéntanos qué pasó..."
              className="reportar-input reportar-textarea"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
            <span className="descripcion-contador">
              {descripcion.length}/{MAX_DESCRIPCION}
            </span>
          </Form.Group>
        </div>

        <div className="reportar-sep" />

        <div className="reportar-block">
          <div className="reportar-block-heading">
            <FaImage />
            <span>Evidencia (opcional)</span>
          </div>
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
                <div
                  className="evidencia-preview"
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                >
                  <img
                    src={
                      previews[index]?.url &&
                      previews[index].url.startsWith("blob:") &&
                      esUrlSegura(previews[index].url)
                        ? previews[index].url
                        : ""
                    }
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
        </div>
      </Modal.Body>
      <Modal.Footer className="reportar-actions">
        <button
          type="button"
          className="btn-reportar-cancelar"
          onClick={onCerrar}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn-reportar-enviar"
          onClick={handleEnviar}
          disabled={enviando}
        >
          <FaPaperPlane />
          {enviando ? "Enviando..." : "Enviar reporte"}
        </button>
      </Modal.Footer>
    </>
  );
};

export default ReportarFormulario;
