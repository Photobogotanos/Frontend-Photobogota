import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import LoadingBlock from "./LoadingBlock";
import SinContenido from "./SinContenido";

const transformarSpotParaCard = (spot) => ({
  id: spot?.id,
  title: spot?.nombre || "Sin nombre",
  tags: spot?.categoria ? [spot.categoria] : [],
  rating: (spot?.rating ?? 0).toString(),
  likes: (spot?.totalResenas ?? 0).toString(),
  img: spot?.imagen,
});

const TabGuardados = ({ cargandoDatos, guardadosUsuario, refetchGuardados }) =>
  cargandoDatos ? (
    <LoadingBlock />
  ) : guardadosUsuario.length > 0 ? (
    <div className="guardados-grid">
      {guardadosUsuario.map((spot) => {
        const spotCard = transformarSpotParaCard(spot);
        return (
          <SpotCard
            key={spot.id}
            id={spot.id}
            img={spotCard.img}
            title={spotCard.title}
            tags={spotCard.tags}
            rating={spotCard.rating}
            likes={spotCard.likes}
            onToggleGuardado={refetchGuardados}
          />
        );
      })}
    </div>
  ) : (
    <SinContenido
      icono={<GrMapLocation size={48} />}
      titulo="No hay lugares guardados"
      descripcion="Guarda tus lugares favoritos para visitarlos después"
      textBoton="Explorar lugares"
      rutaBoton="/mapa"
    />
  );

export default TabGuardados;
