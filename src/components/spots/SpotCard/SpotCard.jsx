import { useNavigate } from "react-router-dom";
import "./SpotCard.css";

export default function SpotCard({ id, img, title, rating, likes, tags }) {
  const navigate = useNavigate();

  return (
    <div
      className="spot-card-horizontal"
      onClick={() => {
        console.log("Click! id:", id); // 👈 esto aparece en consola al hacer click
        navigate(`/spot/${id}`);
      }}
    >
      <img src={img} alt={title} className="spot-img-h" />

      <div className="spot-content">
        <div className="spot-tags-h">
          {tags.map((t, i) => (
            <span key={i} className="spot-tag-h">{t}</span>
          ))}
        </div>
        <h5 className="spot-title-h">{title}</h5>
        <div className="spot-info-h">
          <span className="spot-rating-h">⭐ {rating}</span>
          <span className="spot-likes-h">❤️ {likes}</span>
        </div>
      </div>
    </div>
  );
}