import Select from "react-select";
import {
  FaSync,
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaCopy,
  FaDownload,
  FaExpand,
  FaCompress,
} from "react-icons/fa";

const OPCIONES_LINES = [
  { value: 50, label: "50 líneas" },
  { value: 100, label: "100 líneas" },
  { value: 200, label: "200 líneas" },
  { value: 500, label: "500 líneas" },
];

const OPCIONES_NIVEL = [
  { value: "todos", label: "Todos los niveles" },
  { value: "ERROR", label: "ERROR" },
  { value: "WARN", label: "WARN" },
  { value: "INFO", label: "INFO" },
  { value: "DEBUG", label: "DEBUG" },
];

const LogControls = ({
  opcionesArchivo,
  filtros,
  setFiltros,
  cargando,
  onRecargar,
  onLimpiarFiltros,
  onCopiar,
  onDescargar,
  expandido,
  onToggleExpandir,
}) => {
  return (
    <div className="log-controls">
      <div className="controls-row">
        <div className="file-selector">
          <label htmlFor="archivo-select">Archivo:</label>
          <Select
            inputId="archivo-select"
            value={
              opcionesArchivo.find((o) => o.value === filtros.archivo) || null
            }
            onChange={(opcion) =>
              setFiltros({ ...filtros, archivo: opcion ? opcion.value : "" })
            }
            isDisabled={cargando}
            classNamePrefix="spot-select"
            options={opcionesArchivo}
          />
        </div>

        <div className="lines-selector">
          <label htmlFor="lineas-select">Líneas:</label>
          <Select
            inputId="lineas-select"
            value={OPCIONES_LINES.find((o) => o.value === filtros.lines) || null}
            onChange={(opcion) =>
              setFiltros({ ...filtros, lines: opcion ? opcion.value : 100 })
            }
            isDisabled={cargando}
            classNamePrefix="spot-select"
            options={OPCIONES_LINES}
          />
        </div>

        <label className="errors-only-checkbox">
          <input
            type="checkbox"
            checked={filtros.errorsOnly}
            onChange={(e) =>
              setFiltros({ ...filtros, errorsOnly: e.target.checked })
            }
          />
          <FaExclamationTriangle /> Solo errores
        </label>

        <button
          type="button"
          className="control-btn"
          onClick={onRecargar}
          disabled={cargando}
        >
          <FaSync className={cargando ? "spin" : ""} /> Recargar
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={onLimpiarFiltros}
        >
          <FaFilter /> Limpiar filtros
        </button>
      </div>

      <div className="controls-row">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Buscar en logs..."
            aria-label="Buscar en logs"
            value={filtros.busqueda}
            onChange={(e) =>
              setFiltros({ ...filtros, busqueda: e.target.value })
            }
          />
        </div>

        <div className="level-filter">
          <Select
            inputId="nivel-select"
            aria-label="Filtrar por nivel"
            value={
              OPCIONES_NIVEL.find((o) => o.value === filtros.nivel) || null
            }
            onChange={(opcion) =>
              setFiltros({
                ...filtros,
                nivel: opcion ? opcion.value : "todos",
              })
            }
            classNamePrefix="spot-select"
            options={OPCIONES_NIVEL}
          />
        </div>

        <div className="logger-filter">
          <input
            type="text"
            placeholder="Filtrar por logger..."
            aria-label="Filtrar por logger"
            value={filtros.logger}
            onChange={(e) =>
              setFiltros({ ...filtros, logger: e.target.value })
            }
            className="logger-input"
          />
        </div>

        <button type="button" className="control-btn" onClick={onCopiar}>
          <FaCopy /> Copiar
        </button>

        <button type="button" className="control-btn" onClick={onDescargar}>
          <FaDownload /> Descargar
        </button>

        <button
          type="button"
          className="control-btn"
          onClick={onToggleExpandir}
          aria-label={expandido ? "Comprimir vista" : "Expandir vista"}
        >
          {expandido ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
    </div>
  );
};

export default LogControls;
