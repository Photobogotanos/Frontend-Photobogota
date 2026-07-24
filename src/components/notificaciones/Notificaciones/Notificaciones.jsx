import { useState, useEffect } from "react";
import { FaBell, FaCheck, FaTrash } from "react-icons/fa";
import "./Notificaciones.css";
import {
  obtenerMisNotificaciones,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotif,
  obtenerContadorNoLeidas,
} from "@/services/notificacion.service";
import { useAuth } from "@/context/AuthContext";

export default function Notificaciones() {
  const { usuario } = useAuth();
  const [notificaciones, setNotificaciones] = useState([]);
  const [contador, setContador] = useState(0);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = async () => {
    setCargando(true);
    const [notifsRes, contadorRes] = await Promise.all([
      obtenerMisNotificaciones(0, 10, true),
      obtenerContadorNoLeidas(),
    ]);
    if (notifsRes.exitoso) setNotificaciones(notifsRes.data.content || []);
    setContador(contadorRes);
    setCargando(false);
  };

  useEffect(() => {
    if (usuario) {
      cargarDatos();
      // Polling cada 30 segundos
      const interval = setInterval(cargarDatos, 30000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

  const handleMarcarLeida = async (id) => {
    const ok = await marcarComoLeida(id);
    if (ok) {
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setContador((c) => Math.max(0, c - 1));
    }
  };

  const handleMarcarTodas = async () => {
    const ok = await marcarTodasComoLeidas();
    if (ok) {
      setNotificaciones([]);
      setContador(0);
    }
  };

  const handleEliminar = async (id) => {
    const ok = await eliminarNotif(id);
    if (ok) setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="notificaciones-wrapper position-relative">
      <button
        className={`btn-notificaciones ${contador > 0 ? "shake-bell" : ""}`}
        onClick={() => {
          setMostrarPanel(!mostrarPanel);
          if (!mostrarPanel) cargarDatos();
        }}
      >
        <FaBell size={22} />
        {contador > 0 && (
          <span className="badge-notificaciones">{contador}</span>
        )}
      </button>

      {mostrarPanel && (
        <div className="panel-notificaciones shadow-lg">
          <div className="panel-header">
            <h6>Notificaciones ({contador})</h6>
            {contador > 0 && (
              <button
                onClick={handleMarcarTodas}
                className="btn-sm text-primary"
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="lista-notificaciones">
            {cargando ? (
              <p className="text-center py-3">Cargando...</p>
            ) : notificaciones.length === 0 ? (
              <p className="text-center py-4 text-muted">
                No tienes notificaciones nuevas
              </p>
            ) : (
              notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.leida ? "no-leida" : ""}`}
                >
                  <div>
                    <strong>{notif.titulo}</strong>
                    <p className="mb-1">{notif.mensaje}</p>
                    <small className="text-muted">
                      {new Date(notif.fechaCreacion).toLocaleString("es-CO")}
                    </small>
                  </div>
                  <div className="notif-actions">
                    {!notif.leida && (
                      <button
                        onClick={() => handleMarcarLeida(notif.id)}
                        title="Marcar como leída"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={() => handleEliminar(notif.id)}
                      title="Eliminar"
                      className="text-danger"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
