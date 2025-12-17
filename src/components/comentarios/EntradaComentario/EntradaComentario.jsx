import { useState, useRef, useEffect } from "react";
import { FaSmile, FaPaperPlane, FaImages } from "react-icons/fa";
import SelectorGif from "../SelectorGif/SelectorGif";
import "./EntradaComentario.css";

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [texto]);

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

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = inicio + emoji.length;
    }, 0);
  };

  const insertarGif = (urlGif) => {
    setTexto((prev) => prev + ` ![GIF](${urlGif}) `);
    setMostrarGif(false);
    textareaRef.current?.focus();
  };

  const tieneTexto = texto.trim().length > 0;

  return (
    <div className="entrada-comentario-moderna">
      {mostrarGif && <SelectorGif alSeleccionar={insertarGif} />}

      {mostrarEmojis && (
        <div ref={emojiRef} className="emoji-picker-moderno">
          <div className="cuadricula-emoji-moderna">
            {EMOJIS_POPULARES.map((emoji, index) => (
              <span
                key={index}
                className="emoji-item-moderno"
                onClick={() => insertarEmoji(emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="contenedor-input">
        <textarea
          ref={textareaRef}
          rows="1"
          placeholder="Añade un comentario..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              manejarEnvio();
            }
          }}
        />

        <div className="acciones-input">
          <FaSmile
            size={24}
            className="icono-accion"
            onClick={() => {
              setMostrarEmojis(!mostrarEmojis);
              setMostrarGif(false);
            }}
          />
          <FaImages
            size={24}
            className="icono-accion"
            onClick={() => {
              setMostrarGif(!mostrarGif);
              setMostrarEmojis(false);
            }}
          />
          <button
            className={`boton-enviar ${tieneTexto ? "activo" : ""}`}
            onClick={manejarEnvio}
            disabled={!tieneTexto}
          >
            <FaPaperPlane size={20} />
            <span className="texto-publicar">Publicar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntradaComentario;
