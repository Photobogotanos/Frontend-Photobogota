import { useState } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import { FaCamera, FaUpload, FaTrash, FaLock } from "react-icons/fa";
import "./EditarPerfilModal.css";

export default function EditarPerfilModal({ show, onHide, perfilData }) {
const [formData, setFormData] = useState({
    nombreCompleto: perfilData?.nombreCompleto || "Juan Sebastian Romero",
    nombreUsuario: perfilData?.nombreUsuario || "sxbxxs.r",
    correo: perfilData?.correo || "photobogota123@gmail.com",
    descripcion: perfilData?.descripcion || "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
    telefono: perfilData?.telefono || "3138529778",
    contrasena: "",
    confirmarContrasena: "",
});
const [fotoPerfil, setFotoPerfil] = useState(perfilData?.foto || "public/images/user-pfp/default-avatar.jpg");
const [mostrarCambiarContrasena, setMostrarCambiarContrasena] = useState(false);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value
    }));
};
const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 5MB.");
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
        setFotoPerfil(event.target.result);
    };
    reader.readAsDataURL(file);
    }
};

const handleEliminarFoto = () => {
    setFotoPerfil("public/images/user-pfp/default-avatar.jpg");
};

const handleSubmit = (e) => {
    e.preventDefault();
    
    if (mostrarCambiarContrasena && formData.contrasena !== formData.confirmarContrasena) {
    alert("Las contraseñas no coinciden");
    return;
    }
    
    // Aquí iría la lógica para guardar los cambios
    console.log("Datos guardados:", { ...formData, fotoPerfil });
    alert("Perfil actualizado correctamente");
    onHide();
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
    <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom">
        <FaCamera className="me-2" />
        Editar Perfil
        </Modal.Title>
    </Modal.Header>
    
    <Modal.Body className="modal-body-custom">
        <Form onSubmit={handleSubmit}>
        
          {/* SECCIÓN A: PERFIL */}
        <div className="section-header">
            <span className="section-label">A. Perfil</span>
            <span className="section-subtitle">Ajustes</span>
        </div>
        
        <div className="section-divider"></div>
        
          {/* CAMBIAR FOTO */}
        <Form.Group className="mb-4">
            <Form.Label className="form-label-custom">
            Cambiar foto
            <span className="file-format">JPG, PNG o GIF (máx. 5MB)</span>
            </Form.Label>
            <div className="foto-perfil-container">
            <div className="foto-preview">
                <img src={fotoPerfil} alt="Foto perfil" className="foto-perfil-img" />
                <div className="foto-actions">
                <label htmlFor="upload-foto" className="btn-foto-action upload">
                    <FaUpload className="me-1" /> Cambiar
                </label>
                <input
                    type="file"
                    id="upload-foto"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={handleFotoChange}
                    className="d-none"
                />
                <button 
                    type="button" 
                    className="btn-foto-action delete"
                    onClick={handleEliminarFoto}
                >
                    <FaTrash className="me-1" /> Eliminar
                </button>
                </div>
            </div>
            </div>
        </Form.Group>
        
          {/* NOMBRE COMPLETO */}
        <Form.Group className="mb-3">
            <Form.Label className="form-label-custom">Nombre completo</Form.Label>
            <Form.Control
            type="text"
            name="nombreCompleto"
            value={formData.nombreCompleto}
            onChange={handleChange}
            className="form-control-custom"
            placeholder="Ingresa tu nombre completo"
            />
        </Form.Group>
        
          {/* NOMBRE DE USUARIO */}
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
        
          {/* CORREO ELECTRÓNICO */}
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
        
          {/* DESCRIPCIÓN */}
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
        
          {/* TELÉFONO */}
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
        
          {/* CAMBIAR CONTRASEÑA */}
        <div className="mb-4">
            <button
            type="button"
            className="btn-cambiar-contrasena"
            onClick={() => setMostrarCambiarContrasena(!mostrarCambiarContrasena)}
            >
            <FaLock className="me-2" />
            {mostrarCambiarContrasena ? "Ocultar cambio de contraseña" : "Cambiar contraseña"}
            </button>
            
            {mostrarCambiarContrasena && (
            <div className="contrasena-fields mt-3">
                <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleChange}
                        className="form-control-custom"
                        placeholder="Nueva contraseña"
                    />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                    <Form.Label className="form-label-custom">Confirmar Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        className="form-control-custom"
                        placeholder="Confirmar nueva contraseña"
                    />
                    </Form.Group>
                </Col>
                </Row>
            </div>
            )}
        </div>
        
          {/* GUARDADOS */}
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
            <div className="guardado-item">
                <span className="guardado-label">Descripción</span>
                <span className="guardado-value">Descubre y con...</span>
            </div>
            </div>
        </div>
        
          {/* BOTONES DE ACCIÓN */}
        <div className="modal-actions">
            <Button 
            variant="outline-secondary" 
            onClick={onHide}
            className="btn-cancelar"
            >
            Cancelar
            </Button>
            <Button 
            type="submit" 
            variant="primary"
            className="btn-guardar"
            >
            Guardar Cambios
            </Button>
        </div>
        </Form>
    </Modal.Body>
    </Modal>
    );
}