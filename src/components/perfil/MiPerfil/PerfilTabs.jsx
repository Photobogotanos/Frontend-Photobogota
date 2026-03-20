import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";
import { getSpots } from "@/mocks/spots.helpers";

// Transformar datos del mock al formato que espera SpotCard
const transformarSpotParaCard = (spot) => ({
  title: spot.nombre,
  tags: [spot.categoria],
  rating: spot.rating.toString(),
  likes: spot.totalResenas.toString(),
  img: spot.imagen,
});

// Obtener spots del mock y transformarlos
const spotsDatos = getSpots().map(transformarSpotParaCard);

const spotsEjemplo = spotsDatos.slice(0, 6);

const resenasEjemplo = [
  { title: "Jardín Botánico",          rating: 5, likes: 567, date: "Hace 2 meses",   placeId: "4", text: "Un paraíso natural increíble. Perfecto para senderismo y fotografía." },
  { title: "Restaurante El Cielo",     rating: 4, likes: 234, date: "Hace 1 mes",     placeId: "3", text: "Experiencia gastronómica excepcional con presentación creativa de platos." },
  { title: "Café Bourbon",             rating: 4, likes: 189, date: "Hace 2 semanas", placeId: "2", text: "El mejor café de la ciudad. Ambiente acogedor y personal amable." },
  { title: "Galería de Arte Moderno",  rating: 5, likes: 312, date: "Hace 1 semana",  placeId: "1", text: "Exposiciones increíbles y siempre renovadas." },
  { title: "Museo del oro",            rating: 5, likes: 945, date: "Hace 3 meses",   placeId: "5", text: "La experiencia en el Museo del Oro fue increíble, con una impresionante colección." },
  { title: "Bar Gyal",                 rating: 2, likes: 9,   date: "Hace 20 días",   placeId: "4", text: "Un espacio reducido e incómodo, donde los precios son demasiado altos." },
];

// Usar los mismos spots transformados para guardados (simulando spots guardados por el usuario)
const guardadosEjemplo = spotsDatos.slice(0, 6);

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