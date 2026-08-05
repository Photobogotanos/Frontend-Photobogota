import { useState, useEffect, useRef } from "react";
import Select from "react-select";
import Swal from "sweetalert2";
import {
  FaExclamationTriangle,
  FaShieldAlt,
  FaUserSlash,
  FaClock,
  FaChartBar,
  FaCheckCircle,
} from "react-icons/fa";
import {
  solicitarEliminacionCuenta,
  confirmarEliminacionCuenta,
  cancelarEliminacionCuenta,
  obtenerEstadoEliminacionCuenta,
} from "@/services/usuario.service";
import { useAuth } from "@/context/AuthContext";
import { cerrarSesion as cerrarSesionLocal } from "@/utils/sessionHelper";

const MOTIVOS = [
  { value: "", label: "Prefiero no decirlo" },
  { value: "NO_USO_LA_APLICACION", label: "Ya no uso la aplicación" },
  { value: "ENCONTRE_OTRA_ALTERNATIVA", label: "Encontré otra alternativa" },
  { value: "PREOCUPACIONES_DE_PRIVACIDAD", label: "Preocupaciones de privacidad" },
  { value: "MALA_EXPERIENCIA_DE_USO", label: "Mala experiencia de uso" },
  { value: "DEMASIADAS_NOTIFICACIONES", label: "Demasiadas notificaciones" },
  { value: "OTRO", label: "Otro motivo" },
];

const MOTIVO_LABEL = MOTIVOS.reduce((acc, m) => {
  if (m.value) acc[m.value] = m.label;
  return acc;
}, {});

const DIGIT_SLOTS = ["d0", "d1", "d2", "d3", "d4", "d5"];

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

