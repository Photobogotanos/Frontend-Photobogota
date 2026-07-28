import { FaTools } from "react-icons/fa";
import "./MantenimientoOverlay.css";

const formatearFecha = (iso) => {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return null;
  }
};

export default function MantenimientoOverlay({ mensaje, fechaFin, onReintentar }) {
  const fechaFormateada = formatearFecha(fechaFin);

  return (
    <div className="mantenimiento-overlay">
      <div className="mantenimiento-card">
        <FaTools className="mantenimiento-icono" />
        <h1 className="mantenimiento-titulo">Servidor en mantenimiento</h1>
        <p className="mantenimiento-mensaje">
          {mensaje ||
            "Estamos realizando tareas de mantenimiento en PhotoBogotá. Vuelve a intentarlo en unos minutos."}
        </p>
        {fechaFormateada && (
          <p className="mantenimiento-fecha">
            Disponible nuevamente aprox. el <strong>{fechaFormateada}</strong>
          </p>
        )}
        <button className="mantenimiento-btn" onClick={onReintentar}>
          Reintentar ahora
        </button>
      </div>
    </div>
  );
}
