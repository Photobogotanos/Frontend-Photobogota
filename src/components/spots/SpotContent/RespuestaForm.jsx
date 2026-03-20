import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

// Formulario para que el creador del spot responda una reseña.
// Maneja su propio estado local para evitar usar document.getElementById.
const RespuestaForm = ({ resenaId, onEnviar, onCancelar }) => {
  const [texto, setTexto] = useState("");

  return (
    <div className="respuesta-form">
      <textarea
        placeholder="Escribe tu respuesta a esta reseña..."
        className="respuesta-input"
        rows="3"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      <div className="respuesta-acciones">
        <button className="btn-cancelar-respuesta" onClick={onCancelar}>
          Cancelar
        </button>
        <button
          className="btn-enviar-respuesta"
          onClick={() => onEnviar(resenaId, texto)}
        >
          <FaPaperPlane className="btn-icon" />
          Enviar
        </button>
      </div>
    </div>
  );
};

export default RespuestaForm;