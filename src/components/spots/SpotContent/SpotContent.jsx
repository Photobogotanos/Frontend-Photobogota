import { useState, useEffect, useReducer, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FiltrosMapa from "@/components/mapa/FiltrosMapa/FiltrosMapa";
import MapaBogota from "@/components/mapa/MapaBogota/MapaBogota";
import StarRating from "./StarRating";
import ReportarModal from "./ReportarModal";
import { resenaReducer, initialResenaState } from "./ResenaReducer";
import {
  FaChevronUp,
  FaChevronDown,
  FaMapMarkerAlt,
  FaStar,
  FaTag,
  FaHeart,
  FaCamera,
  FaCommentDots,
  FaSignInAlt,
  FaPaperPlane,
  FaRegCalendarAlt,
  FaFlag,
  FaEdit,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { obtenerSpotPorId } from "@/services/spot.service";
import {
  obtenerCalificacionesDelSpot,
  crearCalificacion,
  actualizarCalificacion,
} from "@/services/calificacion.service";
import { useAuth } from "@/context/AuthContext";
import { useGuardados } from "@/hooks/useGuardados";
import { toast } from "react-hot-toast";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import "./SpotContent.css";

const MAX_COMENTARIO = 500;

// Extrae el id del autor de una calificación, sin importar la forma exacta
// en la que el backend lo haya serializado (usuario, usuario.id, usuarioId...)
const obtenerIdAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : (calificacion?.usuario?.login ??
      calificacion?.usuario?.id ??
      calificacion?.usuarioId ??
      calificacion?.idUsuario);

const obtenerNombreAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : calificacion?.usuario?.nombreUsuario ||
      calificacion?.usuario?.nombre ||
      calificacion?.nombreUsuario ||
      calificacion?.usuarioNombre ||
      "Usuario";
const MapaContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, logueado } = useAuth();
  const { isGuardado, toggleGuardado } = useGuardados();
  const [spot, setSpot] = useState(null);
  const [cargandoSpot, setCargandoSpot] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [guardandoSpot, setGuardandoSpot] = useState(false);

  // Calificaciones (estrellas) del spot
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargandoCalificaciones, setCargandoCalificaciones] = useState(false);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [enviandoCalificacion, setEnviandoCalificacion] = useState(false);
  // Controla si el formulario de "mi calificación" está en modo edición.
  // Cuando el usuario ya calificó, por defecto se muestra en modo lectura.
  const [editandoResena, setEditandoResena] = useState(false);
  const [estadoResena, dispatchResena] = useReducer(
    resenaReducer,
    initialResenaState,
  );

  // Popup de reporte: puede abrirse desde una reseña puntual
  // (contextoReporte con resenaId) o desde el spot en general (contextoReporte null).
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [contextoReporte, setContextoReporte] = useState(null);

  const abrirReporteSpot = () => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte(null);
    setModalReporteAbierto(true);
  };

  const abrirReporteResena = (resenaId, nombreAutorResena) => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte({ resenaId, nombreAutorResena });
    setModalReporteAbierto(true);
  };

  const cerrarReporte = () => {
    setModalReporteAbierto(false);
    setContextoReporte(null);
  };

  const handleGuardarSpot = async () => {
    if (!logueado) {
      toast.error("Inicia sesión para guardar spots");
      return;
    }
    setGuardandoSpot(true);
    const resultado = await toggleGuardado(id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
    } else {
      toast.error(resultado.mensaje);
    }
    setGuardandoSpot(false);
  };

  useEffect(() => {
    if (id) {
      const cargarSpot = async () => {
        setCargandoSpot(true);
        const resultado = await obtenerSpotPorId(id);
        if (resultado.exitoso) {
          setSpot(resultado.datos);
        } else {
          toast.error(resultado.mensaje);
        }
        setCargandoSpot(false);
      };
      cargarSpot();
    }
  }, [id]);

  // Trae todas las calificaciones del spot y detecta si el usuario logueado
  // ya tiene una entrada propia, para pasar el formulario a modo edición.
  const cargarCalificaciones = useCallback(
    async (spotId) => {
      setCargandoCalificaciones(true);
      const resultado = await obtenerCalificacionesDelSpot(spotId);

      if (resultado.exitoso) {
        setCalificaciones(resultado.datos);

        const idUsuarioLogueado = usuario?.nombreUsuario ?? usuario?.login ?? usuario?.id;
        const propia = idUsuarioLogueado
          ? resultado.datos.find(
              (calificacion) =>
                obtenerIdAutorCalificacion(calificacion) === idUsuarioLogueado,
            )
          : null;

        if (propia) {
          setMiCalificacion(propia);
          dispatchResena({ type: "SET_RATING", payload: propia.estrellas });
          dispatchResena({
            type: "SET_COMENTARIO",
            payload: propia.comentario || "",
          });
        } else {
          setMiCalificacion(null);
          dispatchResena({ type: "RESET_FORM" });
        }
      } else {
        toast.error(resultado.mensaje);
      }

      setCargandoCalificaciones(false);
    },
    [usuario],
  );

  useEffect(() => {
    if (id) {
      cargarCalificaciones(id);
    }
  }, [id, cargarCalificaciones]);

  const handleSubmitCalificacion = async (evento) => {
    evento.preventDefault();

    if (!logueado) {
      toast.error("Debes iniciar sesión para calificar este spot");
      return;
    }

    const estrellas = estadoResena.nuevaResena.rating;
    const comentario = estadoResena.nuevaResena.comentario.trim();

    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
      toast.error("Seleccioná una calificación entre 1 y 5 estrellas");
      return;
    }

    if (comentario.length > MAX_COMENTARIO) {
      toast.error(
        `El comentario no puede superar los ${MAX_COMENTARIO} caracteres`,
      );
      return;
    }

    setEnviandoCalificacion(true);

    const body = { estrellas, comentario };

    const resultado = miCalificacion
      ? await actualizarCalificacion(id, miCalificacion.id, body)
      : await crearCalificacion(id, body);

    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      await cargarCalificaciones(id);
      setEditandoResena(false);
    } else {
      toast.error(resultado.mensaje);
    }

    setEnviandoCalificacion(false);
  };

  // Descarta cambios sin guardar y vuelve a la vista de solo lectura con
  // los valores que ya estaban guardados.
  const handleCancelarEdicion = () => {
    if (miCalificacion) {
      dispatchResena({ type: "SET_RATING", payload: miCalificacion.estrellas });
      dispatchResena({
        type: "SET_COMENTARIO",
        payload: miCalificacion.comentario || "",
      });
    }
    setEditandoResena(false);
  };

  if (cargandoSpot) {
    return (
      <div className="lugar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (spot) {
    return (
      <div className="lugar-content-wrapper">
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
                className={`btn-guardar-spot-detalle ${isGuardado(spot.id) ? "guardado" : ""}`}
                onClick={handleGuardarSpot}
                aria-label={isGuardado(spot.id) ? "Quitar de guardados" : "Guardar spot"}
                disabled={guardandoSpot}
              >
                {isGuardado(spot.id) ? <FaBookmark /> : <FaRegBookmark />}
                {isGuardado(spot.id) ? "Guardado" : "Guardar"}
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

        <div className="resenas-container">
          <h3 className="resenas-titulo">
            <FaCommentDots className="section-icon" /> Calificaciones
          </h3>

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
                      <label>Estrellas</label>
                      <div className="stars-input">
                        <StarRating
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
                        placeholder="Contanos tu experiencia en este spot (opcional)..."
                        rows="3"
                        maxLength={MAX_COMENTARIO}
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
                        {MAX_COMENTARIO}
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

          {cargandoCalificaciones ? (
            <div className="lugar-loading">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : calificaciones.length > 0 ? (
            <div className="resenas-lista">
              {calificaciones.map((calificacion) => {
                const idUsuarioLogueado = usuario?.nombreUsuario ?? usuario?.login ?? usuario?.id;
                const esPropia =
                  idUsuarioLogueado &&
                  obtenerIdAutorCalificacion(calificacion) ===
                    idUsuarioLogueado;
                const nombreAutor =
                  obtenerNombreAutorCalificacion(calificacion);
                const fecha =
                  calificacion.fechaCreacion ||
                  calificacion.fecha ||
                  calificacion.createdAt;

                const navegarAlPerfil = (e) => {
                  e.stopPropagation();
                  navigate(
                    esPropia ? "/perfil" : `/usuario/${nombreAutor}`,
                  );
                };

                return (
                  <div key={calificacion.id} className="resena-card">
                    <div className="resena-header">
                      <div className="resena-usuario">
                        <div
                          className="usuario-avatar"
                          onClick={navegarAlPerfil}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              navegarAlPerfil(e);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={
                            esPropia
                              ? "Ver tu perfil"
                              : `Ver perfil de ${nombreAutor}`
                          }
                        >
                          <div className="avatar-placeholder">
                            {nombreAutor.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="usuario-info">
                          <span
                            className="usuario-nombre"
                            onClick={navegarAlPerfil}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navegarAlPerfil(e);
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            style={{ cursor: "pointer" }}
                            aria-label={
                              esPropia
                                ? "Ver tu perfil"
                                : `Ver perfil de ${nombreAutor}`
                            }
                          >
                            {nombreAutor}
                            {esPropia && (
                              <span className="mi-resena-badge">(Tú)</span>
                            )}
                          </span>
                          {fecha && (
                            <span className="resena-fecha">
                              <FaRegCalendarAlt className="date-icon" />
                              {fecha}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="resena-rating">
                        <StarRating rating={calificacion.estrellas} />
                      </div>
                    </div>
                    {calificacion.comentario && (
                      <p className="resena-comentario">
                        {calificacion.comentario}
                      </p>
                    )}
                    {!esPropia && (
                      <div className="resena-acciones">
                        <button
                          type="button"
                          className="btn-reportar-resena"
                          onClick={() =>
                            abrirReporteResena(calificacion.id, nombreAutor)
                          }
                        >
                          <FaFlag className="btn-icon" />
                          Reportar
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="resenas-nota-vacia">
              Todavía no hay calificaciones para este spot. ¡Sé el primero en
              calificar!
            </p>
          )}
        </div>

        <ReportarModal
          show={modalReporteAbierto}
          onCerrar={cerrarReporte}
          spotId={spot.id}
          resenaId={contextoReporte?.resenaId ?? null}
          nombreAutorResena={contextoReporte?.nombreAutorResena ?? null}
        />
      </div>
    );
  }

  return (
    <div className="mapa-content-container">
      <button
        className="toggle-filtros-btn"
        onClick={() => setFiltrosVisibles(!filtrosVisibles)}
      >
        {filtrosVisibles ? <FaChevronUp /> : <FaChevronDown />}
        <span>{filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}</span>
      </button>

      {filtrosVisibles && (
        <Row className="mapa-row filtros-row">
          <Col className="p-0">
            <FiltrosMapa onFiltrar={setFiltrosActivos} />
          </Col>
        </Row>
      )}

      <Row className="mapa-row">
        <Col className="p-0">
          <MapaBogota filtros={filtrosActivos} />
        </Col>
      </Row>
    </div>
  );
};

export default MapaContent;