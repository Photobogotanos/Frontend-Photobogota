import "./SpotCard.css";

export default function SpotCard({ img, title, rating, likes, tags }) {
  return (
    <div className="spot-card-horizontal">

      <img src={img} alt={title} className="spot-img-h" />

      <div className="spot-content">

        <div className="spot-tags-h">
          {tags.map((t) => (
            <span key={t} className="spot-tag-h">{t}</span>
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