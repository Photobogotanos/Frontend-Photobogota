import { useReducer, useEffect } from "react";
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
  socio: "socio123",
  perro: "encerrado",
  moderador: "mod123",
};

const CUENTAS_ESPECIALES = ["SOCIO", "ADMINISTRADOR", "MODERADOR"];

// Reducer function
function loginReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "TOGGLE_MOSTRAR_CONTRASENA":
      return { ...state, mostrarContrasena: !state.mostrarContrasena };
    case "TOGGLE_MOSTRAR_CUENTAS_DEMO":
      return { ...state, mostrarCuentasDemo: !state.mostrarCuentasDemo };
    case "SET_COPIADO":
      return { ...state, copiado: action.payload };
    case "CLEAR_COPIADO":
      return { ...state, copiado: null };
    case "SET_CARGANDO":
      return { ...state, cargando: action.payload };
    case "SET_SERVIDOR_ONLINE":
      return { ...state, servidorOnline: action.payload };
    default:
      return state;
  }
}

// Estado inicial
const initialState = {
  usuarioOCorreo: "",
  contrasena: "",
  mostrarContrasena: false,
  mostrarCuentasDemo: false,
  copiado: null,
  cargando: false,
  servidorOnline: null, // null = verificando
};

export default function LoginForm() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const navegar = useNavigate();

  useEffect(() => {
    obtenerEstadoServidor().then((online) => 
      dispatch({ type: "SET_SERVIDOR_ONLINE", payload: online })
    );
  }, []);

  const cuentasEspeciales = USUARIOS_DEMO.filter((u) =>
    CUENTAS_ESPECIALES.includes(u.rol)
  );

  const copiarCredenciales = (nombreUsuario) => {
    const pass = CREDENCIALES_DEMO[nombreUsuario] ?? "";
    dispatch({ type: "SET_FIELD", payload: { field: "usuarioOCorreo", value: nombreUsuario } });
    dispatch({ type: "SET_FIELD", payload: { field: "contrasena", value: pass } });
    dispatch({ type: "SET_COPIADO", payload: nombreUsuario });
    setTimeout(() => dispatch({ type: "CLEAR_COPIADO" }), 2000);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    if (!state.usuarioOCorreo.trim()) {
      toast.error("Debes ingresar tu usuario o correo.");
      return;
    }

    if (!state.contrasena.trim()) {
      toast.error("Debes ingresar la contraseña.");
      return;
    }

    const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.usuarioOCorreo);
    if (!esCorreoValido && state.usuarioOCorreo.length < 3) {
      toast.error("Debe ser un correo válido o un usuario con mínimo 3 caracteres.");
      return;
    }

    dispatch({ type: "SET_CARGANDO", payload: true });

    try {
      const resultado = await iniciarSesion(state.usuarioOCorreo.trim(), state.contrasena);

      if (!resultado.exitoso) {
        toast.error(resultado.mensaje);
        return;
      }

      toast.success(
        resultado.esDemo
          ? `¡Bienvenido (Demo)! Hola, ${resultado.datos.nombre}.`
          : `¡Bienvenido! Hola, ${resultado.datos.nombre || state.usuarioOCorreo}.`,
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
      dispatch({ type: "SET_CARGANDO", payload: false });
    }
  };

  const etiquetaRol = (rol) => {
    const mapa = {
      SOCIO: { texto: "Socio", color: "#806fbe" },
      ADMINISTRADOR: { texto: "Admin", color: "#e07b54" },
      MODERADOR: { texto: "Mod", color: "#4a9b7f" },
    };
    return mapa[rol] || { texto: rol, color: "#888" };
  };

  // El panel demo solo se muestra si el servidor está OFFLINE (servidorOnline === false)
  // Mientras verifica (null), no mostramos nada para evitar un flash visual
  const mostrarPanelDemo = state.servidorOnline === false;

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
              value={state.usuarioOCorreo}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "usuarioOCorreo", value: e.target.value } })}
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
              type={state.mostrarContrasena ? "text" : "password"}
              value={state.contrasena}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "contrasena", value: e.target.value } })}
            />
            <button type="button"
              className="eye-icon"
              onClick={() => dispatch({ type: "TOGGLE_MOSTRAR_CONTRASENA" })}
            >
              {state.mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
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
              onClick={() => dispatch({ type: "TOGGLE_MOSTRAR_CUENTAS_DEMO" })}
            >
              <span className="demo-toggle-icon">{state.mostrarCuentasDemo ? "▲" : "▼"}</span>
              Cuentas demo disponibles
            </button>

            <div className={`demo-panel ${state.mostrarCuentasDemo ? "demo-panel--open" : ""}`}>
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
                      className={`demo-card ${state.copiado === u.nombreUsuario ? "demo-card--copiado" : ""}`}
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
                      {state.copiado === u.nombreUsuario && (
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
            className={`lf-submit-btn ${state.cargando ? "lf-submit-btn--loading" : ""}`}
            disabled={state.cargando}
          >
            {state.cargando ? "Ingresando…" : "Ingresar →"}
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
