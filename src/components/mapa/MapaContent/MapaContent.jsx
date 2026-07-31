import { useState } from "react";
import FiltrosMapa from "@/components/mapa/FiltrosMapa/FiltrosMapa";
import MapaBogota from "@/components/mapa/MapaBogota/MapaBogota";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import "./MapaContent.css";

const MapaContent = () => {
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);
  const [filtros, setFiltros] = useState({});

  return (
    <div
      className={`mapa-content-container ${filtrosVisibles ? "con-filtros" : "sin-filtros"}`}
    >
      {filtrosVisibles && (
        <div className="filtros-panel">
          <FiltrosMapa onFiltrar={setFiltros} />
        </div>
      )}

      <div className="mapa-area">
        <button
          type="button"
          className="toggle-filtros-btn"
          onClick={() => setFiltrosVisibles((v) => !v)}
          aria-expanded={filtrosVisibles}
        >
          {filtrosVisibles ? <FaChevronUp /> : <FaChevronDown />}
          <span>{filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}</span>
        </button>

        <MapaBogota filtros={filtros} />
      </div>
    </div>
  );
};

export default MapaContent;
