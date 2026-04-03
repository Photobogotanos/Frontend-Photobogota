import { useState, useRef, useEffect } from "react";
import "./ConfirmacionCodigoForm.css";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { postSolicitarRecuperacion } from "@/api/usuarioApi";

const RESEND_SECONDS = 60;

export default function ConfirmacionCodigoForm() {
  const navegar = useNavigate();
  const location = useLocation();

  // Email recibido desde RecuperarContraForm
  const email = location.state?.email || "";

  const DIGIT_SLOTS = ["d0", "d1", "d2", "d3", "d4", "d5"];
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // ── Gestión del Timer ──
  const [segundos, setSegundos] = useState(RESEND_SECONDS);
  const puedeReenviar = segundos <= 0;

  useEffect(() => {
    if (puedeReenviar) return;
    const intervalo = setInterval(() => {
      setSegundos((s) => s - 1);
    }, 1000);
    return () => clearInterval(intervalo);
  }, [puedeReenviar]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newCode = [...codigo];
    newCode[index] = value.substring(value.length - 1);
    setCodigo(newCode);

    if (index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!codigo[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }
      if (codigo[index]) {
        const newCode = [...codigo];
        newCode[index] = "";
        setCodigo(newCode);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCode = codigo.join("");

    if (finalCode.length < 6) {
      return Swal.fire({
        icon: "error",
        title: "Código incompleto",
        text: "Por favor ingresa los 6 dígitos.",
        confirmButtonColor: "#806fbe",
      });
    }

    // Pasa el email y el código a PasswordResetForm para usarlos al guardar
    navegar("/nueva-contrasena", { state: { email, codigo: finalCode } });
  };

  const reenviarCodigo = async () => {
    if (!puedeReenviar) return;

    try {
      // Solicita un nuevo código al backend
      await postSolicitarRecuperacion({ email });

      Swal.fire({
        icon: "info",
        title: "Código reenviado",
        text: `Se ha reenviado el código a ${email}.`,
        confirmButtonColor: "#806fbe",
        timer: 2000,
        showConfirmButton: false,
      });

      setSegundos(RESEND_SECONDS);
    } catch {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reenviar el código. Intenta de nuevo.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const timerTexto = `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;

  return (
    <form className="confirmacion-form" onSubmit={handleSubmit}>
      <div className="confirmacion-header">
        <span className="confirmacion-subtitle">Verificación de identidad</span>
        <h2 className="confirmacion-title">Ingresa tu código</h2>
        <span className="confirmacion-line"></span>
      </div>

      <p className="confirmacion-desc">
        Enviamos un código de 6 dígitos a{" "}
        <span className="confirmacion-email">{email}</span>
      </p>

      <div className="confirmacion-inputs">
        {codigo.map((num, idx) => (
          <input
            key={DIGIT_SLOTS[idx]}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength="1"
            className={`confirmacion-digit${num ? " filled" : ""}`}
            value={num}
            ref={(el) => (inputsRef.current[idx] = el)}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      <button type="submit" className="confirmacion-btn">
        Continuar
      </button>

      <div className="confirmacion-reenviar">
        {puedeReenviar ? (
          <p>
            ¿No recibiste el código?{" "}
            <button
              type="button"
              className="confirmacion-reenviar-btn"
              onClick={reenviarCodigo}
            >
              Reenviar
            </button>
          </p>
        ) : (
          <p>
            Reenviar código en{" "}
            <span className="confirmacion-timer">{timerTexto}</span>
          </p>
        )}
      </div>
    </form>
  );
}