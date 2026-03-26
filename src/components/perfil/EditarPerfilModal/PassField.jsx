import { Form } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import PasswordValidation from "@/components/common/PasswordValidation/PasswordValidation";

const PassField = ({ 
  label, 
  name, 
  ver, 
  onToggle, 
  placeholder, 
  value, 
  onChange, 
  passwordsCoinciden, 
  formData, 
  validationRules 
}) => (
  <div className="fgroup">
    <label className="flabel">{label}</label>
    <div className="pass-wrap">
      <Form.Control
        type={ver ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        className={`finput has-eye ${name === "confirmarContrasena" && formData.confirmarContrasena
          ? passwordsCoinciden ? "is-ok" : "is-err"
          : ""
          }`}
        placeholder={placeholder}
      />
      <button type="button" className="eye-btn" onClick={onToggle} tabIndex={-1}>
        {ver ? <FaEyeSlash /> : <FaEye />}
      </button>
      {name === "confirmarContrasena" && passwordsCoinciden && (
        <FaCheckCircle className="pass-check-icon" />
      )}
    </div>
    {/* Componente de validación para la nueva contraseña */}
    {name === "contrasenaNueva" && value && (
      <PasswordValidation password={value} validationRules={validationRules} />
    )}
    {/* Mensaje de coincidencia */}
    {name === "confirmarContrasena" && formData.confirmarContrasena && (
      <span className={`pass-msg ${passwordsCoinciden ? "ok" : "err"}`}>
        {passwordsCoinciden ? "¡Contraseñas coinciden!" : "Las contraseñas no coinciden"}
      </span>
    )}
  </div>
);

export default PassField;
