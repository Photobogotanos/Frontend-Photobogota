import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import toast from "react-hot-toast";
import {
  crearPalabraProhibida,
  actualizarPalabraProhibida,
} from "@/services/moderacion.service";
import "./PalabraFormModal.css";

const PalabraFormModal = ({ mostrar, onCerrar, palabra, onGuardado }) => {
  const esEdicion = Boolean(palabra?.id);

  const [texto, setTexto] = useState("");
  const [tipo, setTipo] = useState("PALABRA");
  const [categoria, setCategoria] = useState("OFENSIVO");
  const [activo, setActivo] = useState(true);
  const [excepciones, setExcepciones] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!mostrar) return;
    /* eslint-disable react-hooks/set-state-in-effect -- sincronizar el formulario al abrir el modal */
    setTexto(palabra?.texto || "");
    setTipo(palabra?.tipo || "PALABRA");
    setCategoria(palabra?.categoria || "OFENSIVO");
    setActivo(palabra?.activo ?? true);
    setExcepciones((palabra?.excepciones || []).join("\n"));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [mostrar, palabra]);

  const manejarGuardar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) {
      toast.error("El texto es obligatorio");
      return;
    }
    setGuardando(true);
    const body = {
      texto: texto.trim(),
      tipo,
      categoria,
      activo,
      excepciones: excepciones
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
    <Modal show={mostrar} onHide={onCerrar} centered>
      <Form onSubmit={manejarGuardar}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esEdicion ? "Editar regla" : "Nueva regla"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              Texto <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder={tipo === "FRASE" ? "Ej: compra seguidores" : "Ej: palabra prohibida"}
            />
            <Form.Text className="text-muted">
              Se detecta ignorando mayúsculas y tildes.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Tipo</Form.Label>
            <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="PALABRA">Palabra (coincidencia exacta)</option>
              <option value="FRASE">Frase (dentro del texto)</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>
            <Form.Select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option value="OFENSIVO">Ofensivo</option>
              <option value="SPAM">Spam</option>
              <option value="OTRO">Otro</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Excepciones (una por línea)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={excepciones}
              onChange={(e) => setExcepciones(e.target.value)}
              placeholder="Frases permitidas que contengan el texto, una por línea"
            />
            <Form.Text className="text-muted">
              Si el texto aparece dentro de estas frases, no se sanciona.
            </Form.Text>
          </Form.Group>

          <Form.Check
            type="switch"
            id="regla-activa"
            label="Regla activa"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCerrar}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando && <Spinner as="span" animation="border" size="sm" className="me-1" />}
            {esEdicion ? "Guardar cambios" : "Agregar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PalabraFormModal;
