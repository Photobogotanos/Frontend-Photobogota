import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";
import { getSpots } from "@/mocks/spots.helpers";

// Transformar datos del mock al formato que espera SpotCard
const transformarSpotParaCard = (spot) => ({
  id: spot.id, // Preservar el ID único para usar como key
  title: spot.nombre,
  tags: [spot.categoria],
  rating: spot.rating.toString(),
  likes: spot.totalResenas.toString(),
  img: spot.imagen,
});

// Obtener spots del mock y transformarlos
const spotsDatos = getSpots().map(transformarSpotParaCard);

const resenasEjemplo = [
  { title: "Estación Aguas",          rating: 5, likes: 850, date: "Hace 1 mes",     placeId: 1, text: "Es una estación muy bien ubicada para moverse por el centro. A veces es concurrida, pero el acceso es rápido." },
  { title: "Monserrate",              rating: 5, likes: 2340, date: "Hace 2 semanas", placeId: 2, text: "Un lugar imperdible en Bogotá. La vista es increíble y el recorrido vale totalmente la pena." },
  { title: "Parque El Jazmín",        rating: 4, likes: 420, date: "Hace 3 semanas", placeId: 3, text: "Buen parque para caminar y hacer deporte. Es tranquilo y bien cuidado." },
  { title: "Parque Timiza",            rating: 5, likes: 1800, date: "Hace 1 semana",  placeId: 4, text: "Excelente parque para hacer ejercicio y pasar el día. Muy amplio y con buenas zonas verdes." },
  { title: "Estación Minuto de Dios", rating: 4, likes: 950, date: "Hace 1 mes",     placeId: 5, text: "Funcional y bien ubicada, aunque en horas pico suele llenarse bastante." },
];

// Usar los mismos spots transformados para guardados (simulando spots guardados por el usuario)
const guardadosEjemplo = spotsDatos.slice(0, 6);

// Mensaje cuando no hay contenido en una pestaña
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
              {spotsDatos.map((spot) => (    // ya no usamos spotsEjemplo, usamos el mock real
                <SpotCard
                  key={spot.id}             // id único del mock
                  id={spot.id}              //id para poder navegar al lugar al hacer click
                  img={spot.img}          // spotsDatos tiene la propiedad 'img' (transformada de 'imagen')
                  title={spot.title}       // spotsDatos tiene la propiedad 'title' (transformada de 'nombre')
                  rating={spot.rating}      // coincide igual
                  likes={spot.totalResenas} // mock: "totalResenas" → SpotCard: "likes"
                  tags={[spot.categoria]}   // categoria es string, SpotCard espera array
                  
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
                  key={resena.placeId} 
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
              {guardadosEjemplo.map((spot) => (
                <SpotCard
                  key={spot.id}
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