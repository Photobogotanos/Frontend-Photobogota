import { useState, useReducer } from "react";
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

// ── Reducer para agrupar estados relacionados ────────────────────────────────────
const initialState = {
  // Datos del formulario
  email: "",
  nombres: "",
  apellidos: "",
  nombreUsuario: "",
  fecha: "",
  password: "",
  password2: "",
  // Visibilidad de contraseñas
  mostrarContrasena: false,
  mostrarContrasena2: false,
  // Validación
  passwordMatch: null,
  validationRules: {
    length: false, upper: false, lower: false, number: false,
  },
  // Estado de carga
  cargando: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_PASSWORD_VISIBILITY":
      return { ...state, [action.field]: !state[action.field] };
    case "SET_PASSWORD_MATCH":
      return { ...state, passwordMatch: action.payload };
    case "SET_VALIDATION_RULES":
      return { ...state, validationRules: action.payload };
    case "SET_LOADING":
      return { ...state, cargando: action.payload };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

function FormularioCreacion() {
  const navegar = useNavigate();
  const [state, dispatch] = useReducer(formReducer, initialState);

  // ── Validación en tiempo real de contraseñas ─────────────────────────────
  const handlePasswordChange = (valor, esConfirmacion) => {

    const nuevoPassword = esConfirmacion ? state.password : valor;
    const nuevoPassword2 = esConfirmacion ? valor : state.password2;

    dispatch({
      type: "SET_FIELD",
      field: esConfirmacion ? "password2" : "password",
      value: valor,
    });

    dispatch({
      type: "SET_PASSWORD_MATCH",
      payload: nuevoPassword && nuevoPassword2
        ? nuevoPassword === nuevoPassword2
        : null,
    });

    dispatch({
      type: "SET_VALIDATION_RULES",
      payload: {
        length: nuevoPassword.length >= 8,
        upper: /[A-Z]/.test(nuevoPassword),
        lower: /[a-z]/.test(nuevoPassword),
        number: /\d/.test(nuevoPassword),
      },
    });
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.email || !state.nombres || !state.apellidos || !state.nombreUsuario || !state.fecha || !state.password || !state.password2) {
      Swal.fire({ icon: "error", title: "Campos incompletos", text: "Por favor completa todos los campos obligatorios." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
      Swal.fire({ icon: "error", title: "Correo inválido", text: "Por favor ingresa un correo electrónico válido." });
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(state.password)) {
      Swal.fire({
        icon: "error",
        title: "Contraseña insegura",
        text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números."
      });
      return;
    }

    if (state.password !== state.password2) {
      Swal.fire({ icon: "error", title: "Las contraseñas no coinciden", text: "Verifica que ambas contraseñas sean iguales." });
      return;
    }

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const resultado = await registrarUsuario({
        email: state.email, nombres: state.nombres, apellidos: state.apellidos, nombreUsuario: state.nombreUsuario,
        fechaNacimiento: state.fecha, contrasena: state.password,
      });

      if (resultado.exitoso) {
        Swal.fire({
          icon: "success",
          title: resultado.esDemo ? "Registro exitoso (Demo)" : "Registro exitoso",
          text: resultado.esDemo ? resultado.mensaje : "Tu cuenta ha sido creada correctamente.",
        }).then(() => navegar("/login"));
      } else {
        Swal.fire({ icon: "error", title: "Error en el registro", text: resultado.mensaje || "No se pudo crear la cuenta. Por favor intenta de nuevo." });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Ocurrió un error inesperado. Por favor intenta de nuevo." });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div>
      <Form onSubmit={handleSubmit} className="mt-5">

        <AccountHeader />

        <PersonalInfoFields
          email={state.email} setEmail={(v) => dispatch({ type: "SET_FIELD", field: "email", value: v })}
          nombres={state.nombres} setNombres={(v) => dispatch({ type: "SET_FIELD", field: "nombres", value: v })}
          apellidos={state.apellidos} setApellidos={(v) => dispatch({ type: "SET_FIELD", field: "apellidos", value: v })}
          nombreUsuario={state.nombreUsuario} setNombreUsuario={(v) => dispatch({ type: "SET_FIELD", field: "nombreUsuario", value: v })}
          fecha={state.fecha} setFecha={(v) => dispatch({ type: "SET_FIELD", field: "fecha", value: v })}
        />

        <PasswordFields
          password={state.password}
          password2={state.password2}
          mostrarContrasena={state.mostrarContrasena} setMostrarContrasena={() => dispatch({ type: "SET_PASSWORD_VISIBILITY", field: "mostrarContrasena" })}
          mostrarContrasena2={state.mostrarContrasena2} setMostrarContrasena2={() => dispatch({ type: "SET_PASSWORD_VISIBILITY", field: "mostrarContrasena2" })}
          passwordMatch={state.passwordMatch}
          validationRules={state.validationRules}
          onChangePassword={handlePasswordChange}
        />

        {/* Botón de envío */}
        <div className="creacion-form-submit mt-4">
          <button className="creacion-formulario-button rounded-pill" type="submit" disabled={state.cargando}>
            Guardar <IoIosSend />
          </button>
        </div>

        {/* Overlay de carga */}
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