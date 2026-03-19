import { useState } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import "./RecuperarContraForm.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function RecuperarContraForm() {
  const [email, setEmail] = useState("");
  const navegar = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Correo requerido",
        text: "Por favor ingresa tu correo electrónico.",
        confirmButtonColor: "#806fbe",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Ingresa un correo electrónico válido.",
        confirmButtonColor: "#d33",
      });
    }

    Swal.fire({
      icon: "success",
      title: "Código enviado",
      text: "Hemos enviado un código de recuperación a tu correo.",
      confirmButtonColor: "#806fbe",
    }).then(() => {
      navegar("/confirmacion-codigo", { state: { email } });
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="recuperar-form-container">

      {/* Header estilo Opción 2 */}
      <div className="recuperar-header">
        <span className="recuperar-subtitle">Acceso seguro</span>
        <h2 className="recuperar-title">Restablecer contraseña</h2>
        <span className="recuperar-line"></span>
      </div>

      {/* Descripción corta */}
      <p className="recuperar-desc">
        Te enviaremos un código a tu correo para restablecer tu contraseña.
      </p>

      <Form.Group className="mb-4">
        <Form.Label className="recuperar-label">
          Correo electrónico <RequiredMark />
        </Form.Label>
        <Form.Control
          className="recuperar-input"
          type="email"
          placeholder="tucorreo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <div className="recuperar-submit-wrap">
        <button className="recuperar-btn" type="submit">
          Enviar código
        </button>
      </div>

      <p className="recuperar-back">
        <Link to="/login">← Volver al inicio de sesión</Link>
      </p>

    </Form>
  );
}