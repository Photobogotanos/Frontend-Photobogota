import { useState } from "react";
import { Form } from "react-bootstrap";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";

export default function LoginForm() {
  const [usuarioOCorreo, setUsuarioOCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const navegar = useNavigate();

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

    localStorage.setItem("logueado", "true");
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        nombre: "Usuario Demo",
        username: "@" + usuarioOCorreo.split("@")[0],
        email: usuarioOCorreo,
      })
    );

    navegar("/comunidad");
  };

  return (
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
  );
}
