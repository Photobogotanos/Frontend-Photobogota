import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Form from 'react-bootstrap/Form';
import './CreacionDeCuentaForm.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

// Iconos
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { IoIosSend } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function FormularioCreacion() {

  const navegar = useNavigate();

  // Estados
  const [email, setEmail] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [fecha, setFecha] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);


  const validarFormulario = (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !nombres || !apellidos || !fecha || !password || !password2) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios."
      });
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido."
      });
      return;
    }

    // Validación de contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña insegura",
        text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números."
      });
      return;
    }

    // Confirmar contraseñas iguales
    if (password !== password2) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Verifica que ambas contraseñas sean iguales."
      });
      return;
    }

    // Si pasa todas las validaciones
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "Tu cuenta ha sido creada correctamente."
    }).then(() => {
      navegar("/login");
    });
  };

  return (
    <Form onSubmit={validarFormulario}>
      <h3 className="text-center mt-5 register-form-cuenta">Registro en Photo Bogota</h3>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          Email <MdOutlineEmail />
          <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          type="email"
          className="rounded-pill"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          Nombres <MdDriveFileRenameOutline />
          <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          className="rounded-pill"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          Apellidos <MdDriveFileRenameOutline />
          <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          className="rounded-pill"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          Fecha de nacimiento <MdDateRange />
          <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Flatpickr
          options={{
            dateFormat: "Y-m-d",
            maxDate: "today",
            locale: Spanish,
            allowInput: true,
          }}
          value={fecha}
          onChange={(selectedDates) =>
            setFecha(selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : "")
          }
          className="rounded-pill form-control"
        />
      </Form.Group>

      <Form.Group className="mb-3">
  <Form.Label className="creacion-formulario-label">
    Contraseña <FaLock />
    <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
      <span> *</span>
    </OverlayTrigger>
  </Form.Label>

  <div className="input-icon-container">
    <Form.Control
      className="grupitos rounded-pill input-with-icon"
      type={mostrarContrasena ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <span
      className="eye-icon"
      onClick={() => setMostrarContrasena(!mostrarContrasena)}
    >
      {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>


<Form.Group className="mb-3">
  <Form.Label className="creacion-formulario-label">
    Confirmación de la contraseña <FaLock />
    <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
      <span> *</span>
    </OverlayTrigger>
  </Form.Label>

  <div className="input-icon-container">
    <Form.Control
      className="grupitos rounded-pill input-with-icon"
      type={mostrarContrasena2 ? "text" : "password"}
      value={password2}
      onChange={(e) => setPassword2(e.target.value)}
    />
    <span
      className="eye-icon"
      onClick={() => setMostrarContrasena2(!mostrarContrasena2)}
    >
      {mostrarContrasena2 ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</Form.Group>

      <div className="creacion-form-submit mt-5">
        <button className="creacion-formulario-button rounded-pill text-center" type="submit">
          Guardar <IoIosSend />
        </button>
      </div>

    </Form>
  );
}

export default FormularioCreacion;
