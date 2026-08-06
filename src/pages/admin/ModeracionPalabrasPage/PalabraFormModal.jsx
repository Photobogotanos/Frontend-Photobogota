import { useEffect, useReducer, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Select from "react-select";
import { FaPlus, FaEdit, FaBan } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import toast from "react-hot-toast";
import {
  crearPalabraProhibida,
  actualizarPalabraProhibida,
} from "@/services/moderacion.service";
import "./PalabraFormModal.css";

const TIPO_OPCIONES = [
  { value: "PALABRA", label: "Palabra (coincidencia exacta)" },
  { value: "FRASE", label: "Frase (dentro del texto)" },
];

const CATEGORIA_OPCIONES = [
  { value: "OFENSIVO", label: "Ofensivo" },
  { value: "SPAM", label: "Spam" },
  { value: "OTRO", label: "Otro" },
];

const FORM_INICIAL = {
  texto: "",
  tipo: "PALABRA",
  categoria: "OFENSIVO",
  activo: true,
  excepciones: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "INICIALIZAR":
      return action.form;
    case "CAMBIAR":
      return { ...state, [action.campo]: action.valor };
    default:
      return state;
  }
}

const PalabraFormModal = ({ mostrar, onCerrar, palabra, onGuardado }) => {
  const esEdicion = Boolean(palabra?.id);

  const [form, dispatch] = useReducer(formReducer, FORM_INICIAL);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!mostrar) return;
    /* eslint-disable react-hooks/set-state-in-effect -- sincronizar el formulario al abrir el modal */
    dispatch({
      type: "INICIALIZAR",
      form: {
        texto: palabra?.texto || "",
        tipo: palabra?.tipo || "PALABRA",
        categoria: palabra?.categoria || "OFENSIVO",
        activo: palabra?.activo ?? true,
        excepciones: (palabra?.excepciones || []).join("\n"),
      },
    });
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [mostrar, palabra]);

  const manejarGuardar = async (e) => {
    e.preventDefault();
    if (!form.texto.trim()) {
      toast.error("El texto es obligatorio");
      return;
    }
    setGuardando(true);
    const body = {
      texto: form.texto.trim(),
      tipo: form.tipo,
      categoria: form.categoria,
      activo: form.activo,
      excepciones: form.excepciones
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const resultado = esEdicion
      ? await actualizarPalabraProhibida(palabra.id, body)
      : await crearPalabraProhibida(body);

    setGuardando(false);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      onGuardado();
      onCerrar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <Modal show={mostrar} onHide={onCerrar} centered className="palabra-form-modal">
      <Modal.Header closeButton className="modal-header-custom">
        <div className="modal-title-custom">
          <span className="mh-icon-box">{esEdicion ? <FaEdit /> : <FaPlus />}</span>
          {esEdicion ? "Editar regla" : "Nueva regla"}
        </div>
      </Modal.Header>

      <Form onSubmit={manejarGuardar}>
        <Modal.Body className="modal-body-custom">
          <div className="form-block">
            <div className="block-heading">
              <FaBan className="bh-icon" />
              <span>{esEdicion ? "Datos de la regla" : "Información de la regla"}</span>
            </div>

            <div className="fgroup mb-3">
              <label htmlFor="palabra-texto" className="flabel">
                Texto <span className="text-danger">*</span>
              </label>
              <Form.Control
                id="palabra-texto"
                type="text"
                value={form.texto}
                onChange={(e) =>
                  dispatch({ type: "CAMBIAR", campo: "texto", valor: e.target.value })
                }
                className="finput"
                placeholder={
                  form.tipo === "FRASE"
                    ? "Ej: compra seguidores"
                    : "Ej: palabra prohibida"
                }
              />
              <span className="char-hint">Se detecta ignorando mayúsculas y tildes.</span>
            </div>

            <div className="fgroup mb-3">
              <label htmlFor="palabra-tipo" className="flabel">
                Tipo
              </label>
              <Select
                inputId="palabra-tipo"
                classNamePrefix="spot-select"
                options={TIPO_OPCIONES}
                value={TIPO_OPCIONES.find((o) => o.value === form.tipo)}
                onChange={(opcion) =>
                  dispatch({
                    type: "CAMBIAR",
                    campo: "tipo",
                    valor: opcion ? opcion.value : "PALABRA",
                  })
                }
                placeholder="Selecciona el tipo"
              />
            </div>

            <div className="fgroup mb-3">
              <label htmlFor="palabra-categoria" className="flabel">
                Categoría
              </label>
              <Select
                inputId="palabra-categoria"
                classNamePrefix="spot-select"
                options={CATEGORIA_OPCIONES}
                value={CATEGORIA_OPCIONES.find((o) => o.value === form.categoria)}
                onChange={(opcion) =>
                  dispatch({
                    type: "CAMBIAR",
                    campo: "categoria",
                    valor: opcion ? opcion.value : "OFENSIVO",
                  })
                }
                placeholder="Selecciona la categoría"
              />
            </div>

            <div className="fgroup mb-3">
              <label htmlFor="palabra-excepciones" className="flabel">
                Excepciones (una por línea)
              </label>
              <Form.Control
                id="palabra-excepciones"
                as="textarea"
                rows={3}
                value={form.excepciones}
                onChange={(e) =>
                  dispatch({
                    type: "CAMBIAR",
                    campo: "excepciones",
                    valor: e.target.value,
                  })
                }
                className="finput ftextarea"
                placeholder="Frases permitidas que contengan el texto, una por línea"
              />
              <span className="char-hint">
                Si el texto aparece dentro de estas frases, no se sanciona.
              </span>
            </div>

            <div className="fgroup">
              <Form.Check
                type="switch"
                id="regla-activa"
                label="Regla activa"
                checked={form.activo}
                onChange={(e) =>
                  dispatch({
                    type: "CAMBIAR",
                    campo: "activo",
                    valor: e.target.checked,
                  })
                }
              />
            </div>
          </div>
        </Modal.Body>

        <div className="modal-actions">
          <button type="button" className="btn-cancelar" onClick={onCerrar}>
            <MdOutlineCancel /> Cancelar
          </button>
          <button type="submit" className="btn-guardar" disabled={guardando}>
            {guardando && <Spinner as="span" animation="border" size="sm" className="me-1" />}
            {esEdicion ? "Guardar cambios" : "Agregar"}
          </button>
        </div>
      </Form>
    </Modal>
  );
};

export default PalabraFormModal;
