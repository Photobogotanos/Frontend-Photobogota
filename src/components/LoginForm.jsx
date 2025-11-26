import { useState } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import logo from "../assets/images/logo.png";
import "./LoginForm.css";
import { Link } from "react-router-dom";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Debes completar todos los campos.",
        confirmButtonColor: "#3085d6",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
        confirmButtonColor: "#d33",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Inicio de sesión exitoso",
      text: "Bienvenido a Photo Bogotá",
      confirmButtonColor: "#28a745",
    });

    console.log("Email:", email);
    console.log("Password:", password);
  };

  const RequiredMark = () => (
    <OverlayTrigger
      placement="right"
      overlay={<Tooltip>Campo obligatorio</Tooltip>}
    >
      <span className="required-mark">*</span>
    </OverlayTrigger>
  );

  return (
    <Form onSubmit={handleSubmit} className="login-form-container">
      <div className="login-form-header">
        <img src={logo} alt="Logo" className="login-form-logo" />
        <h2 className="login-form-title">Ingresa a Photo Bogotá</h2>
      </div>

      <Form.Group className="mb-4">
        <Form.Label className="login-form-label">
          Nombre de Usuario <RequiredMark />
        </Form.Label>
        <Form.Control
          className="grupitos rounded-pill"
          type="email"
          placeholder="Ingresa el correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="login-form-label">
          Contraseña <RequiredMark />
        </Form.Label>
        <Form.Control
          className="grupitos rounded-pill"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
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
        ¿Eres nuevo en Photo Bogotá?
        <Link to="/creacion-cuenta"> Crear cuenta</Link>
      </p>
    </Form>
  );
}
