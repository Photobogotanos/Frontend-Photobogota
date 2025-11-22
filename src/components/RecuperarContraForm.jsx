import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import "./RecuperarContraForm.css";

export default function RecuperarContraForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setError("El correo es obligatorio");
      return;
    }

    setError("");
    console.log("Correo para recuperación:", email);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="login-form-header">
        <img src={logo} alt="Logo" className="login-form-logo" />
        <h2 className="login-form-title">Restablecer contraseña</h2>
      </div>
      <br />

      <Form.Group className="mb-4">
        <Form.Label className="login-form-label mb-2">
          Ingresa tu correo *
        </Form.Label>

        <Form.Control
          className="grupitos rounded-pill"
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <div className="solicitud-form-submit mt-4">
        <button className="rounded-pill" type="submit">Enviar Código</button>
      </div>

      <p className="recuperar-contra">
        <a href="/login">Volver al inicio de sesión</a>
      </p>
    </Form>
  );
}
