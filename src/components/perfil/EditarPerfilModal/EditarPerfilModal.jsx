import { useState, useCallback, useMemo } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import {
  FaUser, FaEnvelope, FaPhone,
  FaShieldAlt,
} from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import "./EditarPerfilModal.css";
import Swal from "sweetalert2";
import FotoPerfil from "./FotoPerfil";
import BotonesAccion from "./BotonesAccion";
import PassField from "./PassField";
import { putEditarPerfil, patchCambiarContrasena } from "../../../api/usuarioApi";
import { useAuth } from "../../../context/AuthContext";

export default function EditarPerfilModal({
  show,
  onHide,
  perfilData,
  onPerfilActualizado,
  usandoMock = false,
}) {
  const { recargarUsuario } = useAuth();
  const [tabActiva, setTabActiva] = useState("perfil");

  // Inicializar con datos reales del perfil (sin datos quemados)
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
    perfilData?.fotoPerfil || "/images/user-pfp/default-avatar.jpg"
  );
  const [verActual, setVerActual] = useState(false);
  const [verNueva, setVerNueva] = useState(false);
  const [verConfirmar, setVerConfirmar] = useState(false);

  // ─── validación de contraseña ──────────────────────────
  const validationRules = useMemo(() => ({
    length: formData.contrasenaNueva.length >= 8,
    upper: /[A-Z]/.test(formData.contrasenaNueva),
    lower: /[a-z]/.test(formData.contrasenaNueva),
    number: /[0-9]/.test(formData.contrasenaNueva),
  }), [formData.contrasenaNueva]);

  const passwordIsValid = Object.values(validationRules).every(Boolean);

  // ─── handlers ──────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({ icon: "error", title: "Archivo demasiado grande", text: "Máximo 5MB." });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPerfil(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleEliminarFoto = () => {
    setFotoPerfil("/images/user-pfp/default-avatar.jpg");
  };

  const passwordsCoinciden =
    formData.contrasenaNueva.length > 0 &&
    formData.contrasenaNueva === formData.confirmarContrasena;

  // submit tab Perfil
  const handleSubmitPerfil = async (e) => {
    e.preventDefault();

    // Si está en modo mock, simular éxito sin llamar al backend
    if (usandoMock) {
      Swal.fire({
        icon: "info",
        title: "Modo demostración",
        text: "Los cambios no se guardarán porque no hay conexión con el servidor.",
        confirmButtonColor: "var(--color-primary)"
      });
      // Simular actualización local
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

    // Lógica normal con backend
    const datosActualizados = {
      nombresCompletos: formData.nombresCompletos,
      telefono: formData.telefono,
      biografia: formData.biografia,
      fotoPerfil: fotoPerfil,
    };

    try {
      await putEditarPerfil(datosActualizados);
      if (onPerfilActualizado) onPerfilActualizado(datosActualizados);
      await recargarUsuario();
      Swal.fire({
        icon: "success",
        title: "¡Perfil actualizado!",
        confirmButtonColor: "var(--color-primary)"
      });
      onHide();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Error al actualizar el perfil";
      Swal.fire({ icon: "error", title: "Error", text: mensaje });
    }
  };

  // submit tab Contraseña
  const handleSubmitContrasena = async (e) => {
    e.preventDefault();

    // Modo mock para contraseña
    if (usandoMock) {
      Swal.fire({
        icon: "info",
        title: "Modo demostración",
        text: "En modo demo no se puede cambiar la contraseña.",
        confirmButtonColor: "var(--color-primary)"
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
        text: "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
      });
      return;
    }
    if (!passwordsCoinciden) {
      Swal.fire({ icon: "error", title: "Las contraseñas no coinciden" });
      return;
    }
    try {
      await patchCambiarContrasena({
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.contrasenaNueva,
        confirmarContrasena: formData.confirmarContrasena
      });
      await recargarUsuario();
      Swal.fire({
        icon: "success",
        title: "¡Contraseña actualizada!",
        confirmButtonColor: "var(--color-primary)"
      });
      setFormData((p) => ({
        ...p,
        contrasenaActual: "",
        contrasenaNueva: "",
        confirmarContrasena: ""
      }));
      onHide();
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || "Error al cambiar la contraseña";
      Swal.fire({ icon: "error", title: "Error", text: mensaje });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="editar-perfil-modal"
    >
      {/* HEADER */}
      <Modal.Header closeButton className="modal-header-custom">
        <div className="modal-title-custom">
          <span className="mh-icon-box"><FiEdit3 /></span>
          Editar perfil
        </div>
      </Modal.Header>

      {/* TABS NAV */}
      <div className="modal-tabs-nav">
        <button
          type="button"
          className={`mtab ${tabActiva === "perfil" ? "active" : ""}`}
          onClick={() => setTabActiva("perfil")}
        >
          <FaUser className="mtab-icon" />
          Perfil
        </button>
        <button
          type="button"
          className={`mtab ${tabActiva === "contrasena" ? "active" : ""}`}
          onClick={() => setTabActiva("contrasena")}
        >
          <FaShieldAlt className="mtab-icon" />
          Contraseña
        </button>
      </div>

      <Modal.Body className="modal-body-custom">

        {/* ══ TAB: PERFIL ══════════════════════════════════ */}
        {tabActiva === "perfil" && (
          <Form onSubmit={handleSubmitPerfil}>

            {/* Hero foto */}
            <div className="profile-hero">
              <FotoPerfil
                fotoPerfil={fotoPerfil}
                onFotoChange={handleFotoChange}
                onEliminarFoto={handleEliminarFoto}
              />
              <div className="hero-info">
                <p className="hero-name">{formData.nombresCompletos || "Usuario"}</p>
                <p className="hero-user">@{formData.nombreUsuario || "usuario"}</p>
                <div className="hero-pills">
                  <span className="hpill">Miembro</span>
                  <span className="hpill accent">
                    Nivel {perfilData?.nivel || 1}
                  </span>
                </div>
              </div>
            </div>

            {/* Info personal */}
            <div className="form-block">
              <div className="block-heading">
                <FaUser className="bh-icon" />
                <span>Información personal</span>
              </div>
              <Row className="g-3">
                <Col md={12}>
                  <div className="fgroup">
                    <label className="flabel">Nombre completo</label>
                    <Form.Control
                      type="text"
                      name="nombresCompletos"
                      value={formData.nombresCompletos}
                      onChange={handleChange}
                      className="finput"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                </Col>
                <Col md={12}>
                  <div className="fgroup">
                    <label className="flabel">Biografía</label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="biografia"
                      value={formData.biografia}
                      onChange={handleChange}
                      className="finput ftextarea"
                      placeholder="Cuéntanos sobre ti..."
                      maxLength={160}
                    />
                    <span className="char-hint">{formData.biografia?.length || 0}/160</span>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="block-sep" />

            {/* Contacto */}
            <div className="form-block">
              <div className="block-heading">
                <FaEnvelope className="bh-icon" />
                <span>Contacto</span>
              </div>
              <Row className="g-3">
                <Col md={7}>
                  <div className="fgroup">
                    <label className="flabel">Correo electrónico</label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="finput"
                      placeholder="correo@ejemplo.com"
                      disabled
                    />
                  </div>
                </Col>
                <Col md={5}>
                  <div className="fgroup">
                    <label className="flabel">
                      <FaPhone style={{ fontSize: "0.7rem", marginRight: 5 }} />
                      Teléfono
                    </label>
                    <Form.Control
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="finput"
                      placeholder="300 000 0000"
                    />
                  </div>
                </Col>
              </Row>
            </div>

            <BotonesAccion onCancelar={onHide} />
          </Form>
        )}

        {/* ══ TAB: CONTRASEÑA ══════════════════════════════ */}
        {tabActiva === "contrasena" && (
          <Form onSubmit={handleSubmitContrasena}>
            <div className="form-block pass-tab-block">

              {/* Ilustración / ícono decorativo */}
              <div className="pass-hero">
                <span className="pass-hero-icon"><FaShieldAlt /></span>
                <p className="pass-hero-title">Cambiar contraseña</p>
                <p className="pass-hero-sub">
                  Elige una contraseña segura con al menos 8 caracteres, una mayúscula, una minúscula y un número.
                </p>
              </div>

              <div className="pass-fields-stack">
                <PassField
                  label="Contraseña actual"
                  name="contrasenaActual"
                  value={formData.contrasenaActual}
                  onChange={handleChange}
                  ver={verActual}
                  onToggle={() => setVerActual(!verActual)}
                  placeholder="Tu contraseña actual"
                  formData={formData}
                />

                <div className="pass-divider" />

                <PassField
                  label="Nueva contraseña"
                  name="contrasenaNueva"
                  value={formData.contrasenaNueva}
                  onChange={handleChange}
                  ver={verNueva}
                  onToggle={() => setVerNueva(!verNueva)}
                  placeholder="Mínimo 8 caracteres..."
                  formData={formData}
                  validationRules={validationRules}
                />

                <PassField
                  label="Confirmar nueva contraseña"
                  name="confirmarContrasena"
                  value={formData.confirmarContrasena}
                  onChange={handleChange}
                  ver={verConfirmar}
                  onToggle={() => setVerConfirmar(!verConfirmar)}
                  placeholder="Repite la nueva contraseña"
                  formData={formData}
                  passwordsCoinciden={passwordsCoinciden}
                />
              </div>
            </div>
            <BotonesAccion onCancelar={onHide} />
          </Form>
        )}

      </Modal.Body>
    </Modal>
  );
}