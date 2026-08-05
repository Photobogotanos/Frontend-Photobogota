import { FaRegEdit } from "react-icons/fa";
import ReviewCard from "../ReviewCard/ReviewCard";
import LoadingBlock from "./LoadingBlock";
import SinContenido from "./SinContenido";

const TabResenas = ({ cargandoDatos, resenasUsuario, esPerfilPropio }) =>
  cargandoDatos ? (
    <LoadingBlock />
  ) : resenasUsuario.length > 0 ? (
    <div className="reviews-grid">
      {resenasUsuario.map((resena) => (
        <ReviewCard
          key={resena.id}
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
      titulo={esPerfilPropio ? "No tienes reseñas" : "Sin reseñas"}
      descripcion={
        esPerfilPropio
          ? "Comparte tu experiencia sobre los lugares que visitas"
          : "Este usuario aún no ha dejado reseñas."
      }
      textBoton={esPerfilPropio ? "Escribir primera reseña" : null}
      rutaBoton={esPerfilPropio ? "/mapa" : null}
    />
  );

export default TabResenas;
