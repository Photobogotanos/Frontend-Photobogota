import { useState } from "react";
import { Form } from "react-bootstrap";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import BackButton from "@/components/common/BackButton";

export default function LoginForm() {
  const [usuarioOCorreo, setUsuarioOCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const navegar = useNavigate();

  const USUARIOS_HARDCODEADOS = [
    {
      usuario: "socio",
      contrasena: "socio123",
      rol: "socio",
      nombre: "Socio Demo",
    },
    {
      usuario: "perro",
      contrasena: "encerrado",
      rol: "administrador",
      nombre: "Administrador Demo",
    },
    {
      usuario: "moderador",
      contrasena: "mod123",
      rol: "moderador",
      nombre: "Moderador Demo",
    },
  ];

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

    const usuarioEncontrado = USUARIOS_HARDCODEADOS.find(
      (u) => u.usuario === usuarioOCorreo && u.contrasena === contrasena
    );

    let usuarioFinal;

    if (usuarioEncontrado) {
      usuarioFinal = {
        nombre: usuarioEncontrado.nombre,
        username: "@" + usuarioEncontrado.usuario,
        email: `${usuarioEncontrado.usuario}@photobogota.com`,
        rol: usuarioEncontrado.rol,
      };
    } else {
      usuarioFinal = {
        nombre: "Usuario Demo",
        username: "@" + usuarioOCorreo.split("@")[0],
        email: usuarioOCorreo,
        rol: "miembro",
      };
    }

    localStorage.setItem("logueado", "true");
    localStorage.setItem("miembro", JSON.stringify(usuarioFinal));

    navegar("/mapa");
  };

  return (
    <>
      <Form onSubmit={manejarEnvio} className="login-form-container">
        <div className="login-form-header">
          <h2 className="login-form-title">Ingresa a Photo Bogotá</h2>
        </div>

        <Form.Group className="mt-5">
          <Form.Label className="login-form-label">
            Usuario o Correo <FaUser />
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Campo obligatorio</Tooltip>}
            >
              <span> *</span>
            </OverlayTrigger>
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
            Contraseña <FaLock />
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Campo obligatorio</Tooltip>}
            >
              <span> *</span>
            </OverlayTrigger>
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
        </Form.Group>

        <div className="solicitud-form-submit mt-5">
          <button className="login-submit-btn rounded-pill" type="submit">
            <b>Ingresar</b>
          </button>
        </div>

        <p className="recuperar-contra">
          <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
        </p>

        <p className="registro-texto">
          ¿Eres nuevo en Photo Bogotá?{" "}
          <Link to="/creacion-cuenta">
            <b>Crear cuenta</b>
          </Link>
        </p>
      </Form>
      <div className="justify-content-center d-flex mb-4">
        <BackButton />
      </div>
    </>
  );
}
