import { Link } from "react-router-dom";
import { FaSignInAlt, FaStar, FaEdit, FaPaperPlane } from "react-icons/fa";
import StarRating from "./StarRating";

const NuevaResenaCard = ({
  logueado,
  miCalificacion,
  editandoResena,
  setEditandoResena,
  handleSubmitCalificacion,
  estadoResena,
  dispatchResena,
  enviandoCalificacion,
  handleCancelarEdicion,
  maxComentario,
}) => (
  <>
    {!logueado ? (
      <div className="nueva-resena-card">
        <h4>
          <FaSignInAlt className="form-icon" /> Iniciá sesión para
          calificar
        </h4>
        <p className="text-muted mb-3">
          Necesitás una cuenta para dejar tu calificación en este spot.
        </p>
        <Link to="/login" className="btn-submit-resena btn-login-resena">
          <FaSignInAlt className="btn-icon" /> Iniciar sesión
        </Link>
      </div>
    ) : (
      <div className="nueva-resena-card">
        {miCalificacion && !editandoResena ? (
          <>
            <h4>
              <FaStar className="form-icon" /> Tu calificación
            </h4>
            <div className="mi-resena-vista">
              <StarRating rating={miCalificacion.estrellas} />
              {miCalificacion.comentario && (
                <p className="resena-comentario">
                  {miCalificacion.comentario}
                </p>
              )}
            </div>
            <button
              type="button"
              className="btn-editar-resena"
              onClick={() => setEditandoResena(true)}
            >
              <FaEdit className="btn-icon" /> Editar
            </button>
          </>
        ) : (
          <>
            <h4>
              <FaStar className="form-icon" />
              {miCalificacion ? "Editar tu calificación" : "Calificá este spot"}
            </h4>
            <form onSubmit={handleSubmitCalificacion}>
              <div className="rating-input">
                <label htmlFor="estrellas">Estrellas</label>
                <div className="stars-input">
                  <StarRating
                    id="estrellas"
                    name="estrellas"
                    rating={estadoResena.nuevaResena.rating}
                    hoverRating={estadoResena.hoverRating}
                    isInteractive
                    onSelect={(valor) =>
                      dispatchResena({ type: "SET_RATING", payload: valor })
                    }
                    onHover={(valor) =>
                      dispatchResena({ type: "SET_HOVER", payload: valor })
                    }
                    onLeave={() =>
                      dispatchResena({ type: "SET_HOVER", payload: 0 })
                    }
                  />
                </div>
              </div>

              <div className="comentario-input">
                <textarea
                  aria-label="Comentario de la calificación"
                  placeholder="Contanos tu experiencia en este spot (opcional)..."
                  rows="3"
                  maxLength={maxComentario}
                  value={estadoResena.nuevaResena.comentario}
                  onChange={(e) =>
                    dispatchResena({
                      type: "SET_COMENTARIO",
                      payload: e.target.value,
                    })
                  }
                />
                <span className="comentario-contador">
                  {estadoResena.nuevaResena.comentario.length}/
                  {maxComentario}
                </span>
              </div>

              <div className="resena-form-acciones">
                <button
                  type="submit"
                  className="btn-submit-resena"
                  disabled={
                    enviandoCalificacion ||
                    estadoResena.nuevaResena.rating < 1
                  }
                >
                  <FaPaperPlane className="btn-icon" />
                  {enviandoCalificacion
                    ? "Enviando..."
                    : miCalificacion
                      ? "Actualizar reseña"
                      : "Enviar calificación"}
                </button>
                {miCalificacion && (
                  <button
                    type="button"
                    className="btn-cancelar-resena"
                    onClick={handleCancelarEdicion}
                    disabled={enviandoCalificacion}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    )}
  </>
);

export default NuevaResenaCard;
