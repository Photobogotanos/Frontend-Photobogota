import React, { useState, useEffect, useCallback, useRef } from 'react';
import './AdminLogsViewer.css';
import {
    FaFileAlt, FaDownload, FaSync, FaSearch,
    FaFilter, FaTerminal, FaExclamationTriangle, FaInfoCircle,
    FaBug, FaCopy, FaExpand, FaCompress
} from 'react-icons/fa';
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import LogDetailModal from './LogDetailModal';

// --- GENERADOR DE LOGS QUE COINCIDE CON EL FORMATO DE LOGBACK ---
const generarLogAleatorio = () => {
    const niveles = ['INFO', 'WARN', 'ERROR', 'DEBUG'];
    const nivelesPadding = {
        'INFO': 'INFO ',
        'WARN': 'WARN ',
        'ERROR': 'ERROR',
        'DEBUG': 'DEBUG'
    };

    const threads = [
        'http-nio-8080-exec-1',
        'http-nio-8080-exec-2',
        'http-nio-8080-exec-3',
        'scheduling-1',
        'task-executor-1',
        'http-nio-8080-exec-5'
    ];

    const loggers = [
        'com.photobogota.api.controller.AdminController',
        'com.photobogota.api.service.ImageService',
        'com.photobogota.api.security.JwtAuthenticationFilter',
        'com.photobogota.api.repository.UserRepository',
        'com.photobogota.api.service.AuditService',
        'com.photobogota.api.exception.GlobalExceptionHandler',
        'org.springframework.security.web.FilterChainProxy',
        'org.springframework.web.servlet.DispatcherServlet',
        'org.mongodb.driver.connection',
        'com.photobogota.api.controller.PhotoController'
    ];

    const mensajes = {
        INFO: [
            "Iniciando aplicación PhotoBogotaApplication...",
            "Conexión establecida con MongoDB en puerto 27017",
            "JWT Token validado exitosamente para el usuario admin@photobogota.com",
            "Petición GET /api/usuarios recibida",
            "Cache de imágenes limpiado correctamente",
            "Usuario autenticado: admin@photobogota.com",
            "Endpoint /api/photos invocado con parámetros page=1, size=20",
            "Generando reporte de auditoría semanal...",
            "Servicio iniciado en puerto 8080",
            "Application context loaded successfully"
        ],
        WARN: [
            "Memoria del sistema: 78% en uso",
            "Tiempo de respuesta lento: 2.5s en /api/imagenes",
            "Pool de conexiones cerca del límite: 45/50",
            "Token JWT próximo a expirar: 5 minutos restantes",
            "Usuario no tiene permisos completos para esta operación",
            "Archivo de configuración application.yml tiene propiedades deprecadas",
            "Caché de imágenes alcanzó 80% de capacidad",
            "Request rate limit: 95/100 requests por minuto"
        ],
        ERROR: [
            "Error al intentar cargar imagen: photobogota_01.jpg - Timeout",
            "Spring Security: Acceso denegado para /api/admin/logs",
            "MongoDB: Conexión perdida - Reconectando...",
            "NullPointerException al procesar imagen sin metadatos",
            "FileNotFoundException: /uploads/photobogota_02.jpg",
            "SQLException: Cannot get JDBC Connection",
            "JWT verification failed: Token expired",
            "IOException: Failed to write image to disk"
        ],
        DEBUG: [
            "Hibernate: select u1_0.id,u1_0.email from usuarios u1_0",
            "Entering JwtAuthenticationFilter.doFilterInternal()",
            "UserDetails loaded: admin@photobogota.com with authorities [ROLE_ADMIN]",
            "Cache hit for key: 'image_12345'",
            "Query executed in 45ms: find({status: 'ACTIVE'})",
            "Authentication success for user: admin@photobogota.com",
            "Processing request with headers: {Authorization: Bearer...}",
            "Exiting GlobalExceptionHandler with response status 500"
        ]
    };

    const nivel = niveles[Math.floor(Math.random() * niveles.length)];
    const thread = threads[Math.floor(Math.random() * threads.length)];
    const logger = loggers[Math.floor(Math.random() * loggers.length)];
    const mensaje = mensajes[nivel][Math.floor(Math.random() * mensajes[nivel].length)];

    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 23);

    return `${timestamp} [${thread}] ${nivelesPadding[nivel]} ${logger} - ${mensaje}`;
};

// --- PARSEADOR DE LOGS PARA EL FORMATO LOGBACK ---
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
        timestamp: null,
        thread: null,
        level: null,
        logger: null,
        message: linea,
        fullLine: linea,
        isValid: false
    };
};

