import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { FaClock, FaBan, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerEstadoEliminacionCuenta,
  cancelarEliminacionCuenta,
} from "@/services/usuario.service";
import "./CuentaInactivaPage.css";

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

export default function CuentaInactivaPage() {
  const { usuario, cerrarSesion, recargarUsuario } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [recuperando, setRecuperando] = useState(false);
  const [estadoInfo, setEstadoInfo] = useState(null);

  useEffect(() => {
    let activo = true;
    (async () => {
      // El estado de eliminación solo aplica (y solo es consultable) para MIEMBRO;
      // otras cuentas desactivadas por un admin ven directamente el mensaje genérico.
      if ((usuario?.rol || "").toUpperCase() !== "MIEMBRO") {
        setCargando(false);
        return;
      }
      const resultado = await obtenerEstadoEliminacionCuenta();
      if (!activo) return;
      if (
        resultado.exitoso &&
        resultado.datos?.tieneSolicitudActiva &&
        resultado.datos.estado === "PROGRAMADA"
      ) {
        setEstadoInfo(resultado.datos);
      }
      setCargando(false);
    })();
    return () => {
      activo = false;
    };
  }, [usuario]);

  const handleRecuperar = async () => {
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "¿Recuperar tu cuenta?",
      text: "Tu cuenta volverá a estar activa y podrás usarla con normalidad.",
      showCancelButton: true,
      confirmButtonText: "Sí, recuperar",
      cancelButtonText: "Volver",
      confirmButtonColor: "var(--color-primary)",
    });
    if (!confirmacion.isConfirmed) return;

    setRecuperando(true);
    try {
      const resultado = await cancelarEliminacionCuenta();
      if (!resultado.exitoso) {
        Swal.fire({
          icon: "error",
          title: "No se pudo recuperar",
          text: resultado.mensaje,
        });
        return;
      }
      await Swal.fire({
        icon: "success",
        title: "¡Cuenta recuperada!",
        text: resultado.mensaje,
        confirmButtonColor: "var(--color-primary)",
      });
      await recargarUsuario();
    } finally {
      setRecuperando(false);
    }
  };

  if (cargando) {
    return (
      <div className="cuenta-inactiva-page">
        <div className="cip-card">
          <span className="cip-spinner" />
          <p>Consultando el estado de tu cuenta...</p>
        </div>
      </div>
    );
  }

  const tieneRecuperacion = !!estadoInfo;

  return (
    <div className="cuenta-inactiva-page">
      <div className="cip-card">
        <span
          className={`cip-icon ${tieneRecuperacion ? "cip-icon-recover" : "cip-icon-block"}`}
        >
          {tieneRecuperacion ? <FaClock /> : <FaBan />}
        </span>

        {tieneRecuperacion ? (
          <>
            <h1 className="cip-title">
              Tu cuenta está programada para eliminarse
            </h1>
            <p className="cip-text">
              Solicitaste eliminar tu cuenta. Tienes hasta el{" "}
              <b>{formatearFecha(estadoInfo.fechaProgramadaEliminacion)}</b>{" "}
              para recuperarla
              {estadoInfo.diasRestantes != null
                ? ` (${estadoInfo.diasRestantes} días restantes)`
                : ""}
              . Pasado ese plazo, tus datos personales se anonimizarán de forma
              permanente.
            </p>
            {estadoInfo.motivo && (
              <p className="cip-detalle">
                Motivo indicado:{" "}
                <b>{MOTIVO_LABEL[estadoInfo.motivo] || estadoInfo.motivo}</b>
              </p>
            )}

            <button
              type="button"
              className="cip-btn-recover"
              onClick={handleRecuperar}
              disabled={recuperando}
            >
              <FaCheckCircle />{" "}
              {recuperando ? "Procesando..." : "Recuperar mi cuenta"}
            </button>
          </>
        ) : (
          <>
            <h1 className="cip-title">Tu cuenta está desactivada</h1>
            <p className="cip-text">
              Un administrador desactivó esta cuenta. Si crees que esto es un
              error, comunícate con soporte para más información.
            </p>
          </>
        )}

        <button type="button" className="cip-btn-logout" onClick={cerrarSesion}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
