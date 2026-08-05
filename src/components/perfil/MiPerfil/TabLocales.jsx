import { FaStore } from "react-icons/fa";
import SpotCard from "../../spots/SpotCard/SpotCard";
import LoadingBlock from "./LoadingBlock";

const TabLocales = ({ cargandoDatos, spotsFormateados, esPerfilPropio }) =>
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
    <div className="no-contenido no-contenido-socio">
      <div className="empty-icon" style={{ color: "#e65100" }}>
        <FaStore size={48} />
      </div>
      <h4 style={{ color: "#e65100" }}>
        {esPerfilPropio ? "Tus Locales" : "Locales"}
      </h4>
      <p>
        {esPerfilPropio
          ? "Administra los locales que tienes verificados en la plataforma."
          : "Este socio aún no tiene locales verificados publicados."}
      </p>
      {esPerfilPropio && (
        <button
          className="btn-explorar"
          style={{ background: "#e65100" }}
          type="button"
          onClick={() => {
            window.location.href = "/locales";
          }}
        >
          Gestionar mis locales
        </button>
      )}
    </div>
  );

export default TabLocales;
