import { useState, useReducer } from "react";
import Form from "react-bootstrap/Form";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { IoIosSend } from "react-icons/io";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";

import "./AdminCreacionDeCuentaForm.css";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import AdminAccountHeader from "./AdminAccountHeader";
import PersonalInfoFields from "@/components/auth/CreacionDeCuentaForm/PersonalInfoFields";
import PasswordFields from "@/components/auth/CreacionDeCuentaForm/PasswordFields";
import RoleSelector from "./RoleSelector";
import { crearUsuarioAdmin } from "@/services/admin.service";
import { obtenerEstadoServidor } from "@/utils/serverStatus";

const initialState = {
    email: "",
    nombres: "",
    apellidos: "",
    nombreUsuario: "",
    fecha: "",
    telefono: "",
    biografia: "",
    password: "",
    password2: "",
    rol: "MIEMBRO",
    mostrarContrasena: false,
    mostrarContrasena2: false,
    passwordMatch: null,
    validationRules: {
        length: false, upper: false, lower: false, number: false,
    },
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

function AdminCreacionDeCuentaForm() {
    const navegar = useNavigate();
    const [state, dispatch] = useReducer(formReducer, initialState);
    const [errorRol, setErrorRol] = useState("");
    // eslint-disable-next-line no-unused-vars
    const [modoDemo, setModoDemo] = useState(false);

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
            payload: (nuevoPassword && nuevoPassword2)
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

    const validarRol = () => {
        if (!state.rol) {
            setErrorRol("Debes seleccionar un rol para el usuario");
            return false;
        }
        setErrorRol("");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!state.email || !state.nombres || !state.apellidos || !state.nombreUsuario || !state.fecha || !state.password || !state.password2) {
            Swal.fire({
                icon: "error",
                title: "Campos incompletos",
                text: "Por favor completa todos los campos obligatorios."
            });
            return;
        }

        // Validar email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "Por favor ingresa un correo electrónico válido."
            });
            return;
        }

        // Validar contraseña
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(state.password)) {
            Swal.fire({
                icon: "error",
                title: "Contraseña insegura",
                text: "Debe tener mínimo 8 caracteres, mayúsculas, minúsculas y números."
            });
            return;
        }

        if (!validarRol()) {
            Swal.fire({ icon: "error", title: "Rol no seleccionado", text: "Debes seleccionar un rol." });
            return;
        }

        if (state.password !== state.password2) {
            Swal.fire({ icon: "error", title: "Error", text: "Las contraseñas no coinciden." });
            return;
        }

        try {
            dispatch({ type: "SET_LOADING", payload: true });

            // Verificar modo offline
            const isOnline = await obtenerEstadoServidor();
            setModoDemo(!isOnline);

            const resultado = await crearUsuarioAdmin({
                nombresCompletos: `${state.nombres} ${state.apellidos}`,
                nombreUsuario: state.nombreUsuario,
                email: state.email,
                contrasena: state.password,
                fechaNacimiento: state.fecha,
                rol: state.rol,
                telefono: state.telefono || null,
                biografia: state.biografia || null
            });

            if (resultado.exitoso) {
                let mensaje = `<p>Se ha creado la cuenta para <b>${state.nombres} ${state.apellidos}</b> con el rol <b>${state.rol}</b></p>`;
                
                if (resultado.esDemo) {
                    mensaje += `<p class="text-warning mt-2"><small>⚠️ Modo Demo: Los datos se guardan localmente</small></p>`;
                }

                Swal.fire({
                    icon: resultado.esDemo ? "info" : "success",
                    title: resultado.esDemo ? "Usuario creado (Modo Demo)" : "¡Usuario creado!",
                    html: mensaje,
                    confirmButtonColor: "#806fbe",
                    showCancelButton: true,
                    confirmButtonText: "Crear otro",
                    cancelButtonText: "Ir a usuarios"
                }).then((result) => {
                    if (result.isConfirmed) {
                        dispatch({ type: "RESET_FORM" });
                    } else {
                        navegar("/admin/usuarios");
                    }
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: resultado.mensaje || "No se pudo crear el usuario"
                });
            }
        } catch (error) {
            console.error("Error en creación:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Ocurrió un error inesperado. Por favor intenta de nuevo."
            });
        } finally {
            dispatch({ type: "SET_LOADING", payload: false });
        }
    };


    return (
        <div className="admin-creacion-container">
            <Form onSubmit={handleSubmit}>
                <AdminAccountHeader />

                <div className="form-section">
                    <PersonalInfoFields
                        email={state.email}
                        setEmail={(v) => dispatch({ type: "SET_FIELD", field: "email", value: v })}
                        nombres={state.nombres}
                        setNombres={(v) => dispatch({ type: "SET_FIELD", field: "nombres", value: v })}
                        apellidos={state.apellidos}
                        setApellidos={(v) => dispatch({ type: "SET_FIELD", field: "apellidos", value: v })}
                        nombreUsuario={state.nombreUsuario}
                        setNombreUsuario={(v) => dispatch({ type: "SET_FIELD", field: "nombreUsuario", value: v })}
                        fecha={state.fecha}
                        setFecha={(v) => dispatch({ type: "SET_FIELD", field: "fecha", value: v })}
                    />
                </div>

                <div className="form-section">
                    <RoleSelector
                        rol={state.rol}
                        setRol={(v) => dispatch({ type: "SET_FIELD", field: "rol", value: v })}
                        error={errorRol}
                    />
                </div>

                <div className="form-section">
                    <PasswordFields
                        password={state.password}
                        password2={state.password2}
                        mostrarContrasena={state.mostrarContrasena}
                        setMostrarContrasena={() => dispatch({ type: "SET_PASSWORD_VISIBILITY", field: "mostrarContrasena" })}
                        mostrarContrasena2={state.mostrarContrasena2}
                        setMostrarContrasena2={() => dispatch({ type: "SET_PASSWORD_VISIBILITY", field: "mostrarContrasena2" })}
                        passwordMatch={state.passwordMatch}
                        validationRules={state.validationRules}
                        onChangePassword={handlePasswordChange}
                    />
                </div>

                <div className="admin-form-buttons">
                    <button type="button" className="admin-btn-secondary" onClick={() => navegar("/admin/usuarios")}>
                        <FaArrowLeft /> Cancelar
                    </button>
                    <button className="admin-btn-primary" type="submit" disabled={state.cargando}>
                        <IoIosSend /> Crear Usuario
                    </button>
                </div>

                {state.cargando && (
                    <div className="loading-overlay">
                        <SpinnerLoader texto="Procesando registro..." />
                    </div>
                )}
            </Form>
        </div>
    );
}

export default AdminCreacionDeCuentaForm;