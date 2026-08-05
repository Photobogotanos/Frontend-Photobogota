import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import {
  solicitarEliminacionCuenta,
  confirmarEliminacionCuenta,
  cancelarEliminacionCuenta,
  obtenerEstadoEliminacionCuenta,
} from "@/services/usuario.service";
import { useAuth } from "@/context/AuthContext";
import { cerrarSesion as cerrarSesionLocal } from "@/utils/sessionHelper";
import VistaProgramada from "./VistaProgramada";
import VistaCodigo from "./VistaCodigo";
import VistaFormulario from "./VistaFormulario";

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
      if (!activo) return;

      const resultado = await obtenerEstadoEliminacionCuenta();

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

  if (vista === "programada") {
    return (
      <VistaProgramada
        estadoInfo={estadoInfo}
        enviando={enviando}
        onRecuperar={handleCancelar}
      />
    );
  }

  if (vista === "codigo") {
    return (
      <VistaCodigo
        codigo={codigo}
        enviando={enviando}
        inputsRef={inputsRef}
        onDigitChange={handleDigitChange}
        onDigitKeyDown={handleDigitKeyDown}
        onConfirmar={handleConfirmar}
        onReenviar={handleReenviarCodigo}
      />
    );
  }

  return (
    <VistaFormulario
      usuario={usuario}
      motivo={motivo}
      comentario={comentario}
      enviando={enviando}
      onMotivoChange={setMotivo}
      onComentarioChange={setComentario}
      onSolicitar={handleSolicitar}
    />
  );
}