const AdminLogsViewer = () => {
    const [logs, setLogs] = useState([]);
    const [archivos, setArchivos] = useState([
        { nombre: 'photobogota.log', tamaño: 102450, fecha: '2024-01-15 10:30:00' },
        { nombre: 'photobogota-error.log', tamaño: 5420, fecha: '2024-01-15 10:30:00' },
        { nombre: 'spring.log', tamaño: 85400, fecha: '2024-01-15 09:00:00' },
        { nombre: 'access.log', tamaño: 125600, fecha: '2024-01-15 10:30:00' }
    ]);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
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
        WARN: { icon: <FaExclamationTriangle />, color: '#f59e0b', bg: '#fef3c7', label: 'Warning' },
        INFO: { icon: <FaInfoCircle />, color: '#3b82f6', bg: '#dbeafe', label: 'Info' },
        DEBUG: { icon: <FaBug />, color: '#8b5cf6', bg: '#ede9fe', label: 'Debug' }
    };

    const cargarLogs = useCallback(async () => {
        setCargando(true);
        setError(null);

        try {
            // TODO: Conexión con API real
            await new Promise(resolve => setTimeout(resolve, 800));
            const nuevosLogs = Array.from({ length: filtros.lines }, () => generarLogAleatorio());
            setLogs(nuevosLogs);
        } catch (err) {
            setError(err.message);
            console.error('Error cargando logs:', err);
        } finally {
            setCargando(false);
        }
    }, [filtros.archivo, filtros.lines]);

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

    const logsFiltrados = React.useMemo(() => {
        const filtrados = logs
            .map(log => ({
                raw: log,
                parsed: parseLogLine(log)
            }))
            .filter(({ raw, parsed }) => {
                const matchesBusqueda = !filtros.busqueda ||
                    raw.toLowerCase().includes(filtros.busqueda.toLowerCase());
                const matchesNivel = filtros.nivel === 'todos' ||
                    (parsed.level && parsed.level === filtros.nivel);
                const matchesSoloError = !filtros.errorsOnly ||
                    (parsed.level === 'ERROR');
                const matchesLogger = !filtros.logger ||
                    (parsed.logger && parsed.logger.toLowerCase().includes(filtros.logger.toLowerCase()));

                return matchesBusqueda && matchesNivel && matchesSoloError && matchesLogger;
            })
            .map(item => item.raw);

        calcularEstadisticas(filtrados);
        return filtrados;
    }, [logs, filtros, calcularEstadisticas]);

    useEffect(() => {
        if (autoRefresh) {
            intervaloRef.current = setInterval(() => {
                setLogs(prev => {
                    const nuevoLog = generarLogAleatorio();
                    return [nuevoLog, ...prev.slice(0, filtros.lines - 1)];
                });
            }, 3000);
        } else {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        }
        return () => {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        };
    }, [autoRefresh, filtros.lines]);

    useEffect(() => {
        cargarLogs();
    }, [cargarLogs, filtros.archivo]);

    const limpiarFiltros = () => {
        setFiltros({
            ...filtros,
            busqueda: '',
            nivel: 'todos',
            errorsOnly: false,
            logger: ''
        });
    };

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

    const formatearLineaLog = (linea, index) => {
        const parsed = parseLogLine(linea);
        const nivel = parsed.level;

        let nivelVisual = null;
        if (nivel && nivelesLog[nivel]) {
            nivelVisual = nivel;
        } else {
            for (const key of Object.keys(nivelesLog)) {
                if (linea.includes(key)) {
                    nivelVisual = key;
                    break;
                }
            }
        }

        return (
            <div
                key={index}
                className={`log-line ${nivelVisual ? `log-${nivelVisual.toLowerCase()}` : ''}`}
                onClick={() => setLogSeleccionado({ raw: linea, parsed })}
            >
                <div className="log-line-number">{index + 1}</div>
                {nivelVisual && (
                    <div className="log-level-icon" style={{ color: nivelesLog[nivelVisual].color }}>
                        {nivelesLog[nivelVisual].icon}
                    </div>
                )}
                <div className="log-content">
                    {parsed.timestamp && (
                        <span className="log-timestamp">{parsed.timestamp}</span>
                    )}
                    {parsed.thread && (
                        <span className="log-thread">[{parsed.thread}]</span>
                    )}
                    {parsed.logger && (
                        <span className="log-logger">{parsed.logger}</span>
                    )}
                    <span className="log-message">- {parsed.message}</span>
                </div>
            </div>
        );
    };

    return (
        <div className={`log-viewer-container ${expandido ? 'expandido' : ''}`}>
            <div className="log-viewer-header">
                <div className="header-info">
                    <h1 className="header-titulo">
                        <FaTerminal /> Visualizador de Logs
                    </h1>
                    <div className="log-stats-badges">
                        <span className="stat-badge">
                            <FaFileAlt /> Total: {logsFiltrados.length} lineas
                        </span>
                        {Object.entries(estadisticas).map(([nivel, count]) => (
                            count > 0 && (
                                <span
                                    key={nivel}
                                    className={`stat-badge stat-${nivel.toLowerCase()}`}
                                    style={{ backgroundColor: nivelesLog[nivel].bg, color: nivelesLog[nivel].color }}
                                >
                                    {nivelesLog[nivel].icon} {nivel}: {count}
                                </span>
                            )
                        ))}
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
                        <label>Lineas:</label>
                        <select
                            value={filtros.lines}
                            onChange={(e) => setFiltros({ ...filtros, lines: parseInt(e.target.value) })}
                            disabled={cargando}
                        >
                            <option value={50}>50 lineas</option>
                            <option value={100}>100 lineas</option>
                            <option value={200}>200 lineas</option>
                            <option value={500}>500 lineas</option>
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
                    <div className="logs-loading">
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
                />
            )}
        </div>
    );
};

export default AdminLogsViewer;