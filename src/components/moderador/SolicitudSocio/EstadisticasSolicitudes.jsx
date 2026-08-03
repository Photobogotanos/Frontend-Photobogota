import { FiClock, FiEdit3, FiSend, FiCheckCircle, FiXCircle } from "react-icons/fi";
import "./EstadisticasSolicitudes.css";

// Muestra los contadores de solicitudes procesadas/pendientes para que el
// moderador tenga una vista rápida de la carga de trabajo (criterio 5 de la HU).
export default function EstadisticasSolicitudes({ estadisticas, loading }) {
  if (loading || !estadisticas) return null;

  const tarjetas = [
    {
      key: "pendientes",
      label: "Pendientes",
      valor: estadisticas.pendientes,
      icono: <FiClock />,
      color: "#f0ad4e",
    },
    {
      key: "enCorreccion",
      label: "En corrección",
      valor: estadisticas.enCorreccion,
      icono: <FiEdit3 />,
      color: "#0dcaf0",
    },
    {
      key: "enEnvioCredenciales",
      label: "Envío de credenciales",
      valor: estadisticas.enEnvioCredenciales,
      icono: <FiSend />,
      color: "#20c997",
    },
    {
      key: "aprobadas",
      label: "Aprobadas",
      valor: estadisticas.aprobadas,
      icono: <FiCheckCircle />,
      color: "#198754",
    },
    {
      key: "rechazadas",
      label: "Rechazadas",
      valor: estadisticas.rechazadas,
      icono: <FiXCircle />,
      color: "#dc3545",
    },
  ];

  return (
    <div className="estadisticas-solicitudes mb-4">
      {tarjetas.map((t) => (
        <div key={t.key} className="estadistica-card">
          <div className="estadistica-icono" style={{ color: t.color }}>
            {t.icono}
          </div>
          <div>
            <div className="estadistica-valor">{t.valor}</div>
            <div className="estadistica-label">{t.label}</div>
          </div>
        </div>
      ))}
      <div className="estadistica-card estadistica-total">
        <div>
          <div className="estadistica-valor">{estadisticas.total}</div>
          <div className="estadistica-label">Total de solicitudes</div>
        </div>
      </div>
    </div>
  );
}
