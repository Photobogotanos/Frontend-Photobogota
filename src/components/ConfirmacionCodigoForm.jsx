import { useState, useRef } from "react";
import "./ConfirmacionCodigoForm.css";

export default function ConfirmacionCodigoForm() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    if (!value) return;

    const newCode = [...codigo];
    newCode[index] = value;
    setCodigo(newCode);

    // pasar automáticamente al siguiente input
    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    // regresar al input anterior con backspace
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalCode = codigo.join("");
    console.log("Código ingresado:", finalCode);
  };

  return (
    <form className="mt-5 codigo-form" onSubmit={handleSubmit}>
      <h2 className="title">Confirmacion de Codigo</h2>
      <h2 className="title">INGRESA CÓDIGO DE VERIFICACIÓN</h2>
      <p className="subtitle">
        Enviado al correo: <b>photobogota123@gmail.com</b>
      </p>

      <div className="inputs-container">
        {codigo.map((num, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            className="codigo-input"
            value={num}
            ref={(el) => (inputsRef.current[idx] = el)}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          />
        ))}
      </div>

      <button type="submit" className="btn-confirmar">
        Sign in
      </button>

      <p className="reenviar">¿Te gustaría reenviar el código?</p>
    </form>
  );
}
