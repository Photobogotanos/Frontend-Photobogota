import { FaClock, FaCheckCircle } from "react-icons/fa";

const MOTIVO_LABEL = {
  NO_USO_LA_APLICACION: "Ya no uso la aplicación",
  ENCONTRE_OTRA_ALTERNATIVA: "Encontré otra alternativa",
  PREOCUPACIONES_DE_PRIVACIDAD: "Preocupaciones de privacidad",
  MALA_EXPERIENCIA_DE_USO: "Mala experiencia de uso",
  DEMASIADAS_NOTIFICACIONES: "Demasiadas notificaciones",
  OTRO: "Otro motivo",
};

function formatearFecha(fechaIso) {
  if (!fechaIso) return "";
  try {
    return new Date(fechaIso).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return fechaIso;
  }
}

export default function VistaProgramada({ estadoInfo, enviando, onRecuperar }) {
  return (
    <div className="elim-block">
      <div className="elim-hero elim-hero-danger">
        <span className="elim-hero-icon">
          <FaClock />
        </span>
        <p className="elim-hero-title">Tu cuenta está programada para eliminarse</p>
        <p className="elim-hero-sub">
          Tienes hasta el <b>{formatearFecha(estadoInfo?.fechaProgramadaEliminacion)}</b> para
          recuperarla{estadoInfo?.diasRestantes != null ? ` (${estadoInfo.diasRestantes} días restantes)` : ""}.
          Después de esa fecha, tus datos personales se anonimizarán de forma permanente.
        </p>
      </div>

      {estadoInfo?.motivo && (
        <p className="elim-detalle">
          Motivo indicado: <b>{MOTIVO_LABEL[estadoInfo.motivo] || estadoInfo.motivo}</b>
        </p>
      )}

      <button
        type="button"
        className="elim-btn-recover"
        onClick={onRecuperar}
        disabled={enviando}
      >
        <FaCheckCircle /> {enviando ? "Procesando..." : "Recuperar mi cuenta"}
      </button>
    </div>
  );
}
