import {
  FaCopy,
  FaTimes,
  FaFileAlt,
  FaExpand,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaCalendarAlt,
  FaBolt,
  FaCodeBranch,
  FaTag,
  FaCommentDots,
  FaTerminal,
  FaCogs,
} from "react-icons/fa";
import { useState } from "react";
import "./LogDetailModal.css";
import toast from "react-hot-toast";

const handleCopy = async (text, type = "line") => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(
      `${type === "line" ? "Línea" : "Mensaje"} copiado al portapapeles`,
      {
        duration: 2000,
        icon: "📋",
      },
    );
  } catch (err) {
    toast.error("Error al copiar al portapapeles " + err);
  }
};

const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return timestamp;
  }
};

const LogDetailModal = ({
  log,
  onClose,
  nivelesLog,
  logs = [],
  onNavigate,
}) => {
  const [isRawExpanded, setIsRawExpanded] = useState(false);

  if (!log) return null;

  const currentIndex = logs.findIndex((l) => l.id === log.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < logs.length - 1;

  const handleCopyMessage = () => {
    handleCopy(log.parsed.message, "message");
  };

  const handleCopyAll = () => {
    const allInfo = `
=== LOG DETAIL ===
Timestamp: ${log.parsed.timestamp || "N/A"}
Level: ${log.parsed.level || "N/A"}
Thread: ${log.parsed.thread || "N/A"}
Logger: ${log.parsed.logger || "N/A"}
Message: ${log.parsed.message || "N/A"}
Raw: ${log.raw}
        `.trim();
    handleCopy(allInfo, "all");
  };

  const handleDownload = () => {
    const content = `[${log.parsed.timestamp}] ${log.parsed.level} - ${log.parsed.logger}\n${log.parsed.message}\n\nRaw Log:\n${log.raw}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `log_${log.parsed.timestamp?.replace(/[/:]/g, "-") || "export"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Archivo descargado");
  };

  const handleNavigate = (direction) => {
    if (direction === "prev" && hasPrevious && onNavigate) {
      onNavigate(logs[currentIndex - 1]);
    } else if (direction === "next" && hasNext && onNavigate) {
      onNavigate(logs[currentIndex + 1]);
    }
  };

  const handleOverlayKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="log-modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleOverlayKeyDown}
      role="presentation"
    >
      <div
        className={`log-modal-container ${isRawExpanded ? "expanded" : ""}`}
      >
        <div className="log-modal-header">
          <div className="header-left">
            <span className="mh-icon-box">
              <FaFileAlt />
            </span>
            <div>
              <h3 className="log-modal-title">Detalle del Log</h3>
              {logs.length > 1 && (
                <span className="log-counter">
                  {currentIndex + 1} / {logs.length}
                </span>
              )}
            </div>
          </div>
          <div className="header-actions">
            <button
              type="button"
              className="modal-action-btn"
              onClick={() => setIsRawExpanded(!isRawExpanded)}
              title={isRawExpanded ? "Contraer vista" : "Expandir vista"}
              aria-label={isRawExpanded ? "Contraer vista" : "Expandir vista"}
            >
              <FaExpand />
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Cerrar"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="log-modal-body">
          <div className="log-detail-block">
            <span className="log-block-heading">
              <FaCalendarAlt className="bh-icon" /> Información
            </span>
            <div className="detail-grid">
              {log.parsed.timestamp && (
                <div className="detail-item">
                  <span className="detail-label">
                    <FaCalendarAlt className="dl-icon" /> Timestamp
                  </span>
                  <span className="detail-value timestamp-value">
                    {formatTimestamp(log.parsed.timestamp)}
                  </span>
                </div>
              )}

              {log.parsed.level && (
                <div className="detail-item">
                  <span className="detail-label">
                    <FaBolt className="dl-icon" /> Level
                  </span>
                  <span
                    className="detail-value level-value"
                    style={{
                      backgroundColor:
                        nivelesLog[log.parsed.level]?.bg || "#f3f4f6",
                      color: nivelesLog[log.parsed.level]?.color || "#374151",
                    }}
                  >
                    {log.parsed.level}
                  </span>
                </div>
              )}

              {log.parsed.thread && (
                <div className="detail-item">
                  <span className="detail-label">
                    <FaCodeBranch className="dl-icon" /> Thread
                  </span>
                  <span className="detail-value thread-value">
                    {log.parsed.thread}
                  </span>
                </div>
              )}

              {log.parsed.logger && (
                <div className="detail-item full-width">
                  <span className="detail-label">
                    <FaTag className="dl-icon" /> Logger
                  </span>
                  <span className="detail-value logger-value">
                    {log.parsed.logger}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="log-detail-block">
            <div className="block-section-head">
              <span className="log-block-heading">
                <FaCommentDots className="bh-icon" /> Mensaje
              </span>
              <button
                type="button"
                className="section-copy-btn"
                onClick={handleCopyMessage}
                title="Copiar mensaje"
              >
                <FaCopy size={12} /> Copiar
              </button>
            </div>
            <pre className="message-content">{log.parsed.message}</pre>
          </div>

          <div className="log-detail-block">
            <div className="block-section-head">
              <span className="log-block-heading">
                <FaTerminal className="bh-icon" /> Línea completa (raw)
              </span>
              <button
                type="button"
                className="section-copy-btn"
                onClick={() => handleCopy(log.raw, "raw")}
                title="Copiar línea completa"
              >
                <FaCopy size={12} /> Copiar
              </button>
            </div>
            <pre
              className={`raw-log-content ${isRawExpanded ? "expanded" : ""}`}
            >
              {log.raw}
            </pre>
          </div>

          {log.metadata && Object.keys(log.metadata).length > 0 && (
            <div className="log-detail-block">
              <span className="log-block-heading">
                <FaCogs className="bh-icon" /> Metadata
              </span>
              <pre className="metadata-content">
                {JSON.stringify(log.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="log-modal-footer">
          <div className="footer-left">
            {logs.length > 1 && (
              <div className="navigation-buttons">
                <button
                  type="button"
                  className="btn-nav"
                  onClick={() => handleNavigate("prev")}
                  disabled={!hasPrevious}
                  title="Anterior"
                >
                  <FaChevronLeft /> Anterior
                </button>
                <button
                  type="button"
                  className="btn-nav"
                  onClick={() => handleNavigate("next")}
                  disabled={!hasNext}
                  title="Siguiente"
                >
                  Siguiente <FaChevronRight />
                </button>
              </div>
            )}
          </div>
          <div className="footer-right">
            <button type="button" className="btn-download" onClick={handleDownload}>
              <FaDownload /> Descargar
            </button>
            <button type="button" className="btn-copy" onClick={handleCopyAll}>
              <FaCopy /> Copiar todo
            </button>
            <button type="button" className="btn-copy" onClick={() => handleCopy(log.raw)}>
              <FaCopy /> Copiar línea
            </button>
            <button type="button" className="btn-close" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogDetailModal;
