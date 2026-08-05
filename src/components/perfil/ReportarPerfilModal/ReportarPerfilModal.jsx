import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { FiFlag, FiFileText } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { reportarUsuario } from "@/services/reporte.service";
import "./ReportarPerfilModal.css";

// Motivos de reporte para perfil. El backend solo expone el enum
// CategoriaReporte (CONTENIDO_OFENSIVO, SPAM, INFORMACION_INCORRECTA,
// ERROR_TECNICO, PROBLEMA_SPOT), así que cada motivo del UI se mapea al
// valor más cercano para no forzar un 400 en el envío. "Otro", "Suplantación"
// y "Acoso" usan la categoría más cercana disponible y la descripción
// libre del usuario aporta el detalle. (Gap documentado: no hay categoría
// exacta por motivos de usuario en el backend actual.)
const MOTIVOS_REPORTE_PERFIL = [
  {
    valor: "suplantacion",
    etiqueta: "Suplantación / cuenta falsa",
    categoria: "INFORMACION_INCORRECTA",
  },
  {
    valor: "contenido_inapropiado",
    etiqueta: "Contenido inapropiado",
    categoria: "CONTENIDO_OFENSIVO",
  },
  {
    valor: "spam_fraude",
    etiqueta: "Spam o fraude",
    categoria: "SPAM",
  },
  {
    valor: "acoso",
    etiqueta: "Acoso",
    categoria: "CONTENIDO_OFENSIVO",
  },
  {
    valor: "otro",
    etiqueta: "Otro",
    categoria: "INFORMACION_INCORRECTA",
  },
];

const MAX_DESCRIPCION = 500;

function ReportarFormulario({ perfilData, onHide }) {
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [enviando, setEnviando] = useState(false);

  const motivoActual = MOTIVOS_REPORTE_PERFIL.find((m) => m.valor === motivo);
  const descripcionEsObligatoria = motivo === "otro";

  const handleEnviar = async (e) => {
    e.preventDefault();

    if (!motivo) {
      toast.error("Selecciona un motivo para el reporte");
      return;
    }
    if (descripcionEsObligatoria && !descripcion.trim()) {
      toast.error("Completá la descripción para enviar el reporte");
      return;
    }

    setEnviando(true);
    try {
      const resultado = await reportarUsuario(perfilData?.nombreUsuario, {
        categoria: motivoActual.categoria,
        descripcion: descripcion.trim(),
      });

      if (!resultado.exitoso) {
        toast.error(resultado.mensaje);
        return;
      }

      toast.success(resultado.mensaje || "Reporte enviado correctamente");
      onHide();
    } catch {
      toast.error("No se pudo enviar el reporte. Intentá más tarde.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      {/* HEADER: misma familia visual de EditarPerfilModal */}
      <Modal.Header closeButton className="modal-header-custom">
        <div className="modal-title-custom">
          <span className="mh-icon-box">
            <FiFlag />
          </span>
          Reportar perfil
        </div>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        <p className="reportar-subtexto">
          {perfilData?.nombreUsuario
            ? `Estás reportando el perfil de @${perfilData.nombreUsuario}.`
            : "Estás reportando este perfil."}{" "}
          La moderación revisará tu reporte y tomará las acciones
          correspondientes.
        </p>

        <Form onSubmit={handleEnviar} noValidate>
          {/* ══ MOTIVO ═════════════════════════════════════════ */}
          <div className="form-block">
            <div className="block-heading">
              <FiFlag className="bh-icon" />
              <span>Motivo</span>
            </div>
            <div className="fgroup">
              <label htmlFor="motivo" className="flabel">
                ¿Por qué reportás este perfil?
              </label>
              <Form.Select
                id="motivo"
                className="finput"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                disabled={enviando}
                aria-required
              >
                <option value="" disabled>
                  Selecciona un motivo
                </option>
                {MOTIVOS_REPORTE_PERFIL.map((m) => (
                  <option key={m.valor} value={m.valor}>
                    {m.etiqueta}
                  </option>
                ))}
              </Form.Select>
            </div>
          </div>

          <div className="block-sep" />

          {/* ══ DESCRIPCIÓN ════════════════════════════════════ */}
          <div className="form-block">
            <div className="block-heading">
              <FiFileText className="bh-icon" />
              <span>Descripción</span>
            </div>
            <div className="fgroup">
              <label htmlFor="descripcion" className="flabel">
                Detalles
                {descripcionEsObligatoria
                  ? " (obligatoria para 'Otro')"
                  : " (opcional)"}
              </label>
              <Form.Control
                id="descripcion"
                as="textarea"
                rows={3}
                className="finput ftextarea"
                placeholder="Cuéntanos qué pasó..."
                maxLength={MAX_DESCRIPCION}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={enviando}
              />
              <span className="char-hint">
                {descripcion.length}/{MAX_DESCRIPCION}
              </span>
            </div>
          </div>

          {/* ACCIONES: al estilo BotonesAccion (Cancelar + primario) */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancelar"
              onClick={onHide}
              disabled={enviando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-guardar"
              disabled={enviando || !motivo}
            >
              {enviando ? "Enviando..." : "Enviar reporte"}
            </button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}

export default function ReportarPerfilModal({ show, onHide, perfilData }) {
  return (
    <Modal
      key={
        show
          ? `reportar-perfil-${perfilData?.nombreUsuario || "open"}`
          : "reportar-perfil-closed"
      }
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="reportar-perfil-modal"
    >
      {show && (
        <ReportarFormulario perfilData={perfilData} onHide={onHide} />
      )}
    </Modal>
  );
}
