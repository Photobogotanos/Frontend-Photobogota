import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import { useAuth } from "@/context/AuthContext";
import { useGuardados } from "@/hooks/useGuardados";
import ReportarModal from "@/components/spots/SpotContent/ReportarModal";
import "./SpotCard.css";

export default function SpotCard({ id, img, title, rating, tags, onToggleGuardado }) {
  const navigate = useNavigate();
  const { logueado } = useAuth();
  const { isGuardado, toggleGuardado } = useGuardados();
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [imgRota, setImgRota] = useState(!img);
  const [guardando, setGuardando] = useState(false);

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

  const handleGuardar = async (e) => {
    e.stopPropagation();
    if (!logueado) {
      toast.error("Inicia sesión para guardar spots");
      return;
    }
    setGuardando(true);
    const resultado = await toggleGuardado(id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      onToggleGuardado?.();
    } else {
      toast.error(resultado.mensaje);
    }
    setGuardando(false);
  };

  return (
    <div
      className="spot-card-horizontal"
      onClick={irAlSpot}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Ver ${title}`}
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

      <button
        type="button"
        className={`btn-guardar-spot ${isGuardado(id) ? "guardado" : ""}`}
        onClick={handleGuardar}
        aria-label={isGuardado(id) ? "Quitar de guardados" : "Guardar spot"}
        title={isGuardado(id) ? "Quitar de guardados" : "Guardar spot"}
        disabled={guardando}
      >
        {isGuardado(id) ? <FaBookmark /> : <FaRegBookmark />}
      </button>

      {imgRota ? (
        <div className="spot-img-h spot-img-fallback">
          <Lottie
            animationData={uploadAnimation}
            loop
            style={{ width: 72, height: 72 }}
          />
        </div>
      ) : (
        <img
          src={img}
          alt={title}
          className="spot-img-h"
          onError={() => setImgRota(true)}
        />
      )}

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
