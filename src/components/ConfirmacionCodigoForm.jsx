import { useState, useRef } from "react";
import "./ConfirmacionCodigoForm.css";
import Swal from "sweetalert2";

export default function ConfirmacionCodigoForm() {
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    if (!value) return;

    const newCode = [...codigo];
    newCode[index] = value;
    setCodigo(newCode);

    if (index < 5) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      // Si el campo está vacío y no es el primer campo, mueve el foco al anterior
      if (!codigo[index] && index > 0) {
        inputsRef.current[index - 1].focus();
      }

      // Si el campo tiene valor, lo borra
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
        Confirmacion Codigo
      </button>

      <p className="reenviar">¿Te gustaría reenviar el código?</p>
    </form>
  );
}
