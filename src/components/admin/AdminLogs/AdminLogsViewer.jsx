import React, { useState, useEffect, useCallback, useRef } from "react";
import "./AdminLogsViewer.css";
import { FaExclamationTriangle, FaInfoCircle, FaBug } from "react-icons/fa";
import LogsView from "./LogsView";
import LogHeader from "./LogHeader";
import LogControls from "./LogControls";
import LogDetailModal from "./LogDetailModal";
import {
  obtenerLogs,
  obtenerArchivosLog,
  generarLogDemo,
} from "@/services/log.service";

// ─── CONSTANTES ───────────────────────────────────────────────────────────────
const NIVELES_LOG = {
  ERROR: {
    icon: <FaExclamationTriangle />,
    color: "#ef4444",
    bg: "#fee2e2",
    label: "Error",
  },
  WARN: {
    icon: <FaExclamationTriangle />,
    color: "#f59e0b",
    bg: "#fef3c7",
    label: "Warning",
  },
  INFO: {
    icon: <FaInfoCircle />,
    color: "#3b82f6",
    bg: "#dbeafe",
    label: "Info",
  },
  DEBUG: { icon: <FaBug />, color: "#8b5cf6", bg: "#ede9fe", label: "Debug" },
};

// ─── PARSEADOR ────────────────────────────────────────────────────────────────
const parseLogLine = (linea) => {
  const patronLogback =
    /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})\s\[([^\]]+)\]\s+(INFO|WARN|ERROR|DEBUG)\s+([^\s]+)\s+-\s+(.+)/;
  const match = linea.match(patronLogback);

  if (match) {
    return {
      timestamp: match[1],
      thread: match[2],
      level: match[3],
      logger: match[4],
      message: match[5],
      fullLine: linea,
      isValid: true,
    };
  }

  return {
    timestamp: null,
    thread: null,
    level: null,
    logger: null,
    message: linea,
    fullLine: linea,
    isValid: false,
  };
};

