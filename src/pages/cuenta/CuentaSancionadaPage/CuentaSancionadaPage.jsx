import { useEffect, useState } from "react";
import { FaUserSlash, FaClock, FaPaperPlane, FaSignOutAlt, FaRedo } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerMiSancion,
  apelarMiBan,
  TIPOS_SANCION,
} from "@/services/moderacion.service";
import "./CuentaSancionadaPage.css";

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

const TIPO_TITULO = {
  MUTE: "Tu cuenta está silenciada",
  SUSPENSION: "Tu cuenta está suspendida temporalmente",
  BAN: "Tu cuenta está suspendida",
};

const TIPO_DESCRIPCION = {
  MUTE: "No puedes publicar contenido mientras dure el silencio.",
  SUSPENSION: "No puedes publicar contenido mientras dure la suspensión.",
  BAN: "No puedes publicar contenido. Puedes enviar una apelación para que un administrador revise tu caso.",
};

export default function CuentaSancionadaPage() {
  const { usuario, cerrarSesion, recargarUsuario } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [sancion, setSancion] = useState(null);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [apelacionEnviada, setApelacionEnviada] = useState(false);

  useEffect(() => {
    let activo = true;
    (async () => {
      const resultado = await obtenerMiSancion();
      if (activo) {
        setSancion(resultado.exitoso ? resultado.datos : usuario?.sancion ?? null);
        setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [usuario]);

  const manejarApelar = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) return;
    setEnviando(true);
    const resultado = await apelarMiBan({ motivo: motivo.trim() });
    setEnviando(false);
    if (resultado.exitoso) {
      setApelacionEnviada(true);
      setMotivo("");
    } else {
      setApelacionEnviada(false);
      window.alert(resultado.mensaje);
    }
  };

  const comprobarEstado = async () => {
    setCargando(true);
    try {
      await recargarUsuario();
    } catch {
      // Si falla la recarga, se mantiene la pantalla actual
    }
    const resultado = await obtenerMiSancion();
    setSancion(resultado.exitoso ? resultado.datos : usuario?.sancion ?? null);
    setCargando(false);
  };

  if (cargando) {
    return (
      <div className="cuenta-sancionada-page">
        <div className="csp-card">
          <span className="csp-spinner" />
          <p>Consultando el estado de tu cuenta...</p>
        </div>
      </div>
    );
  }

  const tipo = sancion?.tipo;
  const info = TIPOS_SANCION.find((t) => t.valor === tipo);
  const titulo = TIPO_TITULO[tipo] || "Tu cuenta está sancionada";
  const descripcion = TIPO_DESCRIPCION[tipo] || "";

  return (
    <div className="cuenta-sancionada-page">
      <div className="csp-card">
        <span className="csp-icon">
          {tipo === "BAN" ? <FaUserSlash /> : <FaClock />}
        </span>

        <h1 className="csp-title">{titulo}</h1>
        <p className="csp-text">{descripcion}</p>

        {info && (
          <span className={`csp-badge csp-badge-${info.variant}`}>{info.etiqueta}</span>
        )}

        {sancion?.fechaExpiracion && (
          <p className="csp-detalle">
            Vuelve a la normalidad el <b>{formatearFecha(sancion.fechaExpiracion)}</b>
          </p>
        )}

        {sancion?.motivo && (
          <p className="csp-detalle">
            Motivo: <b>{sancion.motivo}</b>
          </p>
        )}

        {sancion?.contadorInfracciones != null && (
          <p className="csp-detalle">
            Infracciones registradas: <b>{sancion.contadorInfracciones}</b>
          </p>
        )}

        {tipo === "BAN" && sancion?.puedeApelar && !apelacionEnviada && (
          <form onSubmit={manejarApelar} className="csp-form">
            <label htmlFor="motivo-apelacion" className="csp-label">
              Motivo de la apelación
            </label>
            <textarea
              id="motivo-apelacion"
              className="csp-textarea"
              rows={4}
              placeholder="Explica por qué crees que la suspensión es un error..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              required
            />
            <button type="submit" className="csp-btn-recover" disabled={enviando}>
              <FaPaperPlane /> {enviando ? "Enviando..." : "Enviar apelación"}
            </button>
          </form>
        )}

        {tipo === "BAN" && apelacionEnviada && (
          <p className="csp-success">
            Tu apelación fue enviada. Un administrador la revisará y te notificará la
            decisión.
          </p>
        )}

        <button type="button" className="csp-btn-check" onClick={comprobarEstado}>
          <FaRedo /> Comprobar estado de la sanción
        </button>

        <button type="button" className="csp-btn-logout" onClick={cerrarSesion}>
          <FaSignOutAlt /> Cerrar sesión
        </button>
      </div>
    </div>
  );
}
