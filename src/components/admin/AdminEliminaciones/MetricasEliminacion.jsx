import { FiClock, FiCheckCircle, FiUserX, FiTrendingUp } from "react-icons/fi";
import { MOTIVOS_ELIMINACION_LABEL } from "@/services/admin.service";

export default function MetricasEliminacion({ metricas, cargando }) {
  if (cargando) {
    return (
      <div className="elim-metricas elim-metricas-loading">
        <div className="spinner-border spinner-border-sm text-primary" role="status" />
        <span>Cargando métricas...</span>
      </div>
    );
  }

  if (!metricas) return null;

  const motivoTop = Object.entries(metricas.porMotivo || {}).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="elim-metricas">
      <div className="elim-metrica-card">
        <FiUserX className="elim-metrica-icon" />
        <div>
          <span className="elim-metrica-numero">{metricas.totalSolicitudes}</span>
          <span className="elim-metrica-label">Solicitudes totales</span>
        </div>
      </div>

      <div className="elim-metrica-card">
        <FiClock className="elim-metrica-icon" />
        <div>
          <span className="elim-metrica-numero">{metricas.porEstado?.PROGRAMADA || 0}</span>
          <span className="elim-metrica-label">En período de recuperación</span>
        </div>
      </div>

      <div className="elim-metrica-card">
        <FiCheckCircle className="elim-metrica-icon" />
        <div>
          <span className="elim-metrica-numero">{metricas.completadasUltimos30Dias}</span>
          <span className="elim-metrica-label">Completadas (últimos 30 días)</span>
        </div>
      </div>

      <div className="elim-metrica-card">
        <FiTrendingUp className="elim-metrica-icon" />
        <div>
          <span className="elim-metrica-numero">
            {metricas.promedioDiasHastaCompletada != null
              ? `${metricas.promedioDiasHastaCompletada.toFixed(1)}d`
              : "—"}
          </span>
          <span className="elim-metrica-label">Promedio hasta completarse</span>
        </div>
      </div>

      {motivoTop && (
        <div className="elim-metrica-card elim-metrica-motivo">
          <div>
            <span className="elim-metrica-label">Motivo más frecuente</span>
            <span className="elim-metrica-motivo-valor">
              {MOTIVOS_ELIMINACION_LABEL[motivoTop[0]] || motivoTop[0]} ({motivoTop[1]})
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
