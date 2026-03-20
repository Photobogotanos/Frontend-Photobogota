import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import { iniciarSesion } from "@/services/usuario.service";
import { USUARIOS_DEMO } from "@/mocks/usuario.mock";
import { obtenerEstadoServidor } from "@/utils/serverStatus";

const CREDENCIALES_DEMO = {
  socio:      "socio123",
  perro:      "encerrado",
  moderador:  "mod123",
};

const CUENTAS_ESPECIALES = ["SOCIO", "ADMINISTRADOR", "MODERADOR"];

export default function LoginForm() {
  const [usuarioOCorreo, setUsuarioOCorreo]     = useState("");
  const [contrasena, setContrasena]             = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarCuentasDemo, setMostrarCuentasDemo] = useState(false);
  const [copiado, setCopiado]                   = useState(null);
  const [cargando, setCargando]                 = useState(false);
  const [servidorOnline, setServidorOnline]     = useState(null); // null = verificando

  const navegar = useNavigate();

  useEffect(() => {
    obtenerEstadoServidor().then((online) => setServidorOnline(online));
  }, []);

  const cuentasEspeciales = USUARIOS_DEMO.filter((u) =>
    CUENTAS_ESPECIALES.includes(u.rol)
  );

  const copiarCredenciales = (nombreUsuario) => {
    // Usamos el mapa de texto plano local, NO el hash del mock
    const pass = CREDENCIALES_DEMO[nombreUsuario] ?? "";
    setUsuarioOCorreo(nombreUsuario);
    setContrasena(pass);
    setCopiado(nombreUsuario);
    setTimeout(() => setCopiado(null), 2000);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!usuarioOCorreo.trim()) {
      toast.error("Debes ingresar tu usuario o correo.");
      return;
    }

    if (!contrasena.trim()) {
      toast.error("Debes ingresar la contraseña.");
      return;
    }

    const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuarioOCorreo);
    if (!esCorreoValido && usuarioOCorreo.length < 3) {
      toast.error("Debe ser un correo válido o un usuario con mínimo 3 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const resultado = await iniciarSesion(usuarioOCorreo.trim(), contrasena);

      if (!resultado.exitoso) {
        toast.error(resultado.mensaje);
        return;
      }

      toast.success(
        resultado.esDemo
          ? `¡Bienvenido (Demo)! Hola, ${resultado.datos.nombre}.`
          : `¡Bienvenido! Hola, ${resultado.datos.nombre || usuarioOCorreo}.`,
        {
          duration: 3000,
          position: "top-center",
          style: {
            fontSize: "1rem",
            fontWeight: "600",
            padding: "14px 20px",
            minWidth: "280px",
          },
        }
      );

      navegar("/mapa");
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("No se pudo conectar con el servidor. Intenta de nuevo más tarde.");
    } finally {
      setCargando(false);
    }
  };

  const etiquetaRol = (rol) => {
    const mapa = {
      SOCIO:         { texto: "Socio", color: "#806fbe" },
      ADMINISTRADOR: { texto: "Admin", color: "#e07b54" },
      MODERADOR:     { texto: "Mod",   color: "#4a9b7f" },
    };
    return mapa[rol] || { texto: rol, color: "#888" };
  };

  // El panel demo solo se muestra si el servidor está OFFLINE (servidorOnline === false)
  // Mientras verifica (null), no mostramos nada para evitar un flash visual
  const mostrarPanelDemo = servidorOnline === false;

  return (
    <>
      <Form onSubmit={manejarEnvio} className="login-form-container">
        <div className="login-form-header">
          <span className="login-subtitle">Accede a tu cuenta</span>
          <h2 className="login-form-title">Photo Bogotá</h2>
          <span className="login-title-line"></span>
        </div>

        <Form.Group className="mt-5">
          <Form.Label className="login-form-label">
            <FaUser className="lf-label-icon" /> Usuario o Correo
            <RequiredMark />
          </Form.Label>
          <div className="input-icon-container">
            <Form.Control
              className="grupitos rounded-pill input-with-icon"
              type="text"
              value={usuarioOCorreo}
              onChange={(e) => setUsuarioOCorreo(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className="mt-4">
          <Form.Label className="login-form-label">
            <FaLock className="lf-label-icon" /> Contraseña
            <RequiredMark />
          </Form.Label>
          <div className="input-icon-container">
            <Form.Control
              className="grupitos rounded-pill input-with-icon"
              type={mostrarContrasena ? "text" : "password"}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <span
              className="eye-icon"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="lf-forgot mt-1">
            <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </div>
        </Form.Group>

        {/* Panel de cuentas demo — solo visible si el servidor está offline */}
        {mostrarPanelDemo && (
          <div className="demo-accounts-wrapper mt-4">
            <button
              type="button"
              className="demo-toggle-btn"
              onClick={() => setMostrarCuentasDemo(!mostrarCuentasDemo)}
            >
              <span className="demo-toggle-icon">{mostrarCuentasDemo ? "▲" : "▼"}</span>
              Cuentas demo disponibles
            </button>

            <div className={`demo-panel ${mostrarCuentasDemo ? "demo-panel--open" : ""}`}>
              <p className="demo-panel-info">
                Haz clic en una cuenta para autocompletar las credenciales.
              </p>

              <div className="demo-cards">
                {cuentasEspeciales.map((u) => {
                  const etiqueta = etiquetaRol(u.rol);
                  return (
                    <button
                      key={u.id}
                      type="button"
                      className={`demo-card ${copiado === u.nombreUsuario ? "demo-card--copiado" : ""}`}
                      onClick={() => copiarCredenciales(u.nombreUsuario)}
                      style={{ "--rol-color": etiqueta.color }}
                    >
                      <span
                        className="demo-card-badge"
                        style={{ backgroundColor: etiqueta.color }}
                      >
                        {etiqueta.texto}
                      </span>
                      <span className="demo-card-user">@{u.nombreUsuario}</span>
                      <span className="demo-card-pass">
                        {CREDENCIALES_DEMO[u.nombreUsuario] ?? "••••••••"}
                      </span>
                      {copiado === u.nombreUsuario && (
                        <span className="demo-card-check">✓ Listo</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="demo-miembro-aviso">
                <span className="demo-miembro-icon">👤</span>
                <span>
                  Para acceder como <b>Miembro</b>, primero debes{" "}
                  <Link to="/creacion-cuenta">crear una cuenta</Link>.
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="solicitud-form-submit mt-4">
          <button
            type="submit"
            className={`lf-submit-btn ${cargando ? "lf-submit-btn--loading" : ""}`}
            disabled={cargando}
          >
            {cargando ? "Ingresando…" : "Ingresar →"}
          </button>
        </div>

        <div className="lf-footer">
          <p>
            ¿Eres nuevo en Photo Bogotá?{" "}
            <Link to="/creacion-cuenta">
              <b>Crear cuenta</b>
            </Link>
          </p>
          <div className="justify-content-center d-flex mb-4">
            <BackButton />
          </div>
        </div>
      </Form>
    </>
  );
}