import { useState } from "react";
import { FaSmile, FaPaperPlane, FaImages } from "react-icons/fa";
import SelectorGif from "./SelectorGif";

const EntradaComentario = ({ idPublicacion }) => {
  const [texto, setTexto] = useState("");
  const [mostrarGif, setMostrarGif] = useState(false);

  const manejarEnvio = () => {
    if (texto.trim()) {
      console.log("Comentario enviado:", texto, "en publicación:", idPublicacion);
      setTexto("");
      setMostrarGif(false);
    }
  };

  return (
    <div className="entrada-comentario">
      {mostrarGif && <SelectorGif alSeleccionar={(gif) => setTexto(texto + " " + gif)} />}

      <textarea
        className="form-control mb-2"
        rows="2"
        placeholder="Escribe un comentario..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <FaSmile size={20} className="icono-interactivo" />
          <FaImages
            size={20}
            className="icono-interactivo"
            onClick={() => setMostrarGif(!mostrarGif)}
          />
        </div>

        <button 
          className="btn btn-primary rounded-pill px-4"
          onClick={manejarEnvio}
          disabled={!texto.trim()}
        >
          <FaPaperPlane /> Publicar
        </button>
      </div>
    </div>
  );
};

export default EntradaComentario;