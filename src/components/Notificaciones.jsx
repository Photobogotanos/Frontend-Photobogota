import { useState } from "react";
import { FaBell } from "react-icons/fa";
import "./Notificaciones.css";

export default function Notificaciones({ notificaciones = 0 }) {
  const [mostrarPanel, setMostrarPanel] = useState(false);

  const togglePanel = () => {
    setMostrarPanel(!mostrarPanel);
  };

  return (
    <div className="notificaciones-wrapper position-relative">
      {/* Botón */}
      <button
        className={`btn-notificaciones position-relative ${
          notificaciones > 0 ? "shake-bell" : ""
        }`}
        aria-label={`Notificaciones (${notificaciones})`}
        onClick={togglePanel}
      >
        <FaBell />
        {notificaciones > 0 && (
          <span className="badge-notificaciones">{notificaciones}</span>
        )}
      </button>

      {/* Panel */}
      {mostrarPanel && (
        <div className="panel-notificaciones shadow">
          <h6 className="titulo-notificaciones">Notificaciones</h6>

          <ul className="lista-notificaciones">
            <li>Nueva foto agregada a tu colección</li>
            <li>A alguien le gustó tu publicación</li>
            <li>Tienes nuevas recomendaciones</li>
          </ul>
        </div>
      )}
    </div>
  );
}
