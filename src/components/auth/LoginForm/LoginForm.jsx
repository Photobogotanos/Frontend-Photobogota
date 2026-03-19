import { useState } from "react";
import { Form } from "react-bootstrap";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import BackButton from "@/components/common/BackButton";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import { USUARIOS_DEMO } from "@/mocks/usuario.mock";

const CUENTAS_ESPECIALES = ["SOCIO", "ADMINISTRADOR", "MODERADOR"];

export default function LoginForm() {
  const [usuarioOCorreo, setUsuarioOCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarCuentasDemo, setMostrarCuentasDemo] = useState(false);
  const [copiado, setCopiado] = useState(null);
  const [cargando, setCargando] = useState(false);

  const navegar = useNavigate();

  const cuentasEspeciales = USUARIOS_DEMO.filter((u) =>
    CUENTAS_ESPECIALES.includes(u.rol)
  );

  const copiarCredenciales = (usuario, contrasena) => {
    setUsuarioOCorreo(usuario);
    setContrasena(contrasena);
    setCopiado(usuario);
    setTimeout(() => setCopiado(null), 2000);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    if (!usuarioOCorreo.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Debes ingresar tu usuario o correo.",
      });
    }

    if (!contrasena.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Debes ingresar la contraseña.",
      });
    }

    const esCorreoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuarioOCorreo);

    if (!esCorreoValido && usuarioOCorreo.length < 3) {
      return Swal.fire({
        icon: "error",
        title: "Usuario inválido",
        text: "Debe ser un correo válido o un nombre de usuario con mínimo 3 caracteres.",
      });
    }

    // Buscar en USUARIOS_DEMO 
    const usuarioEncontrado = USUARIOS_DEMO.find(
      (u) =>
        (u.nombreUsuario === usuarioOCorreo || u.correo === usuarioOCorreo) &&
        u.contrasena === contrasena
    );

    if (!usuarioEncontrado) {
      // Verificar si el usuario existe pero con contraseña incorrecta
      const existeUsuario = USUARIOS_DEMO.find(
        (u) =>
          u.nombreUsuario === usuarioOCorreo || u.correo === usuarioOCorreo
      );

      if (existeUsuario) {
        return Swal.fire({
          icon: "error",
          title: "Contraseña incorrecta",
          text: "La contraseña ingresada no es correcta.",
        });
      }

      return Swal.fire({
        icon: "info",
        title: "Cuenta no encontrada",
        html: `No encontramos una cuenta con ese usuario o correo en modo demo.<br><br>
               <b>¿Eres nuevo?</b> Regístrate para crear una cuenta de tipo <b>Miembro</b>,
               o usa una de las cuentas demo disponibles.`,
        confirmButtonText: "Crear cuenta",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) navegar("/creacion-cuenta");
      });
    }

    const usuarioFinal = {
      nombre: usuarioEncontrado.nombre,
      username: "@" + usuarioEncontrado.nombreUsuario,
      email: usuarioEncontrado.correo,
      rol: usuarioEncontrado.rol.toLowerCase(),
    };

    localStorage.setItem("logueado", "true");
    localStorage.setItem("miembro", JSON.stringify(usuarioFinal));

    navegar("/mapa");
  };

  const etiquetaRol = (rol) => {
    const mapa = {
      SOCIO: { texto: "Socio", color: "#806fbe" },
      ADMINISTRADOR: { texto: "Admin", color: "#e07b54" },
      MODERADOR: { texto: "Mod", color: "#4a9b7f" },
    };
    return mapa[rol] || { texto: rol, color: "#888" };
  };

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

        {/* Panel de cuentas demo */}
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
                    onClick={() => copiarCredenciales(u.nombreUsuario, u.contrasena)}
                    style={{ "--rol-color": etiqueta.color }}
                  >
                    <span
                      className="demo-card-badge"
                      style={{ backgroundColor: etiqueta.color }}
                    >
                      {etiqueta.texto}
                    </span>
                    <span className="demo-card-user">@{u.nombreUsuario}</span>
                    <span className="demo-card-pass">{u.contrasena}</span>
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