import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import logo from "../assets/images/logo.png";


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
    // Lógica para enviar datos...
  };

  return (

    <div>

      <div className="text-center mb-4">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "120px", marginBottom: "10px" }}
        />
        <h2 className="fw-bold" style={{ color: "var(--color-primary)" }}>
          Solicitud para ser socio
        </h2>
        <p style={{ color: "#555" }}>Completa todos los campos obligatorios *</p>
      </div>

      <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Nombre completo *</Form.Label>
          <Form.Control
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Email *</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Teléfono *</Form.Label>
          <Form.Control
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Fecha de nacimiento *</Form.Label>
          <Form.Control
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Razón Social *</Form.Label>
          <Form.Control
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Localidad *</Form.Label>
          <Form.Control
            name="localidad"
            value={formData.localidad}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Dirección *</Form.Label>
          <Form.Control
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">NIT o RUT *</Form.Label>
          <Form.Control
            name="nit"
            value={formData.nit}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Nombre del propietario</Form.Label>
          <Form.Control
            name="propietario"
            value={formData.propietario}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-start w-100">Categoría *</Form.Label>
          <Form.Select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            Enviar solicitud
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default SolicitudSocioForm;
