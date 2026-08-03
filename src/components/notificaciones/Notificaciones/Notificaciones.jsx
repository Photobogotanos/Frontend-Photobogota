import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [contador, setContador] = useState(0);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarContador = async () => {
    const contadorRes = await obtenerContadorNoLeidas();
    setContador(contadorRes);
  };

  const cargarDatos = async () => {
    setCargando(true);
    // Traemos leídas y no leídas para que al marcar como leída la notificación
    // no desaparezca del panel, solo cambie de estado visual.
    const [notifsRes, contadorRes] = await Promise.all([
      obtenerMisNotificaciones(0, 15, false),
      obtenerContadorNoLeidas(),
    ]);
    if (notifsRes.exitoso) setNotificaciones(notifsRes.data.content || []);
    setContador(contadorRes);
    setCargando(false);
  };

  useEffect(() => {
    if (usuario) {
      // Al entrar/recargar la sesión ya debe quedar el contador actualizado,
      // sin necesidad de abrir el panel de la campana.
      cargarContador();
      // Polling cada 30 segundos
      const interval = setInterval(cargarContador, 30000);
      return () => clearInterval(interval);
    }
  }, [usuario]);

  const handleMarcarLeida = async (id) => {
    const ok = await marcarComoLeida(id);
    if (ok) {
      // La dejamos en la lista, solo se actualiza su estado a leída.
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );
      setContador((c) => Math.max(0, c - 1));
    }
  };

  const handleMarcarTodas = async () => {
    const ok = await marcarTodasComoLeidas();
    if (ok) {
      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      setContador(0);
    }
  };

  const handleEliminar = async (id, e) => {
    e.stopPropagation();
    const ok = await eliminarNotif(id);
    if (ok) {
      setNotificaciones((prev) => {
        const eliminada = prev.find((n) => n.id === id);
        if (eliminada && !eliminada.leida) {
          setContador((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });
    }
  };

  const handleClickNotificacion = async (notif) => {
    if (!notif.leida) {
      await handleMarcarLeida(notif.id);
    }
    if (notif.spotId) {
      setMostrarPanel(false);
      navigate(`/spot/${notif.spotId}`);
    }
  };

  return (
    <div className="notificaciones-wrapper position-relative">
      <button
        className={`btn-campana ${contador > 0 ? "shake-bell" : ""}`}
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
                No tienes notificaciones
              </p>
            ) : (
              notificaciones.map((notif) => (
                <div
                  key={notif.id}
                  className={`notif-item ${!notif.leida ? "no-leida" : ""} ${
                    notif.spotId ? "notif-clickeable" : ""
                  }`}
                  onClick={() => handleClickNotificacion(notif)}
                  role={notif.spotId ? "button" : undefined}
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
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarcarLeida(notif.id);
                        }}
                        title="Marcar como leída"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleEliminar(notif.id, e)}
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
