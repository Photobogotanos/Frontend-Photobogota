import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import LogRow from "./LogRow";

const LogsView = ({
  cargando,
  error,
  logsFiltrados,
  onReintentar,
  onLimpiarFiltros,
  parseLogLine,
  NIVELES_LOG,
  onSelectLog,
  containerRef,
}) => {
  return (
    <div className="logs-container" ref={containerRef}>
      {cargando ? (
        <div className="loading-overlay">
          <SpinnerLoader texto="Cargando logs..." />
        </div>
      ) : error ? (
        <div className="logs-error">
          <FaExclamationTriangle />
          <p>{error}</p>
          <button type="button" onClick={onReintentar}>Reintentar</button>
        </div>
      ) : logsFiltrados.length === 0 ? (
        <div className="logs-empty">
          <FaInfoCircle />
          <p>No hay logs que coincidan con los filtros aplicados</p>
          <button type="button" onClick={onLimpiarFiltros}>Limpiar filtros</button>
        </div>
      ) : (
        <div className="logs-list">
          {logsFiltrados.map((log, index) => (
            <LogRow
              key={log}
              linea={log}
              parsed={parseLogLine(log)}
              NIVELES_LOG={NIVELES_LOG}
              index={index}
              onSelect={onSelectLog}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LogsView;
