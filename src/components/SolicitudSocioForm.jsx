import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import logo from "../assets/images/logo.png";
import './SolicitudSocioForm.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const SolicitudSocioForm = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fechaNacimiento: "",
    razonSocial: "",
    localidad: "",
    direccion: "",
    nit: "",
    propietario: "",
    categoria: ""
  });

  const categorias = [
    "Restaurante",
    "Cafetería",
    "Comercio",
    "Empresa",
    "Otro"
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <div className="solicitud-form-header">
        <img src={logo} alt="Logo" className="solicitud-form-logo" />
        <h2 className="solicitud-form-title">Solicitud para ser socio</h2>
        <p className="solicitud-form-subtitle">Completa todos los campos obligatorios *</p>
      </div>

      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre completo
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Email
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Teléfono
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Fecha de nacimiento
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Razón Social
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="razonSocial" value={formData.razonSocial} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Localidad
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="localidad" value={formData.localidad} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Dirección
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="direccion" value={formData.direccion} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">NIT o RUT
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="nit" value={formData.nit} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre del propietario
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="propietario" value={formData.propietario} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Categoría
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} className="form-control-no-focus rounded-pill" required>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="solicitud-form-submit mt-5">
          <button className="solicitud-form-button rounded-pill" type="submit"><b>Enviar solicitud</b></button>
        </div>
      </Form>
    </div>
  );F
};

export default SolicitudSocioForm;