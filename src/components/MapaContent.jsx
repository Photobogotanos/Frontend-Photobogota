import FiltrosMapa from "./FiltrosMapa";
import MapaBogota from "./MapaBogota";
import "./MapaContent.css";

const MapaContent = () => {
  return (
    <div className="mapa-content-container">
      <FiltrosMapa />
      <MapaBogota />
    </div>
  );
};

export default MapaContent;