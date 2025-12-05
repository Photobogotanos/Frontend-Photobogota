import { useState, useRef, useEffect } from "react";
import { FaSmile, FaPaperPlane, FaImages } from "react-icons/fa";
import SelectorGif from "./SelectorGif";

const EMOJIS_POPULARES = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😆",
  "😅",
  "😊",
  "😇",
  "🙂",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤑",
  "🤠",
  "👻",
  "💪",
  "👏",
  "🙌",
];

const EntradaComentario = ({ idPublicacion }) => {
  const [texto, setTexto] = useState("");
  const [mostrarGif, setMostrarGif] = useState(false);
  const [mostrarEmojis, setMostrarEmojis] = useState(false);
  const emojiRef = useRef(null);
  const textareaRef = useRef(null);

  // Cerrar selectores al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setMostrarEmojis(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const manejarEnvio = () => {
    if (texto.trim()) {
      console.log(
        "Comentario enviado:",
        texto,
        "en publicación:",
        idPublicacion
      );
      setTexto("");
      setMostrarGif(false);
      setMostrarEmojis(false);
    }
  };

  const insertarEmoji = (emoji) => {
    const textarea = textareaRef.current;
    const inicio = textarea.selectionStart;
    const fin = textarea.selectionEnd;
    const nuevoTexto =
      texto.substring(0, inicio) + emoji + texto.substring(fin);
    setTexto(nuevoTexto);

    // Enfocar y posicionar cursor después del emoji
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = inicio + emoji.length;
    }, 0);
  };

  const insertarGif = (urlGif) => {
    setTexto((prev) => prev + ` ![GIF](${urlGif}) `);
    setMostrarGif(false);
  };

  return (
    <div className="entrada-comentario">
      {mostrarGif && <SelectorGif alSeleccionar={insertarGif} />}

      {mostrarEmojis && (
        <div ref={emojiRef} className="emoji-picker">
          <div className="cuadricula-emoji">
            {EMOJIS_POPULARES.map((emoji, index) => (
              <span
                key={index}
                className="emoji-item"
                onClick={() => insertarEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="form-control mb-2"
        rows="2"
        placeholder="Escribe un comentario..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            manejarEnvio();
          }
        }}
      />

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex gap-3">
          <div className="contenedor-emoji" style={{ position: "relative" }}>
            <FaSmile
              size={20}
              className="icono-interactivo"
              onClick={() => {
                setMostrarEmojis(!mostrarEmojis);
                setMostrarGif(false);
              }}
            />
          </div>
          <FaImages
            size={20}
            className="icono-interactivo"
            onClick={() => {
              setMostrarGif(!mostrarGif);
              setMostrarEmojis(false);
            }}
          />
        </div>

        <button
          className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2"
          onClick={manejarEnvio}
          disabled={!texto.trim()}
        >
          <FaPaperPlane />
          <span>Publicar</span>
        </button>
      </div>
    </div>
  );
};

export default EntradaComentario;
