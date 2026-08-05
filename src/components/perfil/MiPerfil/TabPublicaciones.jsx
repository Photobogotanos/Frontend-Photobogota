import { FaMapMarkerAlt } from "react-icons/fa";
import SpotCard from "../../spots/SpotCard/SpotCard";
import LoadingBlock from "./LoadingBlock";
import SinContenido from "./SinContenido";

const TabPublicaciones = ({ cargandoDatos, spotsFormateados, esPerfilPropio }) =>
  cargandoDatos ? (
    <LoadingBlock />
  ) : spotsFormateados.length > 0 ? (
    <div className="publicaciones-grid">
      {spotsFormateados.map((spot) => (
        <SpotCard
          key={spot.id}
          id={spot.id}
          img={spot.img}
          title={spot.title}
          rating={spot.rating}
          likes={spot.likes}
          tags={spot.tags}
        />
      ))}
    </div>
  ) : (
    <SinContenido
      icono={<FaMapMarkerAlt size={48} />}
      titulo={
        esPerfilPropio
          ? "No tienes publicaciones"
          : "Aún no tiene publicaciones"
      }
      descripcion={
        esPerfilPropio
          ? "Comparte tus lugares favoritos para que otros los descubran"
          : "Este usuario aún no ha compartido spots."
      }
      textBoton={esPerfilPropio ? "¡Crea tu primera publicación!" : null}
      rutaBoton={esPerfilPropio ? "/crear-spot" : null}
    />
  );

export default TabPublicaciones;
