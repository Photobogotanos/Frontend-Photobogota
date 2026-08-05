import { FaTerminal, FaFileAlt, FaSync } from "react-icons/fa";

const LogHeader = ({
  modoDemo,
  logsFiltrados,
  estadisticas,
  autoRefresh,
  onToggleAutoRefresh,
  NIVELES_LOG,
}) => {
  return (
    <div className="log-viewer-header">
      <div className="header-info">
        <h1 className="header-titulo">
          <FaTerminal /> Visualizador de Logs
          {modoDemo && (
            <span
              style={{
                fontSize: "0.75rem",
                fontWeight: 500,
                background: "#fef3c7",
                color: "#92400e",
                padding: "2px 10px",
                borderRadius: 20,
                marginLeft: 8,
              }}
            >
              DEMO
            </span>
          )}
        </h1>
        <div className="log-stats-badges">
          <span className="stat-badge">
            <FaFileAlt /> Total: {logsFiltrados.length} líneas
          </span>
          {Object.entries(estadisticas).map(
            ([nivel, count]) =>
              count > 0 && (
                <span
                  key={nivel}
                  className={`stat-badge stat-${nivel.toLowerCase()}`}
                  style={{
                    backgroundColor: NIVELES_LOG[nivel].bg,
                    color: NIVELES_LOG[nivel].color,
                  }}
                >
                  {NIVELES_LOG[nivel].icon} {nivel}: {count}
                </span>
              ),
          )}
        </div>
      </div>
      <div className="log-stats">
        <button
          type="button"
          className={`auto-refresh-btn ${autoRefresh ? "active" : ""}`}
          onClick={onToggleAutoRefresh}
        >
          <FaSync className={autoRefresh ? "spin" : ""} />
          {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
        </button>
      </div>
    </div>
  );
};

export default LogHeader;
