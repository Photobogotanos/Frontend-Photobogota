import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaStar,
  FaRegStar,
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
import "./SpotContent.css";

const SpotContent = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [respuestaActiva, setRespuestaActiva] = useState(null); // ID de la reseña que se está respondiendo
  const [respuestas, setRespuestas] = useState({}); // { resenaId: { respuesta, fecha } }

  // Obtener el usuario actual del localStorage
  const usuarioActual = JSON.parse(localStorage.getItem("miembro") || "null");
  const usuarioActualId = usuarioActual?.username || usuarioActual?.nombre || "";

  // === DATOS DE LUGARES ===
  const lugaresData = {
    1: {
      id: 1,
      nombre: "Estación Aguas",
      direccion: "Carrera 3 #19-00, Bogotá",
      imagen: "/images/spots/spot-demo.jpg",
      rating: 4.4,
      totalResenas: 850,
      categoria: "Estación TransMilenio",
      localidad: "La Candelaria",
      descripcion:
        "La estación Aguas es una de las estaciones más representativas del sistema TransMilenio en el centro de Bogotá. Conecta importantes rutas y se encuentra cerca de zonas históricas y culturales de la ciudad.",
      recomendacion:
        "Excelente lugar para fotografiar la arquitectura colonial y moderna de Bogotá. El flujo de personas crea un ambiente único para fotos callejeras.",
      creadorId: "socio",
      resenas: [
        {
          id: 1,
          usuario: "usuario_centro",
          avatar: null,
          rating: 4,
          fecha: "Hace 1 mes",
          comentario:
            "Es una estación muy bien ubicada para moverse por el centro. A veces es concurrida, pero el acceso es rápido.",
        },
      ],
    },

    2: {
      id: 2,
      nombre: "Monserrate",
      direccion: "Carrera 2 Este #21-48, Bogotá",
      imagen: "/images/spots/spot-demo2.jpg",
      rating: 4.7,
      totalResenas: 2340,
      categoria: "Atractivo turístico",
      localidad: "Santa Fe",
      descripcion:
        "Monserrate es uno de los cerros más emblemáticos de Bogotá y un punto clave al inicio de muchos recorridos turísticos. Desde su cima se obtiene una vista panorámica spectacular de toda la ciudad.",
      recomendacion:
        "La vista desde la cima es impresionante, especialmente al amanecer. El teleférico también ofrece oportunidades únicas para fotos del paisaje urbano.",
      tipsFoto:
        "Llegar temprano para evitar las nubes. Un lente gran angular es ideal para capturar la ciudad. Trípode recomendado para fotos de larga exposición.",
      creadorId: "socio",
      resenas: [
        {
          id: 1,
          usuario: "turista_col",
          avatar: null,
          rating: 5,
          fecha: "Hace 2 semanas",
          comentario:
            "Un lugar imperdible en Bogotá. La vista es increíble y el recorrido vale totalmente la pena.",
        },
      ],
    },

    3: {
      id: 3,
      nombre: "Parque El Jazmín",
      direccion: "Barrio El Jazmín, Bogotá",
      imagen: "/images/spots/spot-demo3.jpg",
      rating: 4.3,
      totalResenas: 420,
      categoria: "Parque",
      localidad: "Suba",
      descripcion:
        "El Parque El Jazmín es un espacio verde ideal para la recreación y el descanso de la comunidad. Cuenta con zonas deportivas y áreas para compartir en familia.",
      recomendacion:
        "Perfecto para sesiones de fotos familiares o retratos con fondo de naturaleza urbana. Las tardes soleadas tienen la mejor luz.",
      creadorId: "socio",
      resenas: [
        {
          id: 1,
          usuario: "vecino_jazmin",
          avatar: null,
          rating: 4,
          fecha: "Hace 3 semanas",
          comentario:
            "Buen parque para caminar y hacer deporte. Es tranquilo y bien cuidado.",
        },
      ],
    },

    4: {
      id: 4,
      nombre: "Parque Timiza",
      direccion: "Localidad de Kennedy, Bogotá",
      imagen: "/images/spots/spot-demo4.jpg",
      rating: 4.6,
      totalResenas: 1800,
      categoria: "Parque",
      localidad: "Kennedy",
      descripcion:
        "El Parque Timiza es uno de los parques más grandes del suroccidente de Bogotá. Es muy popular para actividades deportivas, recreativas y encuentros familiares.",
      recomendacion:
        "Gran variedad de actividades para fotografiar. Desde deportistas hasta familias. Los domingos hay ferias locales con oportunidades fotográficas únicas.",
      tipsFoto:
        "Los domingos por la mañana son ideales. Trae un lente rápido para action shots. Las fuentes funcionan bien como elemento de fondo.",
      creadorId: "socio",
      resenas: [
        {
          id: 1,
          usuario: "deporte_bog",
          avatar: null,
          rating: 5,
          fecha: "Hace 1 semana",
          comentario:
            "Excelente parque para hacer ejercicio y pasar el día. Muy amplio y con buenas zonas verdes.",
        },
      ],
    },

    5: {
      id: 5,
      nombre: "Estación Minuto de Dios",
      direccion: "Av. Calle 80, Bogotá",
      imagen: "/images/spots/spot-demo5.jpg",
      rating: 4.2,
      totalResenas: 950,
      categoria: "Estación TransMilenio",
      localidad: "Engativá",
      descripcion:
        "La estación Minuto de Dios es un punto clave del sistema TransMilenio sobre la Calle 80, facilitando el acceso a instituciones educativas, zonas residenciales y comerciales.",
      recomendacion:
        "Arquitectura moderna interesante para fotos urbanas. El área comercial circundante ofrece escenas callejeras auténticas de Bogotá.",
      tipsFoto:
        "Captura la vida urbana por la tarde. La arquitectura de cristal crea reflejos interesantes. Un lente 50mm funciona perfectamente.",
      creadorId: "socio",
      resenas: [
        {
          id: 1,
          usuario: "usuario_tm",
          avatar: null,
          rating: 4,
          fecha: "Hace 1 mes",
          comentario:
            "Funcional y bien ubicada, aunque en horas pico suele llenarse bastante.",
        },
      ],
    },
  };

  useEffect(() => {
    const lugarData = lugaresData[id];
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

    // Simulación de envío
    console.log("Nueva reseña:", nuevaResena);

    await Swal.fire({
      icon: "success",
      title: "¡Reseña enviada!",
      text: "Gracias por compartir tu experiencia.",
      timer: 2000,
      showConfirmButton: false,
      timerProgressBar: true,
    });

    setNuevaResena({ rating: 0, comentario: "" });
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

    // Guardar la respuesta
    setRespuestas({
      ...respuestas,
      [resenaId]: {
        respuesta: respuestaTexto,
        fecha: "Ahora",
        creador: lugar.creadorId,
      },
    });

    setRespuestaActiva(null);

    toast.success("¡Respuesta enviada! Gracias por responder a la reseña.");
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, i) => {
      const starValue = i + 1;
      const isFilled =
        starValue <=
        (isInteractive ? hoverRating || nuevaResena.rating : rating);

      return (
        <span
          key={i}
          className={`star ${isInteractive ? "interactive" : ""}`}
          onClick={
            isInteractive
              ? () => setNuevaResena({ ...nuevaResena, rating: starValue })
              : undefined
          }
          onKeyDown={
            isInteractive
              ? (e) => { if (e.key === 'Enter' || e.key === ' ') setNuevaResena({ ...nuevaResena, rating: starValue }) }
              : undefined
          }
          onMouseEnter={
            isInteractive ? () => setHoverRating(starValue) : undefined
          }
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
          role={isInteractive ? "button" : undefined}
          tabIndex={isInteractive ? 0 : -1}
          aria-label={isInteractive ? `Calificar con ${starValue} estrellas` : undefined}
        >
          {isFilled ? (
            <FaStar className="star-filled" />
          ) : (
            <FaRegStar className="star-empty" />
          )}
        </span>
      );
    });
  };

  if (!lugar) {
    return <div className="lugar-loading">Cargando lugar...</div>;
  }

  // Verificar si el usuario actual es el creador del spot
  const esCreadorDelSpot = usuarioActualId && lugar.creadorId &&
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

        {/* Solo mostrar si el usuario NO es el creador del spot */}
        {!esCreadorDelSpot && (
          <div className="nueva-resena-card">
            <h4>
              <FaPencilAlt className="form-icon" />
              Deja tu reseña
            </h4>
            <form onSubmit={handleSubmitResena}>
              <div className="rating-input">
                <label>Calificación:</label>
                <div className="stars-input">
                  {renderStars(nuevaResena.rating, true)}
                </div>
              </div>

              <div className="comentario-input">
                <textarea
                  placeholder="Cuéntanos tu experiencia en este lugar..."
                  value={nuevaResena.comentario}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, comentario: e.target.value })
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
            <p className="text-muted">Puedes responder las reseñas de los usuarios a continuación.</p>
          </div>
        )}

        {/* Lista de reseñas existentes */}
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
                <div className="resena-rating">
                  {renderStars(resena.rating)}
                </div>
              </div>
              <p className="resena-comentario">{resena.comentario}</p>

              {/* Botón de responder para el creador del spot */}
              {esCreadorDelSpot && !respuestas[resena.id] && respuestaActiva !== resena.id && (
                <button
                  className="btn-responder-resena"
                  onClick={() => setRespuestaActiva(resena.id)}
                >
                  <FaReply className="btn-icon" />
                  Responder
                </button>
              )}

              {/* Formulario de respuesta */}
              {respuestaActiva === resena.id && (
                <div className="respuesta-form">
                  <textarea
                    placeholder="Escribe tu respuesta a esta reseña..."
                    className="respuesta-input"
                    id={`respuesta-${resena.id}`}
                    rows="3"
                  />
                  <div className="respuesta-acciones">
                    <button
                      className="btn-cancelar-respuesta"
                      onClick={() => setRespuestaActiva(null)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="btn-enviar-respuesta"
                      onClick={() => {
                        const input = document.getElementById(`respuesta-${resena.id}`);
                        handleSubmitRespuesta(resena.id, input.value);
                      }}
                    >
                      <FaPaperPlane className="btn-icon" />
                      Enviar
                    </button>
                  </div>
                </div>
              )}

              {/* Mostrar la respuesta si existe */}
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