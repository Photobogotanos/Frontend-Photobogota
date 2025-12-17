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
} from "react-icons/fa";
import Swal from "sweetalert2"; // ← Nueva importación
import "./LugarContent.css";

const LugarContent = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // === DATOS DE LUGARES (mismo que tenías) ===
  const lugaresData = {
    1: {
      id: 1,
      nombre: "Estación Aguas",
      direccion: "Carrera 3 #19-00, Bogotá",
      imagen: "/images/spots/spot-demo.jpg",
      rating: 4.4,
      totalResenas: 850,
      categoria: "Estación TransMilenio",
      descripcion:
        "La estación Aguas es una de las estaciones más representativas del sistema TransMilenio en el centro de Bogotá. Conecta importantes rutas y se encuentra cerca de zonas históricas y culturales de la ciudad.",
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
      descripcion:
        "Monserrate es uno de los cerros más emblemáticos de Bogotá y un punto clave al inicio de muchos recorridos turísticos. Desde su cima se obtiene una vista panorámica espectacular de toda la ciudad.",
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
      descripcion:
        "El Parque El Jazmín es un espacio verde ideal para la recreación y el descanso de la comunidad. Cuenta con zonas deportivas y áreas para compartir en familia.",
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
      descripcion:
        "El Parque Timiza es uno de los parques más grandes del suroccidente de Bogotá. Es muy popular para actividades deportivas, recreativas y encuentros familiares.",
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
      descripcion:
        "La estación Minuto de Dios es un punto clave del sistema TransMilenio sobre la Calle 80, facilitando el acceso a instituciones educativas, zonas residenciales y comerciales.",
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
          onMouseEnter={
            isInteractive ? () => setHoverRating(starValue) : undefined
          }
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
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
      </div>

      {/* Sección de reseñas */}
      <div className="resenas-container">
        <h2 className="resenas-titulo">
          <FaComments className="section-icon" />
          Reseñas
        </h2>

        {/* Formulario nueva reseña */}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LugarContent;
