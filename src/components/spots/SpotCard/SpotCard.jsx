import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa6";
import "./SpotCard.css";

export default function SpotCard({ id, img, title, rating, tags }) {
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
          {tags.map((t, index) => (
            <span key={`${t}-${index}`} className="spot-tag-h">
              {t}
            </span>
          ))}
        </div>
        <h5 className="spot-title-h">{title}</h5>
        <div className="spot-info-h">
          <span className="spot-rating-h"><FaStar style={{ color: "#f59e0b", marginRight: "4px" }} /> {rating}</span>
        </div>
      </div>
    </button>
  );
}