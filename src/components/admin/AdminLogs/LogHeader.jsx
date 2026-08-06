import { FaTerminal, FaFileAlt, FaSync } from "react-icons/fa";
import PageHeader from "@/components/common/PageHeader/PageHeader";

const LogHeader = ({
  modoDemo,
  logsFiltrados,
  estadisticas,
  autoRefresh,
  onToggleAutoRefresh,
  NIVELES_LOG,
}) => {
  return (
    <div className="log-header-wrap">
      <PageHeader
        subtitle="Administración"
        icon={<FaTerminal />}
        title="Visualizador de logs"
        description={
          modoDemo
            ? "Consulta en vivo los logs del sistema. Modo demo: se muestran datos simulados."
            : "Consulta en vivo los logs del sistema: errores, advertencias, información y depuración."
        }
      />

      <div className="log-stats-bar">
        <div className="log-stats-badges">
          <span className="stat-badge stat-total">
            <FaFileAlt /> Total: {logsFiltrados.length} líneas
          </span>
          {Object.entries(estadisticas).map(
            ([nivel, count]) =>
              count > 0 && (
                <span
                  key={nivel}
                  className={`stat-badge stat-${nivel.toLowerCase()}`}
                >
                  {NIVELES_LOG[nivel].icon} {nivel}: {count}
                </span>
              ),
          )}
        </div>

        <div className="log-stats-actions">
          {modoDemo && <span className="log-demo-badge">DEMO</span>}
          <button
            type="button"
            className={`auto-refresh-btn ${autoRefresh ? "active" : ""}`}
            onClick={onToggleAutoRefresh}
          >
            <FaSync className={autoRefresh ? "spin" : ""} />
            {autoRefresh ? "Auto-refresh activo" : "Auto-refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogHeader;
