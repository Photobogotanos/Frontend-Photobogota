import {
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaMapMarkerAlt,
  FaTag,
  FaStar,
  FaHeart,
  FaCamera,
} from "react-icons/fa";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";

const SpotInfo = ({
  spot,
  esGuardado,
  guardandoSpot,
  handleGuardarSpot,
  abrirReporteSpot,
}) => (
  <>
    <div className="lugar-imagen-principal">
      {spot.imagen ? (
        <img
          src={spot.imagen}
          alt={spot.nombre}
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) fallback.style.display = "flex";
          }}
        />
      ) : null}
      <div
        className="lugar-imagen-fallback"
        style={{ display: spot.imagen ? "none" : "flex" }}
      >
        <Lottie
          animationData={uploadAnimation}
          loop
          style={{ width: 160, height: 160 }}
        />
        <span>Sin imagen</span>
      </div>
    </div>

    <div className="lugar-info-container">
      <div className="lugar-nombre-fila">
        <h1 className="lugar-nombre">{spot.nombre}</h1>
        <div className="lugar-acciones-header">
          <button
            type="button"
            className={`btn-guardar-spot-detalle ${esGuardado ? "guardado" : ""}`}
            onClick={handleGuardarSpot}
            aria-label={esGuardado ? "Quitar de guardados" : "Guardar spot"}
            disabled={guardandoSpot}
          >
            {esGuardado ? <FaBookmark /> : <FaRegBookmark />}
            {esGuardado ? "Guardado" : "Guardar"}
          </button>
          <button
            type="button"
            className="btn-reportar-spot"
            onClick={abrirReporteSpot}
          >
            <FaFlag className="btn-icon" />
            Reportar
          </button>
        </div>
      </div>
      <p className="lugar-direccion">
        <FaMapMarkerAlt className="location-icon" />
        {spot.direccion}
      </p>

      <div className="lugar-badges">
        {spot.categoria && (
          <span className="badge-categoria">
            <FaTag className="category-icon" />
            {spot.categoria}
          </span>
        )}
        {spot.localidad && (
          <span className="badge-localidad">
            <FaMapMarkerAlt className="category-icon" />
            {spot.localidad}
          </span>
        )}
        <div className="lugar-rating-badge">
          <FaStar className="star-icon" />
          <span className="rating-text">{spot.rating}</span>
          <span className="reviews-text">
            ({spot.totalResenas} reseñas)
          </span>
        </div>
      </div>

      {spot.descripcion && (
        <div className="lugar-descripcion">
          <h3>
            <FaMapMarkerAlt className="section-icon" /> Descripción
          </h3>
          <p>{spot.descripcion}</p>
        </div>
      )}

      {spot.recomendacion && (
        <div className="lugar-recomendacion">
          <h3>
            <FaHeart className="section-icon" /> ¿Por qué recomendarlo?
          </h3>
          <p>{spot.recomendacion}</p>
        </div>
      )}

      {spot.tipsFoto && (
        <div className="lugar-tips">
          <h3>
            <FaCamera className="section-icon" /> Tips de fotografía
          </h3>
          <p>{spot.tipsFoto}</p>
        </div>
      )}
    </div>
  </>
);

export default SpotInfo;
