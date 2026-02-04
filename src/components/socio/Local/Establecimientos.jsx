import "./Establecimientos.css";
import { FaStar, FaMapMarkerAlt, FaEye, FaHeart } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { BsBarChart } from "react-icons/bs";

export default function Establecimientos({
  image,
  title,
  category,
  location,
  rating,
  reviews,
  visits,
  likes,
  comments,
  status,
  date,
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-img">
        <img src={image} alt={title} />

        <span className={`badge-status ${status}`}>
          {status === "activo" ? "Activo" : "1 reporte"}
        </span>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-header">
          <h5>{title}</h5>
          <span className="dots">•••</span>
        </div>

        <div className="dashboard-tags">
          <span className="tag">{category}</span>
          <span className="location">
            <FaMapMarkerAlt /> {location}
          </span>
        </div>

        <div className="dashboard-rating">
          <FaStar />
          <span>{rating}</span>
          <small>({reviews} reseñas)</small>
        </div>

        <p className="dashboard-desc">
          Café acogedor en el corazón de Chapinero con especialidad en café de
          origen.
        </p>

        <div className="dashboard-metrics">
          <div>
            <strong>{visits}</strong>
            <span>Visitas</span>
          </div>
          <div>
            <strong>{likes}</strong>
            <span>Me gusta</span>
          </div>
          <div>
            <strong>{comments}</strong>
            <span>Comentarios</span>
          </div>
        </div>

        <div className="dashboard-actions">
          <button><FaEye /> Ver detalles</button>
          <button><FiEdit3 /> Editar</button>
          <button><BsBarChart /> Métricas</button>
        </div>

        <small className="dashboard-date">{date}</small>
      </div>
    </div>
  );
}
