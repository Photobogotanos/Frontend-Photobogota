import { useReducer } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import PasswordFields from "@/components/auth/CreacionDeCuentaForm/PasswordFields";
import BackButton from "../../common/BackButton";
import { postVerificarCodigo } from "@/api/usuarioApi";
import "./PasswordResetForm.css";

const initialState = {
  password: "",
  password2: "",
  mostrarContrasena: false,
  mostrarContrasena2: false,
  passwordMatch: null,
  validationRules: { length: false, upper: false, lower: false, number: false },
  cargando: false,
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "TOGGLE_VISIBILITY":
      return { ...state, [action.field]: !state[action.field] };
    case "SET_PASSWORD_MATCH":
      return { ...state, passwordMatch: action.payload };
    case "SET_VALIDATION_RULES":
      return { ...state, validationRules: action.payload };
    case "SET_LOADING":
      return { ...state, cargando: action.payload };
    default:
      return state;
  }
}

export default function PasswordResetForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const navegar = useNavigate();
  const location = useLocation();

  // Email y código recibidos desde ConfirmacionCodigoForm
  const email = location.state?.email || "";
  const codigo = location.state?.codigo || "";

  const handlePasswordChange = (valor, esConfirmacion) => {
    const nuevoPassword = esConfirmacion ? state.password : valor;
    const nuevoPassword2 = esConfirmacion ? valor : state.password2;

    dispatch({ type: "SET_FIELD", field: esConfirmacion ? "password2" : "password", value: valor });
    dispatch({
      type: "SET_PASSWORD_MATCH",
      payload: nuevoPassword && nuevoPassword2 ? nuevoPassword === nuevoPassword2 : null,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!state.password || !state.password2) {
      return Swal.fire({ icon: "error", title: "Campos incompletos", text: "Por favor completa todos los campos.", confirmButtonColor: "#806fbe" });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(state.password)) {
      return Swal.fire({ icon: "error", title: "Contraseña insegura", text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números.", confirmButtonColor: "#806fbe" });
    }

    if (state.password !== state.password2) {
      return Swal.fire({ icon: "error", title: "Las contraseñas no coinciden", text: "Verifica que ambas contraseñas sean iguales.", confirmButtonColor: "#806fbe" });
    }

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await postVerificarCodigo({ email, codigo, nuevaContrasena: state.password });

      Swal.fire({
        icon: "success",
        title: "Contraseña actualizada",
        text: "Ya puedes iniciar sesión con tu nueva contraseña.",
        confirmButtonColor: "#806fbe",
      }).then(() => navegar("/login"));

    } catch (error) {
      const mensaje = error.response?.data?.message || "Código inválido o expirado. Vuelve a intentarlo.";
      Swal.fire({ icon: "error", title: "Error", text: mensaje, confirmButtonColor: "#d33" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="password-reset-form-container">

      <div className="password-reset-header">
        <span className="password-reset-subtitle">Nueva contraseña</span>
        <h2 className="password-reset-title">Establecer contraseña</h2>
        <span className="password-reset-line"></span>
      </div>

      <p className="password-reset-desc">
        Ingresa tu nueva contraseña. Debe cumplir con los requisitos de seguridad.
      </p>

      <PasswordFields
        password={state.password}
        password2={state.password2}
        mostrarContrasena={state.mostrarContrasena}
        setMostrarContrasena={(val) => dispatch({ type: "TOGGLE_VISIBILITY", field: "mostrarContrasena" })}
        mostrarContrasena2={state.mostrarContrasena2}
        setMostrarContrasena2={(val) => dispatch({ type: "TOGGLE_VISIBILITY", field: "mostrarContrasena2" })}
        passwordMatch={state.passwordMatch}
        validationRules={state.validationRules}
        onChangePassword={handlePasswordChange}
      />

      <div className="password-reset-submit-wrap">
        <button className="password-reset-btn" type="submit" disabled={state.cargando}>
          {state.cargando ? "Guardando..." : "Guardar contraseña"}
        </button>
      </div>

      <div className="justify-content-center d-flex mb-4 mt-3">
        <BackButton />
      </div>

    </Form>
  );
}