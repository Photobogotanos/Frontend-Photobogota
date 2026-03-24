import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa6";
import "./SpotCard.css";

export default function SpotCard({ id, img, title, rating, likes, tags }) {
  const navigate = useNavigate();

  return (
    <button
      className="spot-card-horizontal"
      onClick={() => {
        navigate(`/spot/${id}`);
      }}
    >
      <img src={img} alt={title} className="spot-img-h" />

      <div className="spot-content">
        <div className="spot-tags-h">
          {tags.map((t) => (
            <span key={t} className="spot-tag-h">{t}</span>
          ))}
        </div>
        <h5 className="spot-title-h">{title}</h5>
        <div className="spot-info-h">
          <span className="spot-rating-h"><FaStar style={{ color: "#f59e0b", marginRight: "4px" }} /> {rating}</span>
          <span className="spot-likes-h"><FaHeart style={{ color: "#ef4444", marginRight: "4px" }} /> {likes}</span>
        </div>
      </div>
    </button>
  );
}