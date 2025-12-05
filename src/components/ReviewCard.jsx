// ReviewCard.jsx
import { FiMapPin, FiHeart } from "react-icons/fi";

export default function ReviewCard({ 
  title, 
  rating, 
  text, 
  likes, 
  date, 
  placeLink = "-reseñas" 
}) {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-location">
          <FiMapPin className="pin-icon" />
          <h4 className="review-title">{title}</h4>
        </div>
        <span className="review-date">{date}</span>
      </div>

      <div className="review-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.floor(rating) ? "star filled" : "star"}>
            Star
          </span>
        ))}
      </div>

      <p className="review-text">{text}</p>

      <div className="review-footer">
        <div className="review-likes">
          <FiHeart className="heart-icon" />
          <span>{likes}</span>
        </div>
        <a href={placeLink} className="ver-lugar">
          Ver lugar
        </a>
      </div>
    </div>
  );
}