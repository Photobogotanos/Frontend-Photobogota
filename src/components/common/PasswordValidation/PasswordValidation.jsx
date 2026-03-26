import { FaCheck, FaTimes } from "react-icons/fa";
import "./PasswordValidation.css";

export default function PasswordValidation({ password, validationRules }) {
  return (
    <ul className="password-rules">
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
  );
}
