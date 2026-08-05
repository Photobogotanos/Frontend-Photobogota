import { FaShieldAlt, FaUserSlash } from "react-icons/fa";

const DIGIT_SLOTS = ["d0", "d1", "d2", "d3", "d4", "d5"];

export default function VistaCodigo({
  codigo,
  enviando,
  inputsRef,
  onDigitChange,
  onDigitKeyDown,
  onConfirmar,
  onReenviar,
}) {
  return (
    <form className="elim-block" onSubmit={onConfirmar}>
      <div className="elim-hero">
        <span className="elim-hero-icon">
          <FaShieldAlt />
        </span>
        <p className="elim-hero-title">Confirma con el código enviado a tu correo</p>
        <p className="elim-hero-sub">
          Ingresa el código de 6 dígitos que te enviamos. Al confirmarlo tu cuenta
          quedará desactivada de inmediato.
        </p>
      </div>

      <div className="elim-otp-inputs">
        {codigo.map((num, idx) => (
          <input
            key={DIGIT_SLOTS[idx]}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength="1"
            aria-label={`Dígito ${idx + 1} del código`}
            className={`elim-otp-digit${num ? " filled" : ""}`}
            value={num}
            ref={(el) => (inputsRef.current[idx] = el)}
            onChange={(e) => onDigitChange(e, idx)}
            onKeyDown={(e) => onDigitKeyDown(e, idx)}
            disabled={enviando}
          />
        ))}
      </div>

      <button type="submit" className="elim-btn-danger" disabled={enviando}>
        <FaUserSlash /> {enviando ? "Confirmando..." : "Confirmar eliminación"}
      </button>

      <button
        type="button"
        className="elim-link-btn"
        onClick={onReenviar}
        disabled={enviando}
        aria-label="Reenviar código de confirmación"
      >
        ¿No recibiste el código? Reenviar
      </button>
    </form>
  );
}
