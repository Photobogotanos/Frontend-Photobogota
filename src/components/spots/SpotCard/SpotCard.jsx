import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaHeart, FaBookmark, FaRegBookmark } from "react-icons/fa6";
import { FaFlag } from "react-icons/fa";
import { toast } from "react-hot-toast";
import LottieImport from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import { useAuth } from "@/context/AuthContext";
import { useGuardados } from "@/hooks/useGuardados";
import ReportarModal from "@/components/spots/SpotContent/ReportarModal";
import "./SpotCard.css";

const Lottie = LottieImport?.default ?? LottieImport;

function SpotImagen({ img, title }) {
  const [imgError, setImgError] = useState(false);
  const mostrarFallback = !img || imgError;

  if (mostrarFallback) {
    return (
      <div className="spot-img-h spot-img-fallback">
        <Lottie
          animationData={uploadAnimation}
          loop
          style={{ width: 72, height: 72 }}
        />
      </div>
    );
  }

  return (
    <img
      src={img}
      alt={title}
      className="spot-img-h"
      onError={() => setImgError(true)}
    />
  );
}

export default function SpotCard({ id, img, title, rating, tags, onToggleGuardado }) {
  const navigate = useNavigate();
  const { logueado } = useAuth();
  const { isGuardado, toggleGuardado } = useGuardados();
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const irAlSpot = () => navigate(`/spot/${id}`);

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
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, react-doctor/no-static-element-interactions
    <div
      className="spot-card-horizontal"
      onClick={irAlSpot}
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

      <SpotImagen key={img} img={img} title={title} />

      <div className="spot-content">
        <div className="spot-tags-h">
          {tags.map((t, index) => (
            <span key={`${t}-${index}`} className="spot-tag-h">
              {t}
            </span>
          ))}
        </div>
        <button
          type="button"
          className="spot-title-h spot-title-btn"
          onClick={(e) => {
            e.stopPropagation();
            irAlSpot();
          }}
        >
          {title}
        </button>
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
