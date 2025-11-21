    import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";

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

      <Form.Group className="mb-3">
        <Form.Label>Nombre de Usuario *</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa el correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Contraseña *</Form.Label>
        <Form.Control
          type="contraseña"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Button type="submit" variant="primary" className="w-100">
        Ingresar
      </Button>
    </Form>
  );

}