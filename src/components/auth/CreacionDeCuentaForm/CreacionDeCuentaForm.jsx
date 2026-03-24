import { useReducer } from "react";
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

// Reducer function
function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.payload.value,
        passwordMatch: action.payload.passwordMatch,
        validationRules: action.payload.validationRules,
      };
    case "SET_PASSWORD2":
      return {
        ...state,
        password2: action.payload.value,
        passwordMatch: action.payload.passwordMatch,
      };
    case "TOGGLE_MOSTRAR_CONTRASENA":
      return { ...state, mostrarContrasena: !state.mostrarContrasena };
    case "TOGGLE_MOSTRAR_CONTRASENA2":
      return { ...state, mostrarContrasena2: !state.mostrarContrasena2 };
    case "SET_CARGANDO":
      return { ...state, cargando: action.payload };
    case "RESET_FORM":
      return {
        ...state,
        email: "",
        nombres: "",
        apellidos: "",
        nombreUsuario: "",
        fecha: "",
        password: "",
        password2: "",
        passwordMatch: null,
        validationRules: {
          length: false,
          upper: false,
          lower: false,
          number: false,
        },
      };
    default:
      return state;
  }
}

function FormularioCreacion() {
  const navegar = useNavigate();

  // Estado inicial del reducer
  const initialState = {
    email: "",
    nombres: "",
    apellidos: "",
    nombreUsuario: "",
    fecha: "",
    password: "",
    password2: "",
    mostrarContrasena: false,
    mostrarContrasena2: false,
    passwordMatch: null,
    validationRules: {
      length: false,
      upper: false,
      lower: false,
      number: false,
    },
    cargando: false,
  };

  // Reducer
  const [state, dispatch] = useReducer(formReducer, initialState);

  // FUNCIONES
  const validarPasswordEnTiempoReal = (value, isConfirm = false) => {
    const { password, password2 } = state;
    
    // Determinar cuál es la contraseña y cuál la confirmación
    const pass = isConfirm ? password : value;
    const confirm = isConfirm ? value : password2;

    // Verificar si las contraseñas coinciden
    const passwordMatch = pass && confirm ? pass === confirm : null;

    // Reglas de validación de contraseña
    const rules = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
    };

    dispatch({
      type: isConfirm ? "SET_PASSWORD2" : "SET_PASSWORD",
      payload: { value, passwordMatch, validationRules: rules },
    });
  };

  const validarFormulario = async (e) => {
    e.preventDefault();

    const { email, nombres, apellidos, nombreUsuario, fecha, password, password2 } = state;

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
      dispatch({ type: "SET_CARGANDO", payload: true });
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
      dispatch({ type: "SET_CARGANDO", payload: false });
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
              value={state.email}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "email", value: e.target.value } })}
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
              value={state.nombres}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "nombres", value: e.target.value } })}
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
              value={state.apellidos}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "apellidos", value: e.target.value } })}
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
              value={state.nombreUsuario}
              onChange={(e) => dispatch({ type: "SET_FIELD", payload: { field: "nombreUsuario", value: e.target.value } })}
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
              value={state.fecha}
              onChange={(selectedDates) =>
                dispatch({ 
                  type: "SET_FIELD", 
                  payload: { 
                    field: "fecha", 
                    value: selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : "" 
                  } 
                })
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
                type={state.mostrarContrasena ? "text" : "password"}
                value={state.password}
                onChange={(e) =>
                  validarPasswordEnTiempoReal(e.target.value, false)
                }
              />
              <button type="button"
                className="eye-icon"
                onClick={() => dispatch({ type: "TOGGLE_MOSTRAR_CONTRASENA" })}
              >
                {state.mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
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
                type={state.mostrarContrasena2 ? "text" : "password"}
                value={state.password2}
                onChange={(e) =>
                  validarPasswordEnTiempoReal(e.target.value, true)
                }
              />
              <button type="button"
                className="eye-icon"
                onClick={() => dispatch({ type: "TOGGLE_MOSTRAR_CONTRASENA2" })}
              >
                {state.mostrarContrasena2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Indicador de coincidencia */}
            {state.password2 !== "" && (
              <span
                className={`password-match mt-2 ${state.passwordMatch ? "ok" : "bad"}`}
              >
                {state.passwordMatch ? (
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
              <li className={state.validationRules.length ? "valid" : "invalid"}>
                {state.validationRules.length ? <FaCheck /> : <FaTimes />} Mínimo 8
                caracteres
              </li>
              <li className={state.validationRules.upper ? "valid" : "invalid"}>
                {state.validationRules.upper ? <FaCheck /> : <FaTimes />} Una
                mayúscula
              </li>
              <li className={state.validationRules.lower ? "valid" : "invalid"}>
                {state.validationRules.lower ? <FaCheck /> : <FaTimes />} Una
                minúscula
              </li>
              <li className={state.validationRules.number ? "valid" : "invalid"}>
                {state.validationRules.number ? <FaCheck /> : <FaTimes />} Un número
              </li>
            </ul>
          </Form.Group>
        </div>

        {/* BOTÓN */}
        <div className="creacion-form-submit mt-4">
          <button
            className="creacion-formulario-button rounded-pill"
            type="submit"
            disabled={state.cargando}
          >
            Guardar <IoIosSend />
          </button>
        </div>

        {/* OVERLAY DE CARGA */}
        {state.cargando && (
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
