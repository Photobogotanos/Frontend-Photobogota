import { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaMapMarkerAlt,
  FaImages,
  FaMap,
  FaClock,
  FaInfoCircle,
  FaComments,
  FaPencilAlt,
  FaPaperPlane,
  FaTag,
  FaHeart,
  FaCamera,
  FaReply,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

// Componentes extraídos
import StarRating from "./StarRating";
import RespuestaForm from "./RespuestaForm";
import { resenaReducer, initialResenaState } from "./ResenaReducer";

import { getSpotById } from "@/mocks/spots.helpers";

import "./SpotContent.css";

const SpotContent = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);

  // Un solo useReducer reemplaza los 5 useState anteriores
  const [state, dispatch] = useReducer(resenaReducer, initialResenaState);
  const { nuevaResena, hoverRating, respuestaActiva, respuestas } = state;

  // Obtener el usuario actual del localStorage
  const usuarioActual = JSON.parse(localStorage.getItem("miembro") || "null");
  const usuarioActualId = usuarioActual?.username || usuarioActual?.nombre || "";

  useEffect(() => {
    const lugarData = getSpotById(id);
    if (lugarData) setLugar(lugarData);
  }, [id]);

  const handleSubmitResena = async (e) => {
    e.preventDefault();

    if (nuevaResena.rating === 0) {
      Swal.fire({
        icon: "warning",
        title: "Falta la calificación",
        text: "Por favor selecciona cuántas estrellas le das al lugar.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    if (nuevaResena.comentario.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "Falta el comentario",
        text: "Escribe tu experiencia para ayudar a otros usuarios.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    console.log("Nueva reseña:", nuevaResena);

    await Swal.fire({
      icon: "success",
      title: "¡Reseña enviada!",
      text: "Gracias por compartir tu experiencia.",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    dispatch({ type: "RESET_FORM" });
  };

  const handleSubmitRespuesta = async (resenaId, respuestaTexto) => {
    if (!respuestaTexto.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta la respuesta",
        text: "Por favor escribe una respuesta a la reseña.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    dispatch({
      type: "ADD_RESPUESTA",
      resenaId,
      payload: { respuesta: respuestaTexto, fecha: "Ahora", creador: lugar.creadorId },
    });

    toast.success("¡Respuesta enviada! Gracias por responder a la reseña.");
  };

  if (!lugar) {
    return <div className="lugar-loading">Cargando lugar...</div>;
  }

  // Verificar si el usuario actual es el creador del spot
  const esCreadorDelSpot =
    usuarioActualId &&
    lugar.creadorId &&
    usuarioActualId.replace("@", "").toLowerCase() === lugar.creadorId.toLowerCase();

  return (
    <div className="lugar-content-wrapper">
      {/* Imagen principal */}
      <div className="lugar-imagen-principal">
        <img src={lugar.imagen} alt={lugar.nombre} />
      </div>

      {/* Información principal */}
      <div className="lugar-info-container">
        <h1 className="lugar-nombre">{lugar.nombre}</h1>
        <p className="lugar-direccion">
          <FaMapMarkerAlt className="location-icon" />
          {lugar.direccion}
        </p>

        <div className="lugar-badges">
          <span className="badge-categoria">
            <FaTag className="category-icon" />
            {lugar.categoria}
          </span>
          {lugar.localidad && (
            <span className="badge-localidad">
              <FaMapMarkerAlt className="category-icon" />
              {lugar.localidad}
            </span>
          )}
          <div className="lugar-rating-badge">
            <FaStar className="star-icon" />
            <span className="rating-text">{lugar.rating}</span>
            <span className="reviews-text">({lugar.totalResenas} reseñas)</span>
          </div>
        </div>

        <div className="lugar-acciones">
          <button className="btn-ver-mapa">
            <FaMap className="btn-icon" />
            Ver en mapa
          </button>
          <button className="btn-galeria">
            <FaImages className="btn-icon" />
            Galería
          </button>
        </div>

        <div className="lugar-descripcion">
          <h3>
            <FaInfoCircle className="section-icon" />
            Sobre este lugar
          </h3>
          <p>{lugar.descripcion}</p>
        </div>

        {lugar.recomendacion && (
          <div className="lugar-recomendacion">
            <h3>
              <FaHeart className="section-icon" />
              ¿Por qué recomendarlo?
            </h3>
            <p>{lugar.recomendacion}</p>
          </div>
        )}

        {lugar.tipsFoto && (
          <div className="lugar-tips">
            <h3>
              <FaCamera className="section-icon" />
              Tips de fotografía
            </h3>
            <p>{lugar.tipsFoto}</p>
          </div>
        )}
      </div>

      {/* Sección de reseñas */}
      <div className="resenas-container">
        <h2 className="resenas-titulo">
          <FaComments className="section-icon" />
          Reseñas
        </h2>

        {/* Formulario de nueva reseña: solo si el usuario NO es el creador */}
        {!esCreadorDelSpot && (
          <div className="nueva-resena-card">
            <h4>
              <FaPencilAlt className="form-icon" />
              Deja tu reseña
            </h4>
            <form onSubmit={handleSubmitResena}>
              <div className="rating-input">
                {/* FIX: label asociado con htmlFor + id en el textarea */}
                <label htmlFor="resena-comentario">Calificación:</label>
                <div className="stars-input">
                  <StarRating
                    rating={nuevaResena.rating}
                    isInteractive
                    hoverRating={hoverRating}
                    onSelect={(val) => dispatch({ type: "SET_RATING", payload: val })}
                    onHover={(val) => dispatch({ type: "SET_HOVER", payload: val })}
                    onLeave={() => dispatch({ type: "SET_HOVER", payload: 0 })}
                  />
                </div>
              </div>

              <div className="comentario-input">
                <textarea
                  id="resena-comentario"
                  placeholder="Cuéntanos tu experiencia en este lugar..."
                  value={nuevaResena.comentario}
                  onChange={(e) =>
                    dispatch({ type: "SET_COMENTARIO", payload: e.target.value })
                  }
                  rows="4"
                />
              </div>

              <button type="submit" className="btn-submit-resena">
                <FaPaperPlane className="btn-icon" />
                Enviar reseña
              </button>
            </form>
          </div>
        )}

        {/* Mensaje para el creador del spot */}
        {esCreadorDelSpot && (
          <div className="info-creador-spot">
            <p>Eres el creador de este spot. ¡Gracias por compartirlo!</p>
            <p className="text-muted">
              Puedes responder las reseñas de los usuarios a continuación.
            </p>
          </div>
        )}

        {/* Lista de reseñas — key={resena.id} (id estable, no índice de array) */}
        <div className="resenas-lista">
          {lugar.resenas.map((resena) => (
            <div key={resena.id} className="resena-card">
              <div className="resena-header">
                <div className="resena-usuario">
                  <div className="usuario-avatar">
                    {resena.avatar ? (
                      <img src={resena.avatar} alt={resena.usuario} />
                    ) : (
                      <div className="avatar-placeholder">
                        {resena.usuario[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="usuario-info">
                    <span className="usuario-nombre">{resena.usuario}</span>
                    <span className="resena-fecha">
                      <FaClock className="date-icon" />
                      {resena.fecha}
                    </span>
                  </div>
                </div>
                {/* Estrellas de solo lectura */}
                <div className="resena-rating">
                  <StarRating rating={resena.rating} />
                </div>
              </div>
              <p className="resena-comentario">{resena.comentario}</p>

              {/* Botón responder: solo para el creador */}
              {esCreadorDelSpot && !respuestas[resena.id] && respuestaActiva !== resena.id && (
                <button
                  className="btn-responder-resena"
                  onClick={() =>
                    dispatch({ type: "SET_RESPUESTA_ACTIVA", payload: resena.id })
                  }
                >
                  <FaReply className="btn-icon" />
                  Responder
                </button>
              )}

              {/* Formulario de respuesta inline */}
              {respuestaActiva === resena.id && (
                <RespuestaForm
                  resenaId={resena.id}
                  onEnviar={handleSubmitRespuesta}
                  onCancelar={() =>
                    dispatch({ type: "SET_RESPUESTA_ACTIVA", payload: null })
                  }
                />
              )}

              {/* Respuesta ya guardada */}
              {respuestas[resena.id] && (
                <div className="resena-respuesta">
                  <div className="respuesta-header">
                    <span className="respuesta-label">
                      <FaReply className="respuesta-icon" />
                      Respuesta del creador:
                    </span>
                    <span className="respuesta-fecha">{respuestas[resena.id].fecha}</span>
                  </div>
                  <p className="respuesta-texto">{respuestas[resena.id].respuesta}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpotContent;