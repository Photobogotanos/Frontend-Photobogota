// ============================================================
// COMPONENTE HIJO: CambiarContrasena
// Su responsabilidad: mostrar el botón toggle y los campos
// de contraseña cuando corresponda.
// No guarda ningún valor, solo los muestra y reporta cambios.
// ============================================================

import { FaLock } from "react-icons/fa";
import { Form, Row, Col } from "react-bootstrap";

// Recibe 4 props:
//   mostrar   → true/false, decide si se ven los campos de contraseña
//   onToggle  → función del padre para cambiar mostrar de true a false o viceversa
//   formData  → objeto con contrasena y confirmarContrasena (para mostrar el valor)
//   onChange  → función del padre para actualizar esos valores al escribir
export default function CambiarContrasena({ mostrar, onToggle, formData, onChange }) {
  return (
    <div className="mb-4">

      {/* Al hacer click llama a onToggle, que viene del padre.
          El padre cambia el estado y vuelve a pasar mostrar=true o false */}
      <button type="button" className="btn-cambiar-contrasena" onClick={onToggle}>
        <FaLock className="me-2" />
        {/* Muestra texto distinto según el estado */}
        {mostrar ? "Ocultar cambio de contraseña" : "Cambiar contraseña"}
      </button>

      {/* Solo renderiza los campos si mostrar es true */}
      {mostrar && (
        <div className="contrasena-fields mt-3">
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="contrasena"
                  value={formData.contrasena}   // valor viene del padre
                  onChange={onChange}           // al escribir, avisa al padre
                  className="form-control-custom"
                  placeholder="Nueva contraseña"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label-custom">Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena} // valor viene del padre
                  onChange={onChange}                  // al escribir, avisa al padre
                  className="form-control-custom"
                  placeholder="Confirmar nueva contraseña"
                />
              </Form.Group>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}