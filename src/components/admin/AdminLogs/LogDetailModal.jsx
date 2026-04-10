import { FaCopy, FaTimes, FaFileAlt, FaExpand, FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState } from 'react';
import './LogDetailModal.css';
import toast from 'react-hot-toast';

const LogDetailModal = ({ log, onClose, nivelesLog, logs = [], onNavigate }) => {
    const [isRawExpanded, setIsRawExpanded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    
    if (!log) return null;

    const currentIndex = logs.findIndex(l => l.id === log.id);
    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < logs.length - 1;

    const handleCopy = async (text, type = 'line') => {
        try {
            await navigator.clipboard.writeText(text);
            setIsCopied(true);
            toast.success(`${type === 'line' ? 'Línea' : 'Mensaje'} copiado al portapapeles`, {
                duration: 2000,
                icon: '📋'
            });
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            toast.error('Error al copiar al portapapeles');
        }
    };

    const handleCopyMessage = () => {
        handleCopy(log.parsed.message, 'message');
    };

    const handleCopyAll = () => {
        const allInfo = `
=== LOG DETAIL ===
Timestamp: ${log.parsed.timestamp || 'N/A'}
Level: ${log.parsed.level || 'N/A'}
Thread: ${log.parsed.thread || 'N/A'}
Logger: ${log.parsed.logger || 'N/A'}
Message: ${log.parsed.message || 'N/A'}
Raw: ${log.raw}
        `.trim();
        handleCopy(allInfo, 'all');
    };

    const handleDownload = () => {
        const content = `[${log.parsed.timestamp}] ${log.parsed.level} - ${log.parsed.logger}\n${log.parsed.message}\n\nRaw Log:\n${log.raw}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `log_${log.parsed.timestamp?.replace(/[/:]/g, '-') || 'export'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Archivo descargado');
    };

    const handleNavigate = (direction) => {
        if (direction === 'prev' && hasPrevious && onNavigate) {
            onNavigate(logs[currentIndex - 1]);
        } else if (direction === 'next' && hasNext && onNavigate) {
            onNavigate(logs[currentIndex + 1]);
        }
    };

    // Función para formatear el timestamp
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'N/A';
        try {
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) return timestamp;
            return date.toLocaleString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch {
            return timestamp;
        }
    };

    return (
        <div className="log-modal-overlay" onClick={onClose}>
            <div className={`log-modal-container ${isRawExpanded ? 'expanded' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="log-modal-header">
                    <div className="header-left">
                        <h3>
                            <FaFileAlt className="header-icon" />
                            Detalle del Log
                        </h3>
                        {logs.length > 1 && (
                            <span className="log-counter">
                                {currentIndex + 1} / {logs.length}
                            </span>
                        )}
                    </div>
                    <div className="header-actions">
                        <button 
                            className="modal-action-btn" 
                            onClick={() => setIsRawExpanded(!isRawExpanded)}
                            title={isRawExpanded ? "Contraer vista" : "Expandir vista"}
                        >
                            <FaExpand />
                        </button>
                        <button className="modal-close-btn" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>
                </div>

                <div className="log-modal-body">
                    <div className="detail-section">
                        <div className="detail-grid">
                            {log.parsed.timestamp && (
                                <div className="detail-item">
                                    <label>📅 Timestamp</label>
                                    <span className="detail-value timestamp-value">
                                        {formatTimestamp(log.parsed.timestamp)}
                                    </span>
                                </div>
                            )}

                            {log.parsed.level && (
                                <div className="detail-item">
                                    <label>⚡ Level</label>
                                    <span
                                        className="detail-value level-value"
                                        style={{
                                            backgroundColor: nivelesLog[log.parsed.level]?.bg || '#f3f4f6',
                                            color: nivelesLog[log.parsed.level]?.color || '#374151'
                                        }}
                                    >
                                        {log.parsed.level}
                                    </span>
                                </div>
                            )}

                            {log.parsed.thread && (
                                <div className="detail-item">
                                    <label>🧵 Thread</label>
                                    <span className="detail-value thread-value">
                                        {log.parsed.thread}
                                    </span>
                                </div>
                            )}

                            {log.parsed.logger && (
                                <div className="detail-item full-width">
                                    <label>📝 Logger</label>
                                    <span className="detail-value logger-value">
                                        {log.parsed.logger}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="detail-section-content">
                            <div className="section-header">
                                <label>💬 Mensaje</label>
                                <button 
                                    className="section-copy-btn" 
                                    onClick={handleCopyMessage}
                                    title="Copiar mensaje"
                                >
                                    <FaCopy size={12} /> Copiar
                                </button>
                            </div>
                            <pre className="message-content">{log.parsed.message}</pre>
                        </div>

                        <div className="detail-section-content">
                            <div className="section-header">
                                <label>📄 Línea completa (raw)</label>
                                <button 
                                    className="section-copy-btn" 
                                    onClick={() => handleCopy(log.raw, 'raw')}
                                    title="Copiar línea completa"
                                >
                                    <FaCopy size={12} /> Copiar
                                </button>
                            </div>
                            <pre className={`raw-log-content ${isRawExpanded ? 'expanded' : ''}`}>
                                {log.raw}
                            </pre>
                        </div>

                        {/* Metadata adicional si existe */}
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="detail-section-content">
                                <label>🔧 Metadata</label>
                                <pre className="metadata-content">
                                    {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>

                <div className="log-modal-footer">
                    <div className="footer-left">
                        {logs.length > 1 && (
                            <div className="navigation-buttons">
                                <button 
                                    className="btn-nav" 
                                    onClick={() => handleNavigate('prev')}
                                    disabled={!hasPrevious}
                                    title="Anterior"
                                >
                                    <FaChevronLeft /> Anterior
                                </button>
                                <button 
                                    className="btn-nav" 
                                    onClick={() => handleNavigate('next')}
                                    disabled={!hasNext}
                                    title="Siguiente"
                                >
                                    Siguiente <FaChevronRight />
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="footer-right">
                        <button className="btn-download" onClick={handleDownload}>
                            <FaDownload /> Descargar
                        </button>
                        <button className="btn-copy" onClick={handleCopyAll}>
                            <FaCopy /> Copiar todo
                        </button>
                        <button className="btn-copy" onClick={() => handleCopy(log.raw)}>
                            <FaCopy /> Copiar línea
                        </button>
                        <button className="btn-close" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LogDetailModal;