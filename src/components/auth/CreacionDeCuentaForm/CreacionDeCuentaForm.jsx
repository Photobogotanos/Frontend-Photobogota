import { useState } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";

import "./CreacionDeCuentaForm.css";
import { registrarUsuario } from "@/services/usuario.service";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import BackButton from "../../common/BackButton";


import AccountHeader from "./AccountHeader";
import PersonalInfoFields from "./PersonalInfoFields";
import PasswordFields from "./PasswordFields";

function FormularioCreacion() {
  const navegar = useNavigate();

  // ── Estado ──────────────────────────────────────────────────────────────────
  const [email, setEmail]               = useState("");
  const [nombres, setNombres]           = useState("");
  const [apellidos, setApellidos]       = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fecha, setFecha]               = useState("");
  const [password, setPassword]         = useState("");
  const [password2, setPassword2]       = useState("");

  const [mostrarContrasena, setMostrarContrasena]   = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);
  const [passwordMatch, setPasswordMatch]           = useState(null);
  const [validationRules, setValidationRules]       = useState({
    length: false, upper: false, lower: false, number: false,
  });
  const [cargando, setCargando] = useState(false);

  // ── Validación en tiempo real de contraseñas ─────────────────────────────
  const handlePasswordChange = (valor, esConfirmacion) => {
    if (!esConfirmacion) {
      setPassword(valor);
    } else {
      setPassword2(valor);
    }

    const pass    = esConfirmacion ? password : valor;
    const confirm = esConfirmacion ? valor    : password2;

    setPasswordMatch(pass && confirm ? pass === confirm : null);

    // Las reglas siempre se calculan sobre el campo de contraseña principal
    const valorPrincipal = esConfirmacion ? password : valor;
    setValidationRules({
      length: valorPrincipal.length >= 8,
      upper:  /[A-Z]/.test(valorPrincipal),
      lower:  /[a-z]/.test(valorPrincipal),
      number: /\d/.test(valorPrincipal),
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !nombres || !apellidos || !nombreUsuario || !fecha || !password || !password2) {
      Swal.fire({ icon: "error", title: "Campos incompletos", text: "Por favor completa todos los campos obligatorios." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({ icon: "error", title: "Correo inválido", text: "Por favor ingresa un correo electrónico válido." });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      Swal.fire({ icon: "error", title: "Contraseña insegura", text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números." });
      return;
    }

    if (password !== password2) {
      Swal.fire({ icon: "error", title: "Las contraseñas no coinciden", text: "Verifica que ambas contraseñas sean iguales." });
      return;
    }

    try {
      setCargando(true);
      const resultado = await registrarUsuario({
        email, nombres, apellidos, nombreUsuario,
        fechaNacimiento: fecha, contrasena: password,
      });

      if (resultado.exitoso) {
        Swal.fire({
          icon: "success",
          title: resultado.esDemo ? "Registro exitoso (Demo)" : "Registro exitoso",
          text:  resultado.esDemo ? resultado.mensaje : "Tu cuenta ha sido creada correctamente.",
        }).then(() => navegar("/login"));
      } else {
        Swal.fire({ icon: "error", title: "Error en el registro", text: resultado.mensaje || "No se pudo crear la cuenta. Por favor intenta de nuevo." });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado. Por favor intenta de nuevo." });
    } finally {
      setCargando(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <Form onSubmit={handleSubmit} className="mt-5">

        <AccountHeader />

        <PersonalInfoFields
          email={email}           setEmail={setEmail}
          nombres={nombres}       setNombres={setNombres}
          apellidos={apellidos}   setApellidos={setApellidos}
          nombreUsuario={nombreUsuario} setNombreUsuario={setNombreUsuario}
          fecha={fecha}           setFecha={setFecha}
        />

        <PasswordFields
          password={password}
          password2={password2}
          mostrarContrasena={mostrarContrasena}   setMostrarContrasena={setMostrarContrasena}
          mostrarContrasena2={mostrarContrasena2} setMostrarContrasena2={setMostrarContrasena2}
          passwordMatch={passwordMatch}
          validationRules={validationRules}
          onChangePassword={handlePasswordChange}
        />

        {/* Botón de envío */}
        <div className="creacion-form-submit mt-4">
          <button className="creacion-formulario-button rounded-pill" type="submit" disabled={cargando}>
            Guardar <IoIosSend />
          </button>
        </div>

        {/* Overlay de carga */}
        {cargando && (
          <div className="loading-overlay">
            <SpinnerLoader texto="Registrando..." />
          </div>
        )}

      </Form>

      <div className="justify-content-center d-flex mb-4 mt-3">
        <BackButton />
      </div>
    </div>
  );
}

export default FormularioCreacion;