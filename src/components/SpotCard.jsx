import { Card } from "react-bootstrap";
import "./SpotCard.css";

export default function SpotCard({ img, title, rating, likes, tags }) {
  return (
    <Card className="spot-card">
      <div className="spot-img-container">
        <img src={img} alt={title} className="spot-img" />

        <div className="spot-tags">
          {tags.map((t, i) => (
            <span key={i} className="spot-tag">{t}</span>
          ))}
        </div>
      </div>

      <Card.Body>
        <Card.Title className="spot-title">{title}</Card.Title>

        <div className="spot-info">
          <span className="spot-rating">⭐ {rating}</span>
          <span className="spot-likes">❤️ {likes}</span>
        </div>
      </Card.Body>
    </Card>
  );
}
