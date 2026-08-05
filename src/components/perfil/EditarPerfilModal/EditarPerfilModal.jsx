import { useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import "./EditarPerfilModal.css";
import "./EliminarCuenta.css";
import Swal from "sweetalert2";
import EliminarCuenta from "./EliminarCuenta";
import PerfilModalHeader from "./PerfilModalHeader";
import PerfilFormCampos from "./PerfilFormCampos";
import PassFormCampos from "./PassFormCampos";
import {
  editarPerfil,
  cambiarContrasena,
} from "../../../services/usuario.service";
import { useAuth } from "../../../context/AuthContext";
import { subirAvatar } from "@/services/imagen.service";

function PerfilFormulario({
  perfilData,
  usandoMock,
  onPerfilActualizado,
  onHide,
}) {
  const { recargarUsuario, usuario } = useAuth();
  const [tabActiva, setTabActiva] = useState("perfil");

  const [formData, setFormData] = useState({
    nombresCompletos: perfilData?.nombresCompletos || "",
    nombreUsuario: perfilData?.nombreUsuario || "",
    email: perfilData?.email || "",
    biografia: perfilData?.biografia || "",
    telefono: perfilData?.telefono || "",
    contrasenaActual: "",
    contrasenaNueva: "",
    confirmarContrasena: "",
  });

  const [fotoPerfil, setFotoPerfil] = useState(
    perfilData?.fotoPerfil || null,
  );
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  const validationRules = useMemo(
    () => ({
      length: formData.contrasenaNueva.length >= 8,
      upper: /[A-Z]/.test(formData.contrasenaNueva),
      lower: /[a-z]/.test(formData.contrasenaNueva),
      number: /[0-9]/.test(formData.contrasenaNueva),
    }),
    [formData.contrasenaNueva],
  );

  const passwordIsValid = Object.values(validationRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setFotoPerfil(previewUrl);

    const resultado = await subirAvatar(file);
    if (resultado.exitoso) {
      setFotoPerfil(resultado.url);
    } else {
      Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
      setFotoPerfil(perfilData?.fotoPerfil || null);
    }
  };

  const handleEliminarFoto = () => {
    setFotoPerfil(null);
  };

  const passwordsCoinciden =
    formData.contrasenaNueva.length > 0 &&
    formData.contrasenaNueva === formData.confirmarContrasena;

  const handleSubmitPerfil = async (e) => {
    e.preventDefault();

    if (usandoMock) {
      Swal.fire({
        icon: "info",
        title: "Modo demostración",
        text: "Los cambios no se guardarán porque no hay conexión con el servidor.",
        confirmButtonColor: "var(--color-primary)",
      });
      if (onPerfilActualizado) {
        onPerfilActualizado({
          ...perfilData,
          nombresCompletos: formData.nombresCompletos,
          biografia: formData.biografia,
          telefono: formData.telefono,
          fotoPerfil: fotoPerfil,
        });
      }
      onHide();
      return;
    }

    const datosActualizados = {
      nombresCompletos: formData.nombresCompletos,
      telefono: formData.telefono,
      biografia: formData.biografia,
      // null = sin foto (el backend / UI muestran la inicial)
      fotoPerfil: fotoPerfil && !String(fotoPerfil).includes("default-avatar")
        ? fotoPerfil
        : null,
    };

    try {
      const resultado = await editarPerfil(datosActualizados);

      if (!resultado.exitoso) {
        Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
        return;
      }

      if (onPerfilActualizado) {
        onPerfilActualizado(resultado.datos || datosActualizados);
      }
      await recargarUsuario();
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        confirmButtonColor: "var(--color-primary)",
      });
      onHide();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al actualizar el perfil";
      Swal.fire({ icon: "error", title: "Error", text: mensaje });
    }
  };

  const handleSubmitContrasena = async (e) => {
    e.preventDefault();

    if (usandoMock) {
      Swal.fire({
        icon: "info",
        title: "Modo demostración",
        text: "En modo demo no se puede cambiar la contraseña.",
        confirmButtonColor: "var(--color-primary)",
      });
      onHide();
      return;
    }

    if (!formData.contrasenaActual) {
      Swal.fire({ icon: "error", title: "Ingresa tu contraseña actual" });
      return;
    }
    if (!passwordIsValid) {
      Swal.fire({
        icon: "error",
        title: "Contraseña no válida",
        text: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      });
      return;
    }
    if (!passwordsCoinciden) {
      Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
      return;
    }
    try {
      const resultado = await cambiarContrasena({
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.contrasenaNueva,
        confirmarContrasena: formData.confirmarContrasena,
      });

      if (!resultado.exitoso) {
        Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
        return;
      }

      await recargarUsuario();
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        confirmButtonColor: "var(--color-primary)",
      });
      setFormData((p) => ({
        ...p,
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: "",
      }));
      onHide();
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje || "Error al cambiar la contraseña";
      Swal.fire({ icon: "error", title: "Error", text: mensaje });
    }
  };

  const rolMostrar = perfilData?.rol || "MIEMBRO";
  // Usamos el rol del usuario autenticado (viene verificado del backend vía /auth/me)
  // para decidir si mostrar la pestaña de eliminación, en vez de perfilData.rol.
  const esMiembro = (usuario?.rol || "").toUpperCase() === "MIEMBRO";

  return (
    <>
      <PerfilModalHeader
        esMiembro={esMiembro}
        tabActiva={tabActiva}
        onCambiarTab={setTabActiva}
      />

      <Modal.Body className="modal-body-custom">
        {tabActiva === "perfil" && (
          <PerfilFormCampos
            formData={formData}
            fotoPerfil={fotoPerfil}
            rolMostrar={rolMostrar}
            perfilData={perfilData}
            handleChange={handleChange}
            handleFotoChange={handleFotoChange}
            handleEliminarFoto={handleEliminarFoto}
            handleSubmit={handleSubmitPerfil}
            onCancelar={onHide}
          />
        )}

        {tabActiva === "contrasena" && (
          <PassFormCampos
            formData={formData}
            handleChange={handleChange}
            validationRules={validationRules}
            passwordsCoinciden={passwordsCoinciden}
            verActual={verActual}
            verNueva={verNueva}
            verConfirmar={verConfirmar}
            onToggleActual={() => setVerActual(!verActual)}
            onToggleNueva={() => setVerNueva(!verNueva)}
            onToggleConfirmar={() => setVerConfirmar(!verConfirmar)}
            handleSubmit={handleSubmitContrasena}
            onCancelar={onHide}
          />
        )}

        {tabActiva === "eliminar" && esMiembro && (
          <EliminarCuenta onHide={onHide} />
        )}
      </Modal.Body>
    </>
  );
}

export default function EditarPerfilModal({
  show,
  onHide,
  perfilData,
  onPerfilActualizado,
  usandoMock = false,
}) {
  return (
    <Modal
      key={show ? `editar-perfil-${perfilData?.nombreUsuario || "open"}` : "editar-perfil-closed"}
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="editar-perfil-modal"
    >
      {show && (
        <PerfilFormulario
          perfilData={perfilData}
          usandoMock={usandoMock}
          onPerfilActualizado={onPerfilActualizado}
          onHide={onHide}
        />
      )}
    </Modal>
  );
}
