import "./PromoPreview.css"; // opcional, crea estilos si quieres

export default function PromoPreview({ state, estado }) {
  if (!state.titulo && !state.descripcion) {
    return (
      <div className="promo-preview empty">
        <p className="text-muted">La vista previa aparecerá aquí cuando completes los datos</p>
      </div>
    );
  }

  return (
    <div className="promo-preview mt-5">
      <h5 className="section-title mb-3">Vista previa de la promoción</h5>

      <div className="preview-card">
        {state.previews.length > 0 && (
          <div className="preview-image">
            <img src={state.previews[0]} alt="Preview" />
          </div>
        )}

        <div className="preview-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h4 className="preview-title mb-0">{state.titulo || "Sin título"}</h4>
            <span className={`badge estado-${estado}`}>
              {estado === "activa" && "Activa"}
              {estado === "expirada" && "Expirada"}
              {estado === "proximamente" && "Próximamente"}
            </span>
          </div>

          <p className="preview-tipo text-muted mb-2">
            Tipo: <strong>{state.tipo}</strong>
          </p>

          <p className="preview-descripcion">
            {state.descripcion || "Sin descripción"}
          </p>

          <div className="preview-meta">
            {state.fechaInicio && (
              <span>Desde: {state.fechaInicio}</span>
            )}
            {state.fechaFin && (
              <span>Hasta: {state.fechaFin}</span>
            )}
            {state.limiteUsos && (
              <span>Límite: {state.limiteUsos} usos</span>
            )}
            {!state.limiteUsos && state.limiteUsos !== 0 && (
              <span>Usos ilimitados</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}