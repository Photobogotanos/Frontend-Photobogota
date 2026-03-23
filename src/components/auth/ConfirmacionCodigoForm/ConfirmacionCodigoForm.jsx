import { useState, useRef, useEffect } from "react";
import "./ConfirmacionCodigoForm.css";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";

const RESEND_SECONDS = 60;

export default function ConfirmacionCodigoForm() {
  const navegar = useNavigate();
  const location = useLocation();

  // Email recibido desde el formulario anterior
  const email = location.state?.email || "tu correo";

  const DIGIT_SLOTS = ["d0", "d1", "d2", "d3", "d4", "d5"];
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  // ── Gestión del Timer (Estado derivado) ──
  const [segundos, setSegundos] = useState(RESEND_SECONDS);
  
  // Derivamos 'puedeReenviar' directamente del estado de segundos
  const puedeReenviar = segundos <= 0;

  useEffect(() => {
    // Si ya llegamos a cero, no iniciamos el intervalo
    if (puedeReenviar) return;

    const intervalo = setInterval(() => {
      setSegundos((s) => s - 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [puedeReenviar]); // Se reinicia solo cuando segundos vuelve a 60

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newCode = [...codigo];
    newCode[index] = value.substring(value.length - 1); // Asegura solo 1 dígito
    setCodigo(newCode);

    // Mover al siguiente input
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
      Swal.fire({
        icon: "error",
        title: "Código incompleto",
        text: "Por favor ingresa los 6 dígitos.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Código verificado",
      text: "Tu identidad ha sido confirmada correctamente.",
      confirmButtonColor: "#806fbe",
    }).then(() => {
      navegar("/mapa");
    });
  };

  const reenviarCodigo = () => {
    if (!puedeReenviar) return;

    Swal.fire({
      icon: "info",
      title: "Código reenviado",
      text: `Se ha reenviado el código a ${email}.`,
      confirmButtonColor: "#806fbe",
      timer: 2000,
      showConfirmButton: false,
    });

    // Al resetear segundos a 60, 'puedeReenviar' pasa a false 
    // y el useEffect detecta el cambio para iniciar el timer de nuevo.
    setSegundos(RESEND_SECONDS);
  };

  // Formato mm:ss
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
        Confirmar código
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