import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminLogsViewer.css';
import {
    FaFileAlt, FaDownload, FaSync, FaSearch,
    FaFilter, FaTerminal, FaExclamationTriangle, FaInfoCircle,
    FaBug, FaCopy, FaExpand, FaCompress
} from 'react-icons/fa';
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import LogDetailModal from './LogDetailModal';
import { obtenerLogs, obtenerArchivosLog, generarLogDemo } from '@/services/log.service';

// ─── PARSEADOR ────────────────────────────────────────────────────────────────
const parseLogLine = (linea) => {
    const patronLogback = /(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}\.\d{3})\s\[([^\]]+)\]\s+(INFO|WARN|ERROR|DEBUG)\s+([^\s]+)\s+-\s+(.+)/;
    const match = linea.match(patronLogback);

    if (match) {
        return {
            timestamp: match[1],
            thread: match[2],
            level: match[3],
            logger: match[4],
            message: match[5],
            fullLine: linea,
            isValid: true
        };
    }

    return {
        timestamp: null, thread: null, level: null, logger: null,
        message: linea, fullLine: linea, isValid: false
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
        archivo: 'photobogota.log',
        busqueda: '',
        nivel: 'todos',
        logger: ''
    });
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [expandido, setExpandido] = useState(false);
    const [logSeleccionado, setLogSeleccionado] = useState(null);
    const [estadisticas, setEstadisticas] = useState({ ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 });

    const containerRef = useRef(null);
    const intervaloRef = useRef(null);

    const nivelesLog = {
        ERROR: { icon: <FaExclamationTriangle />, color: '#ef4444', bg: '#fee2e2', label: 'Error' },
        WARN:  { icon: <FaExclamationTriangle />, color: '#f59e0b', bg: '#fef3c7', label: 'Warning' },
        INFO:  { icon: <FaInfoCircle />,          color: '#3b82f6', bg: '#dbeafe', label: 'Info' },
        DEBUG: { icon: <FaBug />,                 color: '#8b5cf6', bg: '#ede9fe', label: 'Debug' }
    };

    // ── Cargar archivos disponibles al montar ──────────────────────────────────
    useEffect(() => {
        const cargarArchivos = async () => {
            const resultado = await obtenerArchivosLog();
            if (resultado.exitoso && resultado.data.length > 0) {
                setArchivos(resultado.data);
                // Preseleccionar el primer archivo si el actual no está en la lista
                const nombres = resultado.data.map(a => a.nombre);
                if (!nombres.includes(filtros.archivo)) {
                    setFiltros(prev => ({ ...prev, archivo: resultado.data[0].nombre }));
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
        const esArchivoError = filtros.archivo.includes('error');
        const resultado = await obtenerLogs(
            filtros.lines,
            filtros.errorsOnly || esArchivoError
        );

        if (resultado.exitoso) {
            setLogs(resultado.data);
            setModoDemo(resultado.esDemo);
        } else {
            setError('No se pudieron cargar los logs.');
        }

        setCargando(false);
    }, [filtros.archivo, filtros.lines, filtros.errorsOnly]);

    useEffect(() => {
        cargarLogs();
    }, [cargarLogs]);

    // ── Auto-refresh ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (autoRefresh) {
            intervaloRef.current = setInterval(() => {
                if (modoDemo) {
                    // En modo demo añadimos logs ficticios
                    setLogs(prev => [generarLogDemo(), ...prev.slice(0, filtros.lines - 1)]);
                } else {
                    // En modo real recargamos del servidor
                    cargarLogs();
                }
            }, 3000);
        } else {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        }
        return () => { if (intervaloRef.current) clearInterval(intervaloRef.current); };
    }, [autoRefresh, filtros.lines, modoDemo, cargarLogs]);

    // ── Estadísticas ───────────────────────────────────────────────────────────
    const calcularEstadisticas = useCallback((logsData) => {
        const stats = { ERROR: 0, WARN: 0, INFO: 0, DEBUG: 0 };
        logsData.forEach(log => {
            const parsed = parseLogLine(log);
            if (parsed.level && stats[parsed.level] !== undefined) {
                stats[parsed.level]++;
            }
        });
        setEstadisticas(stats);
    }, []);

    // ── Filtrado local ─────────────────────────────────────────────────────────
    const logsFiltrados = React.useMemo(() => {
        const filtrados = logs
            .map(log => ({ raw: log, parsed: parseLogLine(log) }))
            .filter(({ raw, parsed }) => {
                const matchesBusqueda = !filtros.busqueda ||
                    raw.toLowerCase().includes(filtros.busqueda.toLowerCase());
                const matchesNivel = filtros.nivel === 'todos' ||
                    (parsed.level && parsed.level === filtros.nivel);
                const matchesSoloError = !filtros.errorsOnly || parsed.level === 'ERROR';
                const matchesLogger = !filtros.logger ||
                    (parsed.logger && parsed.logger.toLowerCase().includes(filtros.logger.toLowerCase()));

                return matchesBusqueda && matchesNivel && matchesSoloError && matchesLogger;
            })
            .map(item => item.raw);

        calcularEstadisticas(filtrados);
        return filtrados;
    }, [logs, filtros, calcularEstadisticas]);

    // ── Utilidades ─────────────────────────────────────────────────────────────
    const limpiarFiltros = () => setFiltros(prev => ({
        ...prev, busqueda: '', nivel: 'todos', errorsOnly: false, logger: ''
    }));

    const copiarLogs = async () => {
        try {
            await navigator.clipboard.writeText(logsFiltrados.join('\n'));
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    };

    const descargarLogs = () => {
        const contenido = logsFiltrados.join('\n');
        const blob = new Blob([contenido], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filtros.archivo}_${new Date().toISOString().split('T')[0]}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // ── Render de línea ────────────────────────────────────────────────────────
    const formatearLineaLog = (linea, index) => {
        const parsed = parseLogLine(linea);
        const nivel = parsed.level;

        let nivelVisual = null;
        if (nivel && nivelesLog[nivel]) {
            nivelVisual = nivel;
        } else {
            for (const key of Object.keys(nivelesLog)) {
                if (linea.includes(key)) { nivelVisual = key; break; }
            }
        }

        return (
            <div
                key={index}
                className={`log-line ${nivelVisual ? `log-${nivelVisual.toLowerCase()}` : ''}`}
                onClick={() => setLogSeleccionado({ raw: linea, parsed, id: index })}
            >
                <div className="log-line-number">{index + 1}</div>
                {nivelVisual && (
                    <div className="log-level-icon" style={{ color: nivelesLog[nivelVisual].color }}>
                        {nivelesLog[nivelVisual].icon}
                    </div>
                )}
                <div className="log-content">
                    {parsed.timestamp && <span className="log-timestamp">{parsed.timestamp}</span>}
                    {parsed.thread  && <span className="log-thread">[{parsed.thread}]</span>}
                    {parsed.logger  && <span className="log-logger">{parsed.logger}</span>}
                    <span className="log-message">- {parsed.message}</span>
                </div>
            </div>
        );
    };

    // ── JSX ────────────────────────────────────────────────────────────────────
    return (
        <div className={`log-viewer-container ${expandido ? 'expandido' : ''}`}>
            <div className="log-viewer-header">
                <div className="header-info">
                    <h1 className="header-titulo">
                        <FaTerminal /> Visualizador de Logs
                        {modoDemo && (
                            <span style={{
                                fontSize: '0.75rem', fontWeight: 500,
                                background: '#fef3c7', color: '#92400e',
                                padding: '2px 10px', borderRadius: 20, marginLeft: 8
                            }}>
                                DEMO
                            </span>
                        )}
                    </h1>
                    <div className="log-stats-badges">
                        <span className="stat-badge">
                            <FaFileAlt /> Total: {logsFiltrados.length} líneas
                        </span>
                        {Object.entries(estadisticas).map(([nivel, count]) =>
                            count > 0 && (
                                <span
                                    key={nivel}
                                    className={`stat-badge stat-${nivel.toLowerCase()}`}
                                    style={{ backgroundColor: nivelesLog[nivel].bg, color: nivelesLog[nivel].color }}
                                >
                                    {nivelesLog[nivel].icon} {nivel}: {count}
                                </span>
                            )
                        )}
                    </div>
                </div>
                <div className="log-stats">
                    <button
                        className={`auto-refresh-btn ${autoRefresh ? 'active' : ''}`}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        <FaSync className={autoRefresh ? 'spin' : ''} />
                        {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                    </button>
                </div>
            </div>

            <div className="log-controls">
                <div className="controls-row">
                    <div className="file-selector">
                        <label>Archivo:</label>
                        <select
                            value={filtros.archivo}
                            onChange={(e) => setFiltros({ ...filtros, archivo: e.target.value })}
                            disabled={cargando}
                        >
                            {archivos.map(arc => (
                                <option key={arc.nombre} value={arc.nombre}>
                                    {arc.nombre} ({(arc.tamaño / 1024).toFixed(1)} KB)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="lines-selector">
                        <label>Líneas:</label>
                        <select
                            value={filtros.lines}
                            onChange={(e) => setFiltros({ ...filtros, lines: parseInt(e.target.value) })}
                            disabled={cargando}
                        >
                            <option value={50}>50 líneas</option>
                            <option value={100}>100 líneas</option>
                            <option value={200}>200 líneas</option>
                            <option value={500}>500 líneas</option>
                        </select>
                    </div>

                    <label className="errors-only-checkbox">
                        <input
                            type="checkbox"
                            checked={filtros.errorsOnly}
                            onChange={(e) => setFiltros({ ...filtros, errorsOnly: e.target.checked })}
                        />
                        <FaExclamationTriangle /> Solo errores
                    </label>

                    <button className="control-btn" onClick={cargarLogs} disabled={cargando}>
                        <FaSync className={cargando ? 'spin' : ''} /> Recargar
                    </button>

                    <button className="control-btn" onClick={limpiarFiltros}>
                        <FaFilter /> Limpiar filtros
                    </button>
                </div>

                <div className="controls-row">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar en logs..."
                            value={filtros.busqueda}
                            onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                        />
                    </div>

                    <div className="level-filter">
                        <select
                            value={filtros.nivel}
                            onChange={(e) => setFiltros({ ...filtros, nivel: e.target.value })}
                        >
                            <option value="todos">Todos los niveles</option>
                            <option value="ERROR">ERROR</option>
                            <option value="WARN">WARN</option>
                            <option value="INFO">INFO</option>
                            <option value="DEBUG">DEBUG</option>
                        </select>
                    </div>

                    <div className="logger-filter">
                        <input
                            type="text"
                            placeholder="Filtrar por logger..."
                            value={filtros.logger}
                            onChange={(e) => setFiltros({ ...filtros, logger: e.target.value })}
                            className="logger-input"
                        />
                    </div>

                    <button className="control-btn" onClick={copiarLogs}>
                        <FaCopy /> Copiar
                    </button>

                    <button className="control-btn" onClick={descargarLogs}>
                        <FaDownload /> Descargar
                    </button>

                    <button className="control-btn" onClick={() => setExpandido(!expandido)}>
                        {expandido ? <FaCompress /> : <FaExpand />}
                    </button>
                </div>
            </div>

            <div className="logs-container" ref={containerRef}>
                {cargando ? (
                    <div className="loading-overlay">
                        <SpinnerLoader texto="Cargando logs..." />
                    </div>
                ) : error ? (
                    <div className="logs-error">
                        <FaExclamationTriangle />
                        <p>{error}</p>
                        <button onClick={cargarLogs}>Reintentar</button>
                    </div>
                ) : logsFiltrados.length === 0 ? (
                    <div className="logs-empty">
                        <FaInfoCircle />
                        <p>No hay logs que coincidan con los filtros aplicados</p>
                        <button onClick={limpiarFiltros}>Limpiar filtros</button>
                    </div>
                ) : (
                    <div className="logs-list">
                        {logsFiltrados.map((log, index) => formatearLineaLog(log, index))}
                    </div>
                )}
            </div>

            {logSeleccionado && (
                <LogDetailModal
                    log={logSeleccionado}
                    onClose={() => setLogSeleccionado(null)}
                    nivelesLog={nivelesLog}
                    logs={logsFiltrados.map((raw, i) => ({ raw, parsed: parseLogLine(raw), id: i }))}
                    onNavigate={(nuevoLog) => setLogSeleccionado(nuevoLog)}
                />
            )}
        </div>
    );
};

export default AdminLogsViewer;