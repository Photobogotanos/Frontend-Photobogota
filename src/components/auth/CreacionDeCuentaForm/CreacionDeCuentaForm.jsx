import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./CreacionDeCuentaForm.css";
import { registrarUsuario } from "@/services/usuario.service";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";

// Iconos
import {
  MdDriveFileRenameOutline,
  MdOutlineEmail,
  MdDateRange,
} from "react-icons/md";
import { FaLock, FaEye, FaEyeSlash, FaCheck, FaTimes, FaUser } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import BackButton from "../../common/BackButton";

function FormularioCreacion() {
  const navegar = useNavigate();

  // ESTADOS
  const [email, setEmail] = useState("");
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fecha, setFecha] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarContrasena2, setMostrarContrasena2] = useState(false);

  const [passwordMatch, setPasswordMatch] = useState(null);
  const [validationRules, setValidationRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
  });
  const [cargando, setCargando] = useState(false);

  // FUNCIONES
  const validarPasswordEnTiempoReal = (value, isConfirm = false) => {
    // Actualizar el estado correspondiente
    if (!isConfirm) {
      setPassword(value);
    } else {
      setPassword2(value);
    }

    // Determinar cuál es la contraseña y cuál la confirmación
    const pass = isConfirm ? password : value;
    const confirm = isConfirm ? value : password2;

    // Verificar si las contraseñas coinciden
    setPasswordMatch(pass && confirm ? pass === confirm : null);

    // Reglas de validación de contraseña
    const rules = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
    };

    setValidationRules(rules);

    // Calcular fortaleza de contraseña
  };

  const validarFormulario = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!email || !nombres || !apellidos || !nombreUsuario || !fecha || !password || !password2) {
      Swal.fire({
        icon: "error",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios.",
      });
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor ingresa un correo electrónico válido.",
      });
      return;
    }

    // Validación de contraseña segura
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña insegura",
        text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números.",
      });
      return;
    }

    // Confirmar que las contraseñas coinciden
    if (password !== password2) {
      Swal.fire({
        icon: "error",
        title: "Las contraseñas no coinciden",
        text: "Verifica que ambas contraseñas sean iguales.",
      });
      return;
    }

    try {
      setCargando(true);
      // Usar el servicio de autenticación
      const resultado = await registrarUsuario({
        email,
        nombres,
        apellidos,
        nombreUsuario,
        fechaNacimiento: fecha,
        contrasena: password,
      });

      if (resultado.exitoso) {
        // Mostrar mensaje según el modo
        if (resultado.esDemo) {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso (Demo)",
            text: resultado.mensaje,
          }).then(() => {
            navegar("/login");
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Registro exitoso",
            text: "Tu cuenta ha sido creada correctamente.",
          }).then(() => {
            navegar("/login");
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: resultado.mensaje || "No se pudo crear la cuenta. Por favor intenta de nuevo.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Ocurrió un error inesperado. Por favor intenta de nuevo.",
      });
    } finally {
      setCargando(false);
    }
  };

  // RENDER
  return (
    <div>
      <Form onSubmit={validarFormulario} className="mt-5">
        <div className="creacion-cuenta-header">
          <span className="creacion-cuenta-subtitle">Crea tu cuenta</span>
          <h2 className="creacion-cuenta-title">Photo Bogotá</h2>
          <span className="creacion-cuenta-line"></span>
        </div>

        <div className="mt-4">
          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <MdOutlineEmail />
              Email
              <RequiredMark />
            </Form.Label>
            <Form.Control
              type="email"
              className="rounded-pill input-without-focus"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          {/* Nombres */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <MdDriveFileRenameOutline />
              Nombres
              <RequiredMark />
            </Form.Label>
            <Form.Control
              className="rounded-pill input-without-focus"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
            />
          </Form.Group>

          {/* Apellidos */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <MdDriveFileRenameOutline />
              Apellidos
              <RequiredMark />
            </Form.Label>
            <Form.Control
              className="rounded-pill input-without-focus"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
            />
          </Form.Group>

          {/* Nombre de usuario */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <FaUser />
              Nombre de usuario
              <RequiredMark />
            </Form.Label>
            <Form.Control
              className="rounded-pill input-without-focus"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </Form.Group>

          {/* Fecha de nacimiento */}
          <Form.Group className="mb-4">
            <Form.Label className="creacion-formulario-label">
              <MdDateRange />
              Fecha de nacimiento
              <RequiredMark />
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
                setFecha(
                  selectedDates[0]
                    ? selectedDates[0].toISOString().split("T")[0]
                    : ""
                )
              }
              className="rounded-pill form-control input-without-focus"
            />
          </Form.Group>
        </div>

        <div>
          {/* Contraseña */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <FaLock />
              Contraseña
              <RequiredMark />
            </Form.Label>

            <div className="input-icon-container">
              <Form.Control
                className="rounded-pill input-with-icon input-without-focus"
                type={mostrarContrasena ? "text" : "password"}
                value={password}
                onChange={(e) =>
                  validarPasswordEnTiempoReal(e.target.value, false)
                }
              />
              <button type="button"
                className="eye-icon"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </Form.Group>

          {/* Confirmación contraseña */}
          <Form.Group className="mb-3">
            <Form.Label className="creacion-formulario-label">
              <FaLock />
              Confirmación de la contraseña
              <RequiredMark />
            </Form.Label>

            <div className="input-icon-container">
              <Form.Control
                className="rounded-pill input-with-icon input-without-focus"
                type={mostrarContrasena2 ? "text" : "password"}
                value={password2}
                onChange={(e) =>
                  validarPasswordEnTiempoReal(e.target.value, true)
                }
              />
              <button type="button"
                className="eye-icon"
                onClick={() => setMostrarContrasena2(!mostrarContrasena2)}
              >
                {mostrarContrasena2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Indicador de coincidencia */}
            {password2 !== "" && (
              <span
                className={`password-match mt-2 ${passwordMatch ? "ok" : "bad"
                  }`}
              >
                {passwordMatch ? (
                  <>
                    <FaCheck /> Las contraseñas coinciden
                  </>
                ) : (
                  <>
                    <FaTimes /> Las contraseñas no coinciden
                  </>
                )}
              </span>
            )}

            {/* Reglas de validación */}
            <ul className="password-rules mt-2">
              <li className={validationRules.length ? "valid" : "invalid"}>
                {validationRules.length ? <FaCheck /> : <FaTimes />} Mínimo 8
                caracteres
              </li>
              <li className={validationRules.upper ? "valid" : "invalid"}>
                {validationRules.upper ? <FaCheck /> : <FaTimes />} Una
                mayúscula
              </li>
              <li className={validationRules.lower ? "valid" : "invalid"}>
                {validationRules.lower ? <FaCheck /> : <FaTimes />} Una
                minúscula
              </li>
              <li className={validationRules.number ? "valid" : "invalid"}>
                {validationRules.number ? <FaCheck /> : <FaTimes />} Un número
              </li>
            </ul>
          </Form.Group>
        </div>

        {/* BOTÓN */}
        <div className="creacion-form-submit mt-4">
          <button
            className="creacion-formulario-button rounded-pill"
            type="submit"
            disabled={cargando}
          >
            Guardar <IoIosSend />
          </button>
        </div>

        {/* OVERLAY DE CARGA */}
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