// ─── COMPONENTE ───────────────────────────────────────────────────────────────
const AdminLogsViewer = () => {
  const [logs, setLogs] = useState([]);
  const [archivos, setArchivos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [modoDemo, setModoDemo] = useState(false);
  const [filtros, setFiltros] = useState({
    lines: 100,
    errorsOnly: false,
    archivo: "photobogota.log",
    busqueda: "",
    nivel: "todos",
    logger: "",
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const [logSeleccionado, setLogSeleccionado] = useState(null);

  const containerRef = useRef(null);
  const intervaloRef = useRef(null);

  const opcionesArchivo = archivos.map((arc) => ({
    value: arc.nombre,
    label: `${arc.nombre} (${(arc.tamaño / 1024).toFixed(1)} KB)`,
  }));

  // ── Cargar archivos disponibles al montar ──────────────────────────────────
  useEffect(() => {
    const cargarArchivos = async () => {
      const resultado = await obtenerArchivosLog();
      if (resultado.exitoso && resultado.data.length > 0) {
        setArchivos(resultado.data);
        // Preseleccionar el primer archivo si el actual no está en la lista
        const nombres = resultado.data.map((a) => a.nombre);
        if (!nombres.includes(filtros.archivo)) {
          setFiltros((prev) => ({
            ...prev,
            archivo: resultado.data[0].nombre,
          }));
        }
      }
    };
    cargarArchivos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Cargar logs ────────────────────────────────────────────────────────────
  const cargarLogs = useCallback(async () => {
    setCargando(true);
    setError(null);

    // El backend filtra por archivo con el param errorsOnly;
    // si el archivo seleccionado es el de errores, lo forzamos.
    const esArchivoError = filtros.archivo.includes("error");
    const resultado = await obtenerLogs(
      filtros.lines,
      filtros.errorsOnly || esArchivoError,
    );

    if (resultado.exitoso) {
      setLogs(resultado.data);
      setModoDemo(resultado.esDemo);
    } else {
      setError("No se pudieron cargar los logs.");
    }

    setCargando(false);
  }, [filtros.archivo, filtros.lines, filtros.errorsOnly]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargarLogs();
  }, [cargarLogs]);

  // ── Auto-refresh ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (autoRefresh) {
      intervaloRef.current = setInterval(() => {
        if (modoDemo) {
          // En modo demo añadimos logs ficticios
          setLogs((prev) => [
            generarLogDemo(),
            ...prev.slice(0, filtros.lines - 1),
          ]);
        } else {
          // En modo real recargamos del servidor
          cargarLogs();
        }
      }, 3000);
    } else {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [autoRefresh, filtros.lines, modoDemo, cargarLogs]);

  // ── Filtrado local ─────────────────────────────────────────────────────────
  const logsFiltrados = React.useMemo(() => {
    const filtrados = [];
    for (const raw of logs) {
      const parsed = parseLogLine(raw);
      const matchesBusqueda =
        !filtros.busqueda ||
        raw.toLowerCase().includes(filtros.busqueda.toLowerCase());
      const matchesNivel =
        filtros.nivel === "todos" ||
        (parsed.level && parsed.level === filtros.nivel);
      const matchesSoloError = !filtros.errorsOnly || parsed.level === "ERROR";
      const matchesLogger =
        !filtros.logger ||
        (parsed.logger &&
          parsed.logger.toLowerCase().includes(filtros.logger.toLowerCase()));

      if (
        matchesBusqueda &&
        matchesNivel &&
        matchesSoloError &&
        matchesLogger
      ) {
        filtrados.push(raw);
      }
    }
    return filtrados;
  }, [logs, filtros]);

  // ── Estadísticas (derivadas de logsFiltrados, no necesitan estado propio) ──
  const estadisticas = React.useMemo(() => {
    const stats = { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 };
    logsFiltrados.forEach((log) => {
      const parsed = parseLogLine(log);
      if (parsed.level && stats[parsed.level] !== undefined) {
        stats[parsed.level]++;
      }
    });
    return stats;
  }, [logsFiltrados]);

  // ── Utilidades ─────────────────────────────────────────────────────────────
  const limpiarFiltros = () =>
    setFiltros((prev) => ({
      ...prev,
      busqueda: "",
      nivel: "todos",
      errorsOnly: false,
      logger: "",
    }));

  const copiarLogs = async () => {
    try {
      await navigator.clipboard.writeText(logsFiltrados.join("\n"));
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  const descargarLogs = () => {
    const contenido = logsFiltrados.join("\n");
    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filtros.archivo}_${new Date().toISOString().split("T")[0]}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className={`log-viewer-container ${expandido ? "expandido" : ""}`}>
      <LogHeader
        modoDemo={modoDemo}
        logsFiltrados={logsFiltrados}
        estadisticas={estadisticas}
        autoRefresh={autoRefresh}
        onToggleAutoRefresh={() => setAutoRefresh(!autoRefresh)}
        NIVELES_LOG={NIVELES_LOG}
      />

      <LogControls
        opcionesArchivo={opcionesArchivo}
        filtros={filtros}
        setFiltros={setFiltros}
        cargando={cargando}
        onRecargar={cargarLogs}
        onLimpiarFiltros={limpiarFiltros}
        onCopiar={copiarLogs}
        onDescargar={descargarLogs}
        expandido={expandido}
        onToggleExpandir={() => setExpandido(!expandido)}
      />

      <LogsView
        cargando={cargando}
        error={error}
        logsFiltrados={logsFiltrados}
        onReintentar={cargarLogs}
        onLimpiarFiltros={limpiarFiltros}
        parseLogLine={parseLogLine}
        NIVELES_LOG={NIVELES_LOG}
        onSelectLog={setLogSeleccionado}
        containerRef={containerRef}
      />

      {logSeleccionado && (
        <LogDetailModal
          log={logSeleccionado}
          onClose={() => setLogSeleccionado(null)}
          nivelesLog={NIVELES_LOG}
          logs={logsFiltrados.map((raw, i) => ({
            raw,
            parsed: parseLogLine(raw),
            id: i,
          }))}
          onNavigate={(nuevoLog) => setLogSeleccionado(nuevoLog)}
        />
      )}
    </div>
  );
};

export default AdminLogsViewer;
