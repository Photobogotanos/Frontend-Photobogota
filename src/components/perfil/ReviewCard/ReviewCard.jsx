import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import "./ReviewCard.css";

export default function ReviewCard({ title, rating, text, date, placeId, canRespond = false }) {
  const navigate = useNavigate();
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false);
  const [respuesta, setRespuesta] = useState("");
  // Generar array de 5 estrellas con keys fijas basadas en su posición
  const starElements = [];
  for (let i = 0; i < 5; i++) {
    const isFilled = i < rating;
    // Usamos una key basada en si la estrella es filled o empty, no en el índice
    // Esto es aceptable porque las estrellas tienen posiciones fijas y no se reordenan
    starElements.push(
      <span key={isFilled ? `star-filled-${i}` : `star-empty-${i}`} className={`star ${isFilled ? 'filled' : 'empty'}`}>
        {isFilled ? '★' : '☆'}
      </span>
    );
  }

  const irAlSpot = () => {
    if (!placeId) {
      toast("No se pudo encontrar el spot asociado", { icon: "ℹ" });
      return;
    }
    navigate(`/spot/${placeId}`);
  };

  const handleCardClick = () => {
    irAlSpot();
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    irAlSpot();
  };

  const handleResponder = (e) => {
    e.stopPropagation();
    // Aquí iría la lógica para enviar la respuesta al backend
    console.log("Respuesta enviada:", respuesta);
    setMostrarRespuesta(false);
    setRespuesta("");
    alert("¡Tu respuesta ha sido enviada!");
  };

  const handleVerSpot = (e) => {
    e.stopPropagation();
    irAlSpot();
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, react-doctor/no-static-element-interactions
    <div
      className="review-card"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="review-header">
        <div className="review-title-container">
          <button
            type="button"
            className="review-title"
            onClick={handleTitleClick}
            style={{ cursor: "pointer", background: "none", border: "none", padding: 0, textAlign: "left" }}
          >
            {title}
          </button>
          <div className="review-meta">
            <span className="review-date">{date}</span>
            <div className="review-rating">
              {starElements}
              <span className="rating-number">{rating}.0</span>
            </div>
          </div>
        </div>
      </div>

      <p className="review-text">{text}</p>

      {/* Respuesta del negocio (si existe) */}
      {canRespond && (
        <div className="review-respuesta-container">
          {!mostrarRespuesta ? (
            <button
              type="button"
              className="btn-responder-resena"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarRespuesta(true);
              }}
            >
              Responder esta reseña
            </button>
          ) : (
            <div className="respuesta-form">
              <label htmlFor={`respuesta-review-${title}`} className="visually-hidden">
                Respuesta a la reseña
              </label>
              <textarea
                id={`respuesta-review-${title}`}
                className="respuesta-input"
                placeholder="Escribe tu respuesta..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                rows={3}
              />
              <div className="respuesta-actions">
                <button
                  type="button"
                  className="btn-cancelar-respuesta"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMostrarRespuesta(false);
                    setRespuesta("");
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-enviar-respuesta"
                  onClick={handleResponder}
                  disabled={!respuesta.trim()}
                >
                  Enviar Respuesta
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Enlace "ver spot" */}
      <div className="review-actions">
        <button
          type="button"
          className="ver-spot-link"
          onClick={handleVerSpot}
        >
          <span className="ver-spot-text">Ver spot</span>
          <span className="arrow-icon">→</span>
        </button>
      </div>
    </div>
  );
}