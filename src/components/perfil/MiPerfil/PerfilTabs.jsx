import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";


const spotsEjemplo = [
  { title: "Alcaldía local Barrios Unidos", tags: ["Naturaleza", "Spots"], rating: "4.8", likes: "294" },
  { title: "Parroquia San Anselmo",         tags: ["Spots"],               rating: "2.6", likes: "12"  },
  { title: "Cl. 152 #9-57, Bogotá",         tags: ["Naturaleza", "Spots"], rating: "3.8", likes: "65"  },
  { title: "Parque de Bavaria",             tags: ["Urbano", "Spots"],     rating: "4.3", likes: "79"  },
  { title: "Cl. 152 #9-57, Bogotá",         tags: ["Naturaleza", "Spots"], rating: "3.8", likes: "65"  },
  { title: "Parque de Bavaria",             tags: ["Urbano", "Spots"],     rating: "4.3", likes: "79"  },
];

const resenasEjemplo = [
  { title: "Jardín Botánico",          rating: 5, likes: 567, date: "Hace 2 meses",   placeId: "4", text: "Un paraíso natural increíble. Perfecto para senderismo y fotografía." },
  { title: "Restaurante El Cielo",     rating: 4, likes: 234, date: "Hace 1 mes",     placeId: "3", text: "Experiencia gastronómica excepcional con presentación creativa de platos." },
  { title: "Café Bourbon",             rating: 4, likes: 189, date: "Hace 2 semanas", placeId: "2", text: "El mejor café de la ciudad. Ambiente acogedor y personal amable." },
  { title: "Galería de Arte Moderno",  rating: 5, likes: 312, date: "Hace 1 semana",  placeId: "1", text: "Exposiciones increíbles y siempre renovadas." },
  { title: "Museo del oro",            rating: 5, likes: 945, date: "Hace 3 meses",   placeId: "5", text: "La experiencia en el Museo del Oro fue increíble, con una impresionante colección." },
  { title: "Bar Gyal",                 rating: 2, likes: 9,   date: "Hace 20 días",   placeId: "4", text: "Un espacio reducido e incómodo, donde los precios son demasiado altos." },
];

const guardadosEjemplo = [
  { title: "Café Bourbon",                       tags: ["Café", "Spots"],              rating: "4.7", likes: "189" },
  { title: "Galería de Arte Moderno",            tags: ["Arte", "Cultural"],            rating: "4.5", likes: "156" },
  { title: "Teatro Nacional",                    tags: ["Teatro", "Cultural"],          rating: "4.8", likes: "278" },
  { title: "Mirador de la Calera",               tags: ["Vistas", "Montaña"],          rating: "4.6", likes: "124" },
  { title: "Restaurante Andrés Carne de Res",    tags: ["Restaurante", "Nocturno"],    rating: "4.4", likes: "367" },
  { title: "Parque de la 93",                    tags: ["Parque", "Urbano"],           rating: "4.2", likes: "89"  },
  { title: "Usaquén - Mercado de las Pulgas",    tags: ["Mercado", "Artesanías"],      rating: "4.3", likes: "142" },
  { title: "Cinemateca Distrital",               tags: ["Cine", "Cultural"],           rating: "4.1", likes: "67"  },
  { title: "Biblioteca Virgilio Barco",          tags: ["Biblioteca", "Arquitectura"], rating: "4.7", likes: "98"  },
  { title: "Zona G - Gastronómica",              tags: ["Gastronomía", "Restaurantes"],rating: "4.5", likes: "213" },
  { title: "Parque Simón Bolívar",               tags: ["Parque", "Naturaleza"],       rating: "4.6", likes: "178" },
  { title: "Monserrate",                         tags: ["Religioso", "Vistas"],        rating: "4.9", likes: "456" },
];

// --- Sub-componente: mensaje cuando no hay contenido ---
// Lo ponemos aquí mismo porque solo se usa en este archivo
const SinContenido = ({ icono, titulo, descripcion, textBoton, rutaBoton }) => {
  const navigate = useNavigate();
  return (
    <div className="no-contenido">
      <div className="empty-icon">{icono}</div>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
      <button className="btn-explorar" onClick={() => navigate(rutaBoton)}>
        {textBoton}
      </button>
    </div>
  );
};

// --- Componente principal de tabs ---
const PerfilTabs = ({ tab, dispatch, tienePublicaciones, tieneResenas, tieneGuardados }) => {
  return (
    <>
      {/* BOTONES DE NAVEGACIÓN */}
      <div className="perfil-tabs">
        <button
          className={tab === "publicaciones" ? "tab-activa" : ""}
          onClick={() => dispatch({ type: "SET_TAB", payload: "publicaciones" })}
        >
          Mis Spots
        </button>
        <button
          className={tab === "resenas" ? "tab-activa" : ""}
          onClick={() => dispatch({ type: "SET_TAB", payload: "resenas" })}
        >
          Reseñas
        </button>
        <button
          className={tab === "guardados" ? "tab-activa" : ""}
          onClick={() => dispatch({ type: "SET_TAB", payload: "guardados" })}
        >
          Guardados
        </button>
      </div>

      {/* CONTENIDO SEGÚN PESTAÑA ACTIVA */}
      <div className="perfil-tab-content">

        {/* PESTAÑA: MIS SPOTS */}
        {tab === "publicaciones" && (
          tienePublicaciones ? (
            <div className="publicaciones-grid">
              {spotsEjemplo.map((spot, i) => (
                <SpotCard
                  key={i}
                  img="public/images/publicaciones/default-post.jpg"
                  title={spot.title}
                  tags={spot.tags}
                  rating={spot.rating}
                  likes={spot.likes}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<FaMapMarkerAlt size={48} />}
              titulo="No tienes publicaciones"
              descripcion="Comparte tus lugares favoritos para que otros los descubran"
              textBoton="¡Crea tu primera publicación!"
              rutaBoton="/crear-publicacion"
            />
          )
        )}

        {/* PESTAÑA: RESEÑAS */}
        {tab === "resenas" && (
          tieneResenas ? (
            <div className="reviews-grid">
              {resenasEjemplo.map((resena, i) => (
                <ReviewCard
                  key={i}
                  title={resena.title}
                  rating={resena.rating}
                  text={resena.text}
                  likes={resena.likes}
                  date={resena.date}
                  placeId={resena.placeId}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<FaRegEdit size={48} />}
              titulo="No tienes reseñas"
              descripcion="Comparte tu experiencia sobre los lugares que visitas"
              textBoton="Escribir primera reseña"
              rutaBoton="/mapa"
            />
          )
        )}

        {/* PESTAÑA: GUARDADOS */}
        {tab === "guardados" && (
          tieneGuardados ? (
            <div className="guardados-grid">
              {guardadosEjemplo.map((spot, i) => (
                <SpotCard
                  key={i}
                  img="public/images/publicaciones/default-post.jpg"
                  title={spot.title}
                  tags={spot.tags}
                  rating={spot.rating}
                  likes={spot.likes}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<GrMapLocation size={48} />}
              titulo="No hay lugares guardados"
              descripcion="Guarda tus lugares favoritos, para visitarlos después"
              textBoton="Explorar lugares"
              rutaBoton="/mapa"
            />
          )
        )}

      </div>
    </>
  );
};

export default PerfilTabs;