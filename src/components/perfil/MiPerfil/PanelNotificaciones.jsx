import { useRef, useEffect } from "react";
import PreferenciasNotificaciones from "../../notificaciones/PreferenciasNotificaciones/PreferenciasNotificaciones";

const PanelNotificaciones = ({ onCerrar }) => {
  const notificacionesRef = useRef(null);

  useEffect(() => {
    if (notificacionesRef.current) {
      notificacionesRef.current.showModal();
    }
  }, []);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, react-doctor/no-noninteractive-element-interactions
    <dialog
      ref={notificacionesRef}
      className="perfil-notif-dialog"
      aria-labelledby="perfil-notif-title"
      onClose={onCerrar}
      onCancel={(e) => {
        e.preventDefault();
        onCerrar();
      }}
      onClick={(e) => {
        if (e.target === notificacionesRef.current) {
          onCerrar();
        }
      }}
    >
      <div className="perfil-notif-panel">
        <button
          type="button"
          className="perfil-notif-close"
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h3 id="perfil-notif-title" className="perfil-notif-title">
          Preferencias de Notificaciones
        </h3>
        <p className="perfil-notif-sub">
          Configura cómo quieres recibir los avisos.
        </p>
        <PreferenciasNotificaciones
          enModal
          onCerrar={onCerrar}
          onGuardado={onCerrar}
        />
      </div>
    </dialog>
  );
};

export default PanelNotificaciones;
