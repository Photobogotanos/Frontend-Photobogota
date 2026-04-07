import { useReducer, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import { iniciarSesion as iniciarSesionService } from "@/services/usuario.service";
import { USUARIOS_DEMO } from "@/mocks/usuario.mock";
import { useAuth } from "@/context/AuthContext";
import { validarLogin } from "@/utils/validacionesLogin";
import { checkBackendHealth } from "@/api/baseApi";

const CREDENCIALES_DEMO = {
  socio: "socio123",
  perro: "encerrado",
  moderador: "mod123",
  miembro: "miembro123",
};

const CUENTAS_ESPECIALES = ["SOCIO", "MOD", "ADMIN", "MIEMBRO"];
const MAX_INTENTOS = 5;
const TIEMPO_BLOQUEO = 5 * 60 * 1000; // 5 minutos

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
    case "INCREMENTAR_INTENTOS":
      return { ...state, intentos: state.intentos + 1 };
    case "RESET_INTENTOS":
      return { ...state, intentos: 0, bloqueadoHasta: null };
    case "SET_BLOQUEADO":
      return { ...state, bloqueadoHasta: action.payload };
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
  intentos: 0,
  bloqueadoHasta: null,
};

export default function LoginForm() {
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [verificandoServidor, setVerificandoServidor] = useState(true);
  const navegar = useNavigate();
  const { iniciarSesion: iniciarSesionContext } = useAuth();

  // Verificar servidor al montar el componente
  useEffect(() => {
    const verificar = async () => {
      try {
        const online = await checkBackendHealth();
        dispatch({ type: "SET_SERVIDOR_ONLINE", payload: online });

        if (!online) {
          console.log("Servidor no disponible - Modo Demo activado");
          toast.custom((t) => (
            <div className="server-offline-toast">
              Servidor no disponible. Usando modo demo.
            </div>
          ), { duration: 4000 });
        }
      } catch (error) {
        dispatch({ type: "SET_SERVIDOR_ONLINE", payload: false });
        console.log("Error al verificar servidor:", error.message);
      } finally {
        setVerificandoServidor(false);
      }
    };

    verificar();
  }, []);

  // Verificar si está bloqueado
  const estaBloqueado = () => {
    if (state.bloqueadoHasta && new Date() < new Date(state.bloqueadoHasta)) {
      const tiempoRestante = Math.ceil((new Date(state.bloqueadoHasta) - new Date()) / 1000 / 60);
      toast.error(`Demasiados intentos. Espera ${tiempoRestante} minutos.`);
      return true;
    }
    return false;
  };

  // Ordenar por rol: MIEMBRO, SOCIO, MOD, ADMIN
  const ordenRol = { MIEMBRO: 1, SOCIO: 2, MOD: 3, ADMIN: 4 };
  const cuentasEspeciales = USUARIOS_DEMO
    .filter((u) => CUENTAS_ESPECIALES.includes(u.rol))
    .sort((a, b) => ordenRol[a.rol] - ordenRol[b.rol]);

  const copiarCredenciales = (nombreUsuario) => {
    const pass = CREDENCIALES_DEMO[nombreUsuario] ?? "";
    dispatch({ type: "SET_FIELD", payload: { field: "usuarioOCorreo", value: nombreUsuario } });
    dispatch({ type: "SET_FIELD", payload: { field: "contrasena", value: pass } });
    dispatch({ type: "SET_COPIADO", payload: nombreUsuario });
    setTimeout(() => dispatch({ type: "CLEAR_COPIADO" }), 2000);
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();

    // Verificar bloqueo
    if (estaBloqueado()) return;

    // Validar campos usando el módulo de validaciones
    const validacion = validarLogin(state.usuarioOCorreo, state.contrasena);
    if (!validacion.valido) {
      toast.error(validacion.mensaje);
      return;
    }

    dispatch({ type: "SET_CARGANDO", payload: true });

    try {
      const resultado = await iniciarSesionService(state.usuarioOCorreo.trim(), state.contrasena);

      if (!resultado.exitoso) {
        // Incrementar intentos fallidos
        const nuevosIntentos = state.intentos + 1;
        dispatch({ type: "INCREMENTAR_INTENTOS" });

        if (nuevosIntentos >= MAX_INTENTOS) {
          const bloqueoHasta = new Date(Date.now() + TIEMPO_BLOQUEO);
          dispatch({ type: "SET_BLOQUEADO", payload: bloqueoHasta });
          toast.error(`Demasiados intentos fallidos. Cuenta bloqueada por 5 minutos.`);
        } else {
          toast.error(`${resultado.mensaje} (Intento ${nuevosIntentos}/${MAX_INTENTOS})`);
        }
        return;
      }

      // Resetear intentos al iniciar sesión exitosamente
      dispatch({ type: "RESET_INTENTOS" });

      const esModoDemo = resultado.esDemo || !state.servidorOnline;
      if (esModoDemo) {
        localStorage.setItem('modoDemo', 'true');
        sessionStorage.setItem('modoDemo', 'true');
      } else {
        localStorage.removeItem('modoDemo');
        sessionStorage.removeItem('modoDemo');
      }

      // Actualizar contexto de autenticación
      iniciarSesionContext(resultado.datos);

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

      // Manejo específico de errores de red
      if (error.message === "Failed to fetch" || error.name === "TypeError") {
        toast.error("No se pudo conectar al servidor. Verifica tu conexión.", {
          duration: 5000,
        });
        dispatch({ type: "SET_SERVIDOR_ONLINE", payload: false });
      } else {
        toast.error("Error inesperado. Intenta de nuevo más tarde.");
      }
    } finally {
      dispatch({ type: "SET_CARGANDO", payload: false });
    }
  };

  const etiquetaRol = (rol) => {
    const mapa = {
      SOCIO: { texto: "Socio", color: "#806fbe" },
      ADMIN: { texto: "Admin", color: "#e07b54" },
      MOD: { texto: "Mod", color: "#4a9b7f" },
      MIEMBRO: { texto: "Miembro", color: "#888" },
    };
    return mapa[rol] || { texto: rol, color: "#888" };
  };

  // Mostrar panel demo si el servidor NO está online (false O null)
  const mostrarPanelDemo = !verificandoServidor && state.servidorOnline !== true;

  // Calcular tiempo de bloqueo restante
  const tiempoBloqueoRestante = state.bloqueadoHasta
    ? Math.ceil((new Date(state.bloqueadoHasta) - new Date()) / 1000 / 60)
    : 0;

  return (
    <>
      <Form onSubmit={manejarEnvio} className="login-form-container">
        <div className="login-form-header">
          <span className="login-subtitle">Accede a tu cuenta</span>
          <h2 className="login-form-title">Photo Bogotá</h2>
          <span className="login-title-line"></span>
        </div>

        {/* Indicador de bloqueo */}
        {state.bloqueadoHasta && new Date() < new Date(state.bloqueadoHasta) && (
          <div className="alert alert-warning mt-3 text-center" role="alert">
            Cuenta temporalmente bloqueada. Espera {tiempoBloqueoRestante} minutos.
          </div>
        )}

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
              disabled={state.cargando || (state.bloqueadoHasta && new Date() < new Date(state.bloqueadoHasta))}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "usuarioOCorreo", value: e.target.value } })}
              placeholder="ejemplo@correo.com o usuario123"
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
              disabled={state.cargando || (state.bloqueadoHasta && new Date() < new Date(state.bloqueadoHasta))}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "contrasena", value: e.target.value } })}
              placeholder="Ingresa tu contraseña"
            />
            <button
              type="button"
              className="eye-icon"
              onClick={() => dispatch({ type: "TOGGLE_MOSTRAR_CONTRASENA" })}
              disabled={state.cargando}
            >
              {state.mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="lf-forgot mt-1">
            <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
          </div>
        </Form.Group>

        {/* Indicador de verificación del servidor */}
        {verificandoServidor && (
          <div className="server-checking-wrapper mt-4">
            <div className="server-checking-indicator">
              <span className="server-checking-dot"></span>
              Conectando con el servidor...
            </div>
          </div>
        )}

        {/* Estado del servidor */}
        {!verificandoServidor && state.servidorOnline === false && (
          <div className="server-offline-badge mt-3">
            <span className="badge bg-warning text-dark">
              Modo Demo - Conexión limitada
            </span>
          </div>
        )}

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
            </div>
          </div>
        )}

        <div className="solicitud-form-submit mt-4">
          <button
            type="submit"
            className={`lf-submit-btn ${state.cargando ? "lf-submit-btn--loading" : ""}`}
            disabled={state.cargando || (state.bloqueadoHasta && new Date() < new Date(state.bloqueadoHasta))}
          >
            {state.cargando ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Ingresando…
              </>
            ) : (
              "Ingresar →"
            )}
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