export default function EliminarCuenta({ onHide }) {
  const { usuario } = useAuth();

  // vista: "cargando" | "formulario" | "codigo" | "programada" | "bloqueada"
  const [vista, setVista] = useState("cargando");
  const [enviando, setEnviando] = useState(false);
  const [estadoInfo, setEstadoInfo] = useState(null);

  const [motivo, setMotivo] = useState("");
  const [comentario, setComentario] = useState("");

  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);

  useEffect(() => {
    let activo = true;
    (async () => {
      const resultado = await obtenerEstadoEliminacionCuenta();
      if (!activo) return;

      if (!resultado.exitoso) {
        // Si no se pudo consultar el estado, dejamos ver el formulario igual;
        // el backend validará de nuevo al solicitar.
        setVista("formulario");
        return;
      }

      const datos = resultado.datos;
      setEstadoInfo(datos);

      if (datos?.tieneSolicitudActiva && datos.estado === "PROGRAMADA") {
        setVista("programada");
      } else if (datos?.tieneSolicitudActiva && datos.estado === "PENDIENTE_VERIFICACION") {
        setMotivo(datos.motivo || "");
        setComentario(datos.comentario || "");
        setVista("codigo");
      } else {
        setVista("formulario");
      }
    })();
    return () => {
      activo = false;
    };
  }, []);

  const handleSolicitar = async () => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar tu cuenta?",
      html:
        "Te enviaremos un código de verificación a tu correo. " +
        "Al confirmarlo, tu cuenta quedará <b>desactivada de inmediato</b> y tendrás " +
        "<b>30 días</b> para recuperarla. Pasado ese plazo, tus datos personales " +
        "(nombre, teléfono, foto, biografía) se anonimizarán de forma permanente.",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar código",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c0392b",
      cancelButtonColor: "#806fbe",
    });

    if (!confirmacion.isConfirmed) return;

    setEnviando(true);
    try {
      const body = {};
      if (motivo) body.motivo = motivo;
      if (comentario.trim()) body.comentario = comentario.trim();

      const resultado = await solicitarEliminacionCuenta(body);

      if (!resultado.exitoso) {
        Swal.fire({ icon: "error", title: "No se pudo continuar", text: resultado.mensaje });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Código enviado",
        text: "Revisa tu correo, te enviamos un código de 6 dígitos para confirmar.",
        confirmButtonColor: "var(--color-primary)",
      });
      setCodigo(["", "", "", "", "", ""]);
      setVista("codigo");
    } finally {
      setEnviando(false);
    }
  };

  const handleReenviarCodigo = async () => {
    setEnviando(true);
    try {
      const body = {};
      if (motivo) body.motivo = motivo;
      if (comentario.trim()) body.comentario = comentario.trim();

      const resultado = await solicitarEliminacionCuenta(body);
      Swal.fire({
        icon: resultado.exitoso ? "info" : "error",
        title: resultado.exitoso ? "Código reenviado" : "No se pudo reenviar",
        text: resultado.mensaje,
        confirmButtonColor: "var(--color-primary)",
        timer: resultado.exitoso ? 2200 : undefined,
        showConfirmButton: !resultado.exitoso,
      });
    } finally {
      setEnviando(false);
    }
  };

  const handleDigitChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;
    const nuevo = [...codigo];
    nuevo[index] = value.substring(value.length - 1);
    setCodigo(nuevo);
    if (index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!codigo[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
      if (codigo[index]) {
        const nuevo = [...codigo];
        nuevo[index] = "";
        setCodigo(nuevo);
      }
    }
  };

  const handleConfirmar = async (e) => {
    e.preventDefault();
    const codigoFinal = codigo.join("");

    if (codigoFinal.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Código incompleto",
        text: "Ingresa los 6 dígitos que recibiste por correo.",
        confirmButtonColor: "var(--color-primary)",
      });
      return;
    }

    setEnviando(true);
    try {
      const resultado = await confirmarEliminacionCuenta({ codigo: codigoFinal });

      if (!resultado.exitoso) {
        Swal.fire({ icon: "error", title: "Código inválido", text: resultado.mensaje });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Cuenta desactivada",
        html:
          "Tu cuenta fue desactivada y programada para eliminarse en <b>30 días</b>. " +
          "Puedes recuperarla en cualquier momento antes de esa fecha iniciando sesión " +
          "de nuevo con tu usuario y contraseña. Pasado el plazo, tus datos personales " +
          "se anonimizarán de forma permanente y no podrás deshacer este paso.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "var(--color-primary)",
      });

      // El backend ya cerró todas las sesiones/refresh tokens de este usuario;
      // limpiamos el estado local y recargamos para reflejar el logout por completo.
      cerrarSesionLocal();
      window.location.href = "/Frontend-Photobogota/login";
    } finally {
      setEnviando(false);
    }
  };

  const handleCancelar = async () => {
    const confirmacion = await Swal.fire({
      icon: "question",
      title: "¿Recuperar tu cuenta?",
      text: "Tu cuenta volverá a estar activa y se cancelará la eliminación programada.",
      showCancelButton: true,
      confirmButtonText: "Sí, recuperar",
      cancelButtonText: "Volver",
      confirmButtonColor: "var(--color-primary)",
    });
    if (!confirmacion.isConfirmed) return;

    setEnviando(true);
    try {
      const resultado = await cancelarEliminacionCuenta();
      if (!resultado.exitoso) {
        Swal.fire({ icon: "error", title: "No se pudo recuperar", text: resultado.mensaje });
        return;
      }
      await Swal.fire({
        icon: "success",
        title: "¡Cuenta recuperada!",
        text: resultado.mensaje,
        confirmButtonColor: "var(--color-primary)",
      });
      setVista("formulario");
      setEstadoInfo(null);
      if (onHide) onHide();
    } finally {
      setEnviando(false);
    }
  };

  if (vista === "cargando") {
    return (
      <div className="elim-block elim-loading">
        <span className="elim-spinner" />
        <p>Consultando el estado de tu cuenta...</p>
      </div>
    );
  }

  // ── Vista: solicitud ya PROGRAMADA (dentro del período de 30 días) ──
  if (vista === "programada") {
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
          onClick={handleCancelar}
          disabled={enviando}
        >
          <FaCheckCircle /> {enviando ? "Procesando..." : "Recuperar mi cuenta"}
        </button>
      </div>
    );
  }

  // ── Vista: código OTP de confirmación ──
  if (vista === "codigo") {
    return (
      <form className="elim-block" onSubmit={handleConfirmar}>
        <div className="elim-hero">
          <span className="elim-hero-icon">
            <FaShieldAlt />
          </span>
          <p className="elim-hero-title">Confirma con el código enviado a tu correo</p>
          <p className="elim-hero-sub">
            Ingresa el código de 6 dígitos que te enviamos. Al confirmarlo tu cuenta
            quedará desactivada de inmediato.
          </p>
        </div>

        <div className="elim-otp-inputs">
          {codigo.map((num, idx) => (
            <input
              key={DIGIT_SLOTS[idx]}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength="1"
              className={`elim-otp-digit${num ? " filled" : ""}`}
              value={num}
              ref={(el) => (inputsRef.current[idx] = el)}
              onChange={(e) => handleDigitChange(e, idx)}
              onKeyDown={(e) => handleDigitKeyDown(e, idx)}
              disabled={enviando}
            />
          ))}
        </div>

        <button type="submit" className="elim-btn-danger" disabled={enviando}>
          <FaUserSlash /> {enviando ? "Confirmando..." : "Confirmar eliminación"}
        </button>

        <button
          type="button"
          className="elim-link-btn"
          onClick={handleReenviarCodigo}
          disabled={enviando}
          aria-label="Reenviar código de confirmación"
        >
          ¿No recibiste el código? Reenviar
        </button>
      </form>
    );
  }

  // ── Vista por defecto: formulario + consecuencias ──
  return (
    <div className="elim-block">
      <div className="elim-hero elim-hero-danger">
        <span className="elim-hero-icon">
          <FaExclamationTriangle />
        </span>
        <p className="elim-hero-title">Eliminar mi cuenta, {usuario?.nombre || ""}</p>
        <p className="elim-hero-sub">
          Esta acción desactiva tu cuenta de inmediato. Léela con calma antes de continuar.
        </p>
      </div>

      <div className="elim-consecuencias">
        <div className="elim-consecuencia-item">
          <FaUserSlash className="elim-cons-icon" />
          <div>
            <b>Tu cuenta se desactiva al instante</b>
            <p>No podrás iniciar sesión normalmente ni usar la aplicación mientras esté en este estado.</p>
          </div>
        </div>
        <div className="elim-consecuencia-item">
          <FaClock className="elim-cons-icon" />
          <div>
            <b>Tienes 30 días para recuperarla</b>
            <p>Podrás cancelar la eliminación en cualquier momento antes de que se cumpla el plazo.</p>
          </div>
        </div>
        <div className="elim-consecuencia-item">
          <FaChartBar className="elim-cons-icon" />
          <div>
            <b>Pasado el plazo, se anonimizan tus datos personales</b>
            <p>
              Tu nombre, teléfono, foto y biografía se eliminan de forma permanente. Tus puntos,
              nivel, calificaciones y spots creados se conservan de forma anónima para
              mantener las estadísticas generales de la plataforma.
            </p>
          </div>
        </div>
      </div>

      <div className="elim-form-fields">
        <div className="fgroup">
          <label className="flabel" htmlFor="motivo-eliminacion">
            ¿Por qué te vas? (opcional)
          </label>
          <Select
            id="motivo-eliminacion"
            inputId="motivo-eliminacion"
            classNamePrefix="spot-select"
            options={MOTIVOS}
            value={MOTIVOS.find((m) => m.value === motivo) || null}
            onChange={(opcion) => setMotivo(opcion ? opcion.value : "")}
            isClearable
            placeholder="Selecciona un motivo..."
          />
        </div>

        <div className="fgroup">
          <label className="flabel" htmlFor="comentario-eliminacion">
            Cuéntanos más (opcional)
          </label>
          <textarea
            id="comentario-eliminacion"
            className="finput ftextarea"
            rows={3}
            maxLength={500}
            placeholder="Ayúdanos a mejorar contándonos qué pasó..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />
          <span className="char-hint">{comentario.length}/500</span>
        </div>
      </div>

      <button
        type="button"
        className="elim-btn-danger"
        onClick={handleSolicitar}
        disabled={enviando}
      >
        <FaExclamationTriangle /> {enviando ? "Enviando..." : "Solicitar eliminación de mi cuenta"}
      </button>
    </div>
  );
}
