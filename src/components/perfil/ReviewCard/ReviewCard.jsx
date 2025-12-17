import "./ReviewCard.css";

export default function ReviewCard({ title, rating, text, likes, date, placeId }) {
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <span key={i} className={`star ${i < rating ? 'filled' : 'empty'}`}>
        {i < rating ? '★' : '☆'}
      </span>
    );
  }

  // URL del lugar (ajusta según tu routing)
  const lugarUrl = placeId ? `/lugar/${placeId}` : "#";

  return (
    <div className="review-card">
      {/* Header */}
      <div className="review-header">
        <div className="review-title-container">
          <h3 className="review-title">{title}</h3>
          <div className="review-meta">
            <span className="review-date">{date}</span>
            <div className="review-rating">
              {stars}
              <span className="rating-number">{rating}.0</span>
            </div>
          </div>
        </div>
        <div className="review-likes">
          <span className="heart-icon">❤️</span>
          <span className="likes-count">{likes}</span>
        </div>
      </div>

      <p className="review-text">{text}</p>

      {/* Enlace "ver lugar" */}
      <div className="review-actions">
        <a href={lugarUrl} className="ver-lugar-link">
          <span className="ver-lugar-text">Ver lugar</span>
          <span className="arrow-icon">→</span>
        </a>
      </div>
    </div>
  );
}