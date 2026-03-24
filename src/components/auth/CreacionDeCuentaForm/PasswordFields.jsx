import Form from "react-bootstrap/Form";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function PasswordFields({
  password, password2,
  mostrarContrasena, setMostrarContrasena,
  mostrarContrasena2, setMostrarContrasena2,
  passwordMatch,
  validationRules,
  onChangePassword,   // (valor, esConfirmacion) => void
}) {
  return (
    <div>

      {/* Contraseña */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <FaLock /> Contraseña <RequiredMark />
        </Form.Label>
        <div className="input-icon-container">
          <Form.Control
            className="rounded-pill input-with-icon input-without-focus"
            type={mostrarContrasena ? "text" : "password"}
            value={password}
            onChange={(e) => onChangePassword(e.target.value, false)}
          />
          <span
            className="eye-icon"
            onClick={() => setMostrarContrasena(!mostrarContrasena)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMostrarContrasena(!mostrarContrasena)}
            tabIndex={0}
            role="button"
            aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </Form.Group>

      {/* Confirmación de contraseña */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <FaLock /> Confirmación de la contraseña <RequiredMark />
        </Form.Label>
        <div className="input-icon-container">
          <Form.Control
            className="rounded-pill input-with-icon input-without-focus"
            type={mostrarContrasena2 ? "text" : "password"}
            value={password2}
            onChange={(e) => onChangePassword(e.target.value, true)}
          />
          <span
            className="eye-icon"
            onClick={() => setMostrarContrasena2(!mostrarContrasena2)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setMostrarContrasena2(!mostrarContrasena2)}
            tabIndex={0}
            role="button"
            aria-label={mostrarContrasena2 ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña'}
          >
            {mostrarContrasena2 ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Indicador de coincidencia */}
        {password2 !== "" && (
          <span className={`password-match mt-2 ${passwordMatch ? "ok" : "bad"}`}>
            {passwordMatch ? (
              <><FaCheck /> Las contraseñas coinciden</>
            ) : (
              <><FaTimes /> Las contraseñas no coinciden</>
            )}
          </span>
        )}

        {/* Reglas de validación */}
        <ul className="password-rules mt-2">
          <li className={validationRules.length ? "valid" : "invalid"}>
            {validationRules.length ? <FaCheck /> : <FaTimes />} Mínimo 8 caracteres
          </li>
          <li className={validationRules.upper ? "valid" : "invalid"}>
            {validationRules.upper ? <FaCheck /> : <FaTimes />} Una mayúscula
          </li>
          <li className={validationRules.lower ? "valid" : "invalid"}>
            {validationRules.lower ? <FaCheck /> : <FaTimes />} Una minúscula
          </li>
          <li className={validationRules.number ? "valid" : "invalid"}>
            {validationRules.number ? <FaCheck /> : <FaTimes />} Un número
          </li>
        </ul>
      </Form.Group>

    </div>
  );
}