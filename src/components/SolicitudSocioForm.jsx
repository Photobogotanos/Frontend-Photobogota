import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from "../assets/images/logo.png";
import './SolicitudSocioForm.css';

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

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre completo *</Form.Label>
          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Email *</Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Teléfono *</Form.Label>
          <Form.Control name="telefono" value={formData.telefono} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Fecha de nacimiento *</Form.Label>
          <Form.Control type="date" name="fechaNacimiento" value={formData.fechaNacimiento} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Razón Social *</Form.Label>
          <Form.Control name="razonSocial" value={formData.razonSocial} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Localidad *</Form.Label>
          <Form.Control name="localidad" value={formData.localidad} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Dirección *</Form.Label>
          <Form.Control name="direccion" value={formData.direccion} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">NIT o RUT *</Form.Label>
          <Form.Control name="nit" value={formData.nit} onChange={handleChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre del propietario</Form.Label>
          <Form.Control name="propietario" value={formData.propietario} onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Categoría *</Form.Label>
          <Form.Select name="categoria" value={formData.categoria} onChange={handleChange} required>
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="solicitud-form-submit">
          <Button variant="primary" type="submit">Enviar solicitud</Button>
        </div>
      </Form>
    </div>
  );
};

export default SolicitudSocioForm;