import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import logo from "../assets/images/logo.png";
import './SolicitudSocioForm.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Select from "react-select";


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

  const categoriaOptions = categorias.map(cat => ({
    value: cat,
    label: cat
  }));


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
          <Form.Label className="solicitud-form-label">
            Fecha de nacimiento
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>

          <Flatpickr
            options={{
              dateFormat: "Y-m-d",
              maxDate: "today",
              locale: Spanish,
              allowInput: true,
            }}
            className="form-control form-control-no-focus rounded-pill"
            value={formData.fechaNacimiento}
            onChange={(date) =>
              handleChange({
                target: { name: "fechaNacimiento", value: date[0] },
              })
            }
          />
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
          <Form.Label className="solicitud-form-label">
            Categoría{" "}
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Campo obligatorio</Tooltip>}
            >
              <span> *</span>
            </OverlayTrigger>
          </Form.Label>

          <Select
            options={categoriaOptions}
            value={categoriaOptions.find(o => o.value === formData.categoria) || null}
            onChange={(selected) =>
              handleChange({
                target: { name: "categoria", value: selected?.value || "" }
              })
            }
            menuPlacement="top"
            placeholder="Seleccione una categoría"
            classNamePrefix="react-select"
            className="react-select-container"
          />
        </Form.Group>

        <div className="solicitud-form-submit mt-5">
          <button className="solicitud-form-button rounded-pill" type="submit"><b>Enviar solicitud</b></button>
        </div>
      </Form>
    </div>
  );
};

export default SolicitudSocioForm;