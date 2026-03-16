import { useState, useRef } from "react";
import "./ConfirmacionCodigoForm.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function ConfirmacionCodigoForm() {
  const navegar = useNavigate(); 
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);// arreglo para guardar el codigo
  const inputsRef = useRef([]);// Variable para guardar en el arreglo

  const handleChange = (e, index) => { // evento al oprimir el boton
    const value = e.target.value.replace(/[^0-9]/g, ""); // en los campos solo reciba numeros de 0 a 9 y elimine cualquier otra cosa
    if (!value) return; // Se valida que el usuario ingrese solo numeros, solo lo deja escribir numeros

    const newCode = [...codigo]; // crear copia del array
    newCode[index] = value;// Actualiza el lugar del arreglo
    setCodigo(newCode); // Guarda el arreglo

    if (index < 5) inputsRef.current[index + 1].focus(); // Al no estar en el ultimo input, mueve el foco del input, lo mueve al siguiente
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

  const handleSubmit = (e) => {// Evento al presionar el boton
    e.preventDefault();// Control del envio

    const finalCode = codigo.join(""); // array para que ingrese los numeros que ingreso

    if (finalCode.length < 6) { // Valida el array si no estan los 6 digitos, muestra alerta
      Swal.fire({
        icon: "error",
        title: "Código incompleto",
        text: "Por favor ingresa los 6 dígitos.",
      });
      return;
    } 
    
    // Si cumple que sea numeros y los 6 digitos muestra alerta de confirmacion

    Swal.fire({
      icon: "success",
      title: "Código enviado",
      text: `Tu código es: ${finalCode}`,
    }).then(() => {
      navegar("/mapa");
    });

    console.log("Código ingresado:", finalCode);
  };

  const reenviarCodigo = () => {// Evento al reenviar codigo
    Swal.fire({
      icon: "info",
      title: "Código reenviado",
      text: "Se ha reenviado el código a tu correo.",
      timer: 2000,
      showConfirmButton: false,
    });
  };

  return (
    <form className="mt-5 codigo-form" onSubmit={handleSubmit}>
      <h2 className="title">Confirmación de Código</h2>
      <h2 className="title">INGRESA CÓDIGO DE VERIFICACIÓN</h2>
      <p className="subtitle">
        Enviado al correo: <b>photobogota123@gmail.com</b>
      </p>

      <div className="inputs-container">
        {codigo.map((num, idx) => ( //  Mapea el input para hacer el array 
          <input
            key={idx} // identificador del input 
            type="text"
            maxLength="1" // Permite solo un caracter
            className="codigo-input"
            value={num}
            ref={(el) => (inputsRef.current[idx] = el)} // arreglo para guardar la referencia 
            onChange={(e) => handleChange(e, idx)} // cambio de input para el siguiente
            onKeyDown={(e) => handleKeyDown(e, idx)}// Cambio de input cuando borra
          />
        ))}
      </div>

      <button type="submit" className="btn-confirmar">
        Confirmar Código
      </button>

      <p className="reenviar">
        ¿Te gustaría reenviar el código? <span className="reenviar-link" onClick={reenviarCodigo} onKeyDown={(e) => e.key === 'Enter' && reenviarCodigo()} role="button" tabIndex={0}>Reenviar</span>
      </p>
    </form>
  );
}
