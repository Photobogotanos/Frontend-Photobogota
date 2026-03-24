// ============================================================
// COMPONENTE PADRE: EditarPerfilModal
// Su responsabilidad: guardar el estado y la lógica.
// Los componentes hijos solo muestran, este componente piensa.
// ============================================================

import { useState } from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import { FaCamera } from "react-icons/fa";
import "./EditarPerfilModal.css";
import Swal from "sweetalert2";

// Importamos los 3 hijos que creamos
import FotoPerfil from "./FotoPerfil";
import CambiarContrasena from "./CambiarContrasena";
import BotonesAccion from "./BotonesAccion";

// ─────────────────────────────────────────────────────────────
// El componente recibe 4 props desde quien lo usa (por ejemplo, una página):
//   show                → true/false para mostrar u ocultar el modal
//   onHide              → función para cerrarlo
//   perfilData          → objeto con los datos actuales del usuario
//   onPerfilActualizado → función para avisar que se guardó
// ─────────────────────────────────────────────────────────────
export default function EditarPerfilModal({
  show,
  onHide,
  perfilData,
  onPerfilActualizado,
}) {

  // ── ESTADO DEL FORMULARIO ──────────────────────────────────
  // useState guarda los valores de los campos de texto.
  // Se inicializa con los datos que llegaron en perfilData,
  // o con valores por defecto si perfilData viene vacío.
  const [formData, setFormData] = useState({
    nombreCompleto:      perfilData?.nombreCompleto || "Juan Sebastian Romero",
    nombreUsuario:       perfilData?.nombreUsuario  || "sxbxxs.r",
    correo:              perfilData?.correo         || "photobogota123@gmail.com",
    descripcion:         perfilData?.descripcion    || "Descubre y comparte los mejores spots locales.",
    telefono:            perfilData?.telefono       || "3138529778",
    contrasena:          "",
    confirmarContrasena: "",
  });

  // Estado separado para la foto (string con ruta o base64)
  const [fotoPerfil, setFotoPerfil] = useState(
    perfilData?.foto || "public/images/user-pfp/default-avatar.jpg"
  );

  // Estado para mostrar u ocultar los campos de contraseña
  const [mostrarCambiarContrasena, setMostrarCambiarContrasena] = useState(false);


  // ── HANDLERS ───────────────────────────────────────────────

  // Se ejecuta cada vez que el usuario escribe en cualquier campo.
  // Usa el atributo "name" del input para saber qué campo actualizar.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,       // copia todo lo anterior
      [name]: value, // sobreescribe solo el campo que cambió
    }));
  };

  // Se ejecuta cuando el usuario elige una imagen nueva.
  // Valida el tamaño y convierte la imagen a base64 para previsualizarla.
  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: "error",
          title: "Archivo demasiado grande",
          text: "El tamaño máximo permitido es de 5MB.",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setFotoPerfil(event.target.result); // guarda la imagen como base64
      };
      reader.readAsDataURL(file);
    }
  };

  // Restaura la foto al avatar por defecto
  const handleEliminarFoto = () => {
    setFotoPerfil("public/images/user-pfp/default-avatar.jpg");
  };

  // Se ejecuta al presionar "Guardar Cambios"
  const handleSubmit = (e) => {
    e.preventDefault(); // evita que la página se recargue

    // Si el usuario quiso cambiar contraseña, verifica que coincidan
    if (mostrarCambiarContrasena && formData.contrasena !== formData.confirmarContrasena) {
      Swal.fire({
        icon: "error",
        title: "Contraseñas no coinciden",
        text: "Por favor verifica que ambas contraseñas sean iguales.",
      });
      return;
    }

    const datosActualizados = {
      nombreCompleto: formData.nombreCompleto,
      nombreUsuario:  formData.nombreUsuario,
      correo:         formData.correo,
      descripcion:    formData.descripcion,
      telefono:       formData.telefono,
      foto:           fotoPerfil,
    };

    // Si quien usó este modal nos pasó onPerfilActualizado,
    // la llamamos para que el resto de la app se entere del cambio
    if (onPerfilActualizado) {
      onPerfilActualizado(datosActualizados);
    }

    Swal.fire({
      icon: "success",
      title: "Actualizado",
      text: "Gracias por mantenerte actualizado parcerito",
    });

    onHide(); // cierra el modal
  };


  // ── RENDER ─────────────────────────────────────────────────
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="editar-perfil-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
          <FaCamera className="me-2" />
          Editar Perfil
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        <Form onSubmit={handleSubmit}>

          <div className="section-header">
            <span className="section-label">A. Perfil</span>
          </div>
          <div className="section-divider"></div>

          {/* ── HIJO 1: FotoPerfil ──────────────────────────────
              Le pasamos 3 props:
              - fotoPerfil: el valor actual de la foto (para mostrarla)
              - onFotoChange: qué hacer cuando elija una foto nueva
              - onEliminarFoto: qué hacer cuando presione "Eliminar"
          */}
          <FotoPerfil
            fotoPerfil={fotoPerfil}
            onFotoChange={handleFotoChange}
            onEliminarFoto={handleEliminarFoto}
          />

          {/* ── CAMPOS DE TEXTO ─────────────────────────────── */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Nombre completo</Form.Label>
            <Form.Control
              type="text"
              name="nombreCompleto"           // debe coincidir con la key en formData
              value={formData.nombreCompleto} // valor controlado por el estado
              onChange={handleChange}         // actualiza el estado al escribir
              className="form-control-custom"
              placeholder="Ingresa tu nombre completo"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Nombre de usuario</Form.Label>
            <Form.Control
              type="text"
              name="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              className="form-control-custom"
              placeholder="Ingresa tu nombre de usuario"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              className="form-control-custom"
              placeholder="Ingresa tu correo electrónico"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="form-control-custom"
              placeholder="Cuéntanos sobre ti"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="form-label-custom">Teléfono</Form.Label>
            <Form.Control
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="form-control-custom"
              placeholder="Ingresa tu número de teléfono"
            />
          </Form.Group>

          {/* ── HIJO 2: CambiarContrasena ───────────────────────
              Le pasamos 4 props:
              - mostrar: true/false para saber si mostrar los campos
              - onToggle: función para alternar mostrar/ocultar
              - formData: necesita contrasena y confirmarContrasena
              - onChange: para actualizar esos campos en el estado del padre
          */}
          <CambiarContrasena
            mostrar={mostrarCambiarContrasena}
            onToggle={() => setMostrarCambiarContrasena(!mostrarCambiarContrasena)}
            formData={formData}
            onChange={handleChange}
          />

          {/* ── GUARDADOS ───────────────────────────────────── */}
          <div className="mb-4">
            <Form.Label className="form-label-custom">Guardados</Form.Label>
            <div className="guardados-preview">
              <div className="guardado-item">
                <span className="guardado-label">Miembro</span>
                <span className="guardado-value">Miembro</span>
              </div>
              <div className="guardado-item">
                <span className="guardado-label">Nivel</span>
                <span className="guardado-value">320</span>
              </div>
            </div>
          </div>

          {/* ── HIJO 3: BotonesAccion ───────────────────────────
              Solo necesita saber qué hacer al cancelar.
              El botón guardar es type="submit", entonces
              automáticamente dispara el onSubmit del Form padre.
          */}
          <BotonesAccion onCancelar={onHide} />

        </Form>
      </Modal.Body>
    </Modal>
  );
}