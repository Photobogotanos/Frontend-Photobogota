import { FaChartLine } from "react-icons/fa";

const EstadisticasHeader = ({ periodo, setPeriodo }) => {
  return (
    <div className="estadisticas-header">
      <div className="header-info">
        <h1 className="header-titulo">
          <FaChartLine className="header-icon" />
          Estadísticas de tu Negocio
        </h1>
        <p className="header-subtitulo">
          Monitora el rendimiento de tus lugares y promotions
        </p>
      </div>
      
      <div className="header-controles">
        <div className="selector-periodo">
          <button
            className={`periodo-btn ${periodo === "semana" ? "activo" : ""}`}
            onClick={() => setPeriodo("semana")}
            aria-pressed={periodo === "semana"}
          >
            Semana
          </button>
          <button
            className={`periodo-btn ${periodo === "mes" ? "activo" : ""}`}
            onClick={() => setPeriodo("mes")}
            aria-pressed={periodo === "mes"}
          >
            Mes
          </button>
          <button
            className={`periodo-btn ${periodo === "ano" ? "activo" : ""}`}
            onClick={() => setPeriodo("ano")}
            aria-pressed={periodo === "ano"}
          >
            Año
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasHeader;
