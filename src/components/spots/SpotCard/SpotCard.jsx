import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ReportarModal from "@/components/spots/SpotContent/ReportarModal";
import "./SpotCard.css";

export default function SpotCard({ id, img, title, rating, tags }) {
  const navigate = useNavigate();
  const { logueado } = useAuth();
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);

  const irAlSpot = () => navigate(`/spot/${id}`);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      irAlSpot();
    }
  };

  const handleReportar = (e) => {
    e.stopPropagation();
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setModalReporteAbierto(true);
  };

  return (
    <div
      className="spot-card-horizontal"
      role="button"
      tabIndex={0}
      onClick={irAlSpot}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="btn-reportar-spot-card"
        onClick={handleReportar}
        aria-label="Reportar este spot"
        title="Reportar"
      >
        <FaFlag />
      </button>

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

      <ReportarModal
        show={modalReporteAbierto}
        onCerrar={() => setModalReporteAbierto(false)}
        spotId={id}
      />
    </div>
  );
}
