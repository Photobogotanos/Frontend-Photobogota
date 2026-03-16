import { useState } from "react";
import { Form } from "react-bootstrap";
import Swal from "sweetalert2";
import logo from "@/assets/images/logo.jpg";
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
        confirmButtonColor: "#3085d6",
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
      confirmButtonColor: "#28a745",
    }).then(() => {
      navegar("/confirmacion-codigo");
    });

    console.log("Correo para recuperación:", email);
  };

  return (
    <Form onSubmit={handleSubmit} className="recuperar-form-container">
      <div className="login-form-header">
        <img src={logo} alt="Logo" className="login-form-logo" />
        <h2 className="login-form-title">Restablecer contraseña</h2>
      </div>

      <Form.Group className="mb-4">
        <Form.Label className="login-form-label">
          Ingresa tu correo <RequiredMark />
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
        <button
          className="recuperar-contra-submit-btn rounded-pill"
          type="submit"
        >
          <b>Enviar Código</b>
        </button>
      </div>

      <p className="recuperar-contra">
        <Link to="/login">Volver al inicio de sesión</Link>
      </p>
    </Form>
  );
}
