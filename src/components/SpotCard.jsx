import "./SpotCard.css";

export default function SpotCard({ img, title, rating, likes, tags }) {
  return (
    <div className="spot-card-horizontal">

      {/* IMAGEN */}
      <img src={img} alt={title} className="spot-img-h" />

      {/* CONTENIDO */}
      <div className="spot-content">

        {/* TAGS */}
        <div className="spot-tags-h">
          {tags.map((t, i) => (
            <span key={i} className="spot-tag-h">{t}</span>
          ))}
        </div>

        {/* TÍTULO */}
        <h5 className="spot-title-h">{title}</h5>

        {/* INFO: RATING + LIKES */}
        <div className="spot-info-h">
          <span className="spot-rating-h">⭐ {rating}</span>
          <span className="spot-likes-h">❤️ {likes}</span>
        </div>

      </div>
    </div>
  );
}
