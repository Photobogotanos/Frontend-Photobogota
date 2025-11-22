import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import "./LoginForm.css";
import { Link } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      return;
    }

    setError("");

    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="login-form-header">
        <img src={logo} alt="Logo" className="login-form-logo" />
        <h2 className="login-form-title">Ingresa a Photo Bogotá</h2>
      </div>
      <br />

      <Form.Group className="mb-4">
        <Form.Label className="login-form-label mb-2">
          Nombre de Usuario *
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
        <Form.Label className="login-form-label mb-2">Contraseña *</Form.Label>
        <Form.Control
          className="grupitos rounded-pill"
          type="contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <div className="solicitud-form-submit mt-5">
        <button className="rounded-pill" type="submit">
          Ingresar
        </button>
      </div>

      <p className="recuperar-contra">
        <Link to="/recuperar-contrasena">¿Olvidaste tu contraseña?</Link>
      </p>

      <p className="registro-texto">
        ¿Eres nuevo en Photo Bogotá?
        <Link to="/creacion-cuenta"> Crea tu cuenta</Link>
      </p>
    </Form>
  );
}
