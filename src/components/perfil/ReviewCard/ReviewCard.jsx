import { useState } from "react";
import "./ReviewCard.css";

export default function ReviewCard({ title, rating, text, date, placeId, canRespond = false }) {
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

  // URL del spot (ajusta según tu routing)
  const spotUrl = placeId ? `/spot/${placeId}` : "#";

  const handleResponder = () => {
    // Aquí iría la lógica para enviar la respuesta al backend
    console.log("Respuesta enviada:", respuesta);
    setMostrarRespuesta(false);
    setRespuesta("");
    alert("¡Tu respuesta ha sido enviada!");
  };

  return (
    <div className="review-card">
      {/* Header */}
      <div className="review-header">
        <div className="review-title-container">
          <h3 className="review-title">{title}</h3>
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
              className="btn-responder-resena"
              onClick={() => setMostrarRespuesta(true)}
            >
              Responder esta reseña
            </button>
          ) : (
            <div className="respuesta-form">
              <textarea
                className="respuesta-input"
                placeholder="Escribe tu respuesta..."
                value={respuesta}
                onChange={(e) => setRespuesta(e.target.value)}
                rows={3}
              />
              <div className="respuesta-actions">
                <button 
                  className="btn-cancelar-respuesta"
                  onClick={() => {
                    setMostrarRespuesta(false);
                    setRespuesta("");
                  }}
                >
                  Cancelar
                </button>
                <button 
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
        <a href={spotUrl} className="ver-spot-link">
          <span className="ver-spot-text">Ver spot</span>
          <span className="arrow-icon">→</span>
        </a>
      </div>
    </div>
  );
}