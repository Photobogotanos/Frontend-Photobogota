import { Form } from "react-bootstrap";
import { FaShieldAlt } from "react-icons/fa";
import PassField from "./PassField";
import BotonesAccion from "./BotonesAccion";

export default function PassFormCampos({
  formData,
  handleChange,
  validationRules,
  passwordsCoinciden,
  verActual,
  verNueva,
  verConfirmar,
  onToggleActual,
  onToggleNueva,
  onToggleConfirmar,
  handleSubmit,
  onCancelar,
}) {
  return (
    <Form onSubmit={handleSubmit}>
      <div className="form-block pass-tab-block">
        <div className="pass-hero">
          <span className="pass-hero-icon">
            <FaShieldAlt />
          </span>
          <p className="pass-hero-title">Cambiar contraseña</p>
          <p className="pass-hero-sub">
            Elige una contraseña segura con al menos 8 caracteres, una
            mayúscula, una minúscula y un número.
          </p>
        </div>

        <div className="pass-fields-stack">
          <PassField
            label="Contraseña actual"
            name="contrasenaActual"
            value={formData.contrasenaActual}
            onChange={handleChange}
            ver={verActual}
            onToggle={onToggleActual}
            placeholder="Tu contraseña actual"
            formData={formData}
          />

          <div className="pass-divider" />

          <PassField
            label="Nueva contraseña"
            name="contrasenaNueva"
            value={formData.contrasenaNueva}
            onChange={handleChange}
            ver={verNueva}
            onToggle={onToggleNueva}
            placeholder="Mínimo 8 caracteres..."
            formData={formData}
            validationRules={validationRules}
          />

          <PassField
            label="Confirmar nueva contraseña"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            ver={verConfirmar}
            onToggle={onToggleConfirmar}
            placeholder="Repite la nueva contraseña"
            formData={formData}
            passwordsCoinciden={passwordsCoinciden}
          />
        </div>
      </div>
      <BotonesAccion onCancelar={onCancelar} />
    </Form>
  );
}
