const LogRow = ({ linea, parsed, NIVELES_LOG, index, onSelect }) => {
  const nivel = parsed.level;

  let nivelVisual = null;
  if (nivel && NIVELES_LOG[nivel]) {
    nivelVisual = nivel;
  } else {
    const clave = Object.keys(NIVELES_LOG).find((key) =>
      // oxlint-disable-next-line react-doctor/js-set-map-lookups -- búsqueda de subcadena sobre string; un Set no aplica
      linea.includes(key),
    );
    if (clave) nivelVisual = clave;
  }

  return (
    <div
      className={`log-line ${nivelVisual ? `log-${nivelVisual.toLowerCase()}` : ""}`}
      onClick={() => onSelect({ raw: linea, parsed, id: linea })}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect({ raw: linea, parsed, id: linea });
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="log-line-number">{index + 1}</div>
      {nivelVisual && (
        <div
          className="log-level-icon"
          style={{ color: NIVELES_LOG[nivelVisual].color }}
        >
          {NIVELES_LOG[nivelVisual].icon}
        </div>
      )}
      <div className="log-content">
        {parsed.timestamp && (
          <span className="log-timestamp">{parsed.timestamp}</span>
        )}
        {parsed.thread && (
          <span className="log-thread">[{parsed.thread}]</span>
        )}
        {parsed.logger && <span className="log-logger">{parsed.logger}</span>}
        <span className="log-message">- {parsed.message}</span>
      </div>
    </div>
  );
};

export default LogRow;
