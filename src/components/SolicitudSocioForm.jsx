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
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdOutlineFactory } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { PiCityDuotone } from "react-icons/pi";
import { FaStreetView } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { IoIosDocument } from "react-icons/io";
import { IoIosSend } from "react-icons/io";
import Swal from "sweetalert2";


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
    categoria: "",
    rutFile: null,
    autorizo: false
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

    // Validaciones
    if (!formData.nombre.trim()) {
      return Swal.fire("Advertencia", "El nombre es obligatorio", "warning");
    }

    if (!formData.email.trim()) {
      return Swal.fire("Advertencia", "El email es obligatorio", "warning");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return Swal.fire("Error", "El correo electrónico no es válido", "error");
    }

    if (!formData.telefono.trim()) {
      return Swal.fire("Advertencia", "El teléfono es obligatorio", "warning");
    }

    const phoneRegex = /^[0-9]{7,10}$/;
    if (!phoneRegex.test(formData.telefono)) {
      return Swal.fire(
        "Advertencia",
        "El teléfono debe contener solo números (7-10 dígitos)",
        "warning"
      );
    }

    if (!formData.fechaNacimiento) {
      return Swal.fire("Advertencia", "La fecha de nacimiento es obligatoria", "warning");
    }

    if (!formData.razonSocial.trim()) {
      return Swal.fire("Advertencia", "La razón social es obligatoria", "warning");
    }

    if (!formData.localidad.trim()) {
      return Swal.fire("Advertencia", "La localidad es obligatoria", "warning");
    }

    if (!formData.direccion.trim()) {
      return Swal.fire("Advertencia", "La dirección es obligatoria", "warning");
    }

    if (!formData.nit.trim()) {
      return Swal.fire("Advertencia", "El NIT es obligatorio", "warning");
    }

    if (!formData.propietario.trim()) {
      return Swal.fire("Advertencia", "El nombre del propietario es obligatorio", "warning");
    }

    if (!formData.categoria.trim()) {
      return Swal.fire("Advertencia", "Debe seleccionar una categoría", "warning");
    }

    if (!formData.rutFile) {
      return Swal.fire("Advertencia", "Debes subir tu archivo RUT (PDF o imagen)", "warning");
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(formData.rutFile.type)) {
      return Swal.fire(
        "Advertencia",
        "El archivo debe ser PDF, JPG o PNG",
        "warning"
      );
    }

    if (!formData.autorizo) {
      return Swal.fire(
        "Advertencia",
        "Debes autorizar el uso de tus datos personales",
        "warning"
      );
    }

    Swal.fire({
      icon: "success",
      title: "Solicitud enviada",
      text: "Tu información ha sido enviada correctamente.",
      confirmButtonText: "Aceptar",
    });

    console.log("Datos enviados:", formData);
  };


  return (
    <div>
      <div className="solicitud-form-header">
        <img src={logo} alt="Logo" className="solicitud-form-logo" />
        <h2 className="solicitud-form-title">Solicitud para ser socio</h2>
        <p className="solicitud-form-subtitle">Completa todos los campos obligatorios *</p>
      </div>

      <Form className="mt-5">
        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre completo{" "} <MdDriveFileRenameOutline />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="nombre" value={formData.nombre} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Email{" "} <MdOutlineEmail />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Teléfono{" "}  <MdOutlinePhoneAndroid />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control type="number" name="telefono" value={formData.telefono} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">
            Fecha de nacimiento{" "} <MdDateRange />
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
          <Form.Label className="solicitud-form-label">Razón Social{" "} <MdOutlineFactory />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="razonSocial" value={formData.razonSocial} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Localidad{" "} <PiCityDuotone />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="localidad" value={formData.localidad} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Dirección{" "} <FaStreetView />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="direccion" value={formData.direccion} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">NIT o RUT{" "} <FaIdCard />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="nit" value={formData.nit} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">Nombre del propietario{" "} <FaUserCircle />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}><span> *</span></OverlayTrigger>
          </Form.Label>
          <Form.Control name="propietario" value={formData.propietario} onChange={handleChange} className="form-control-no-focus rounded-pill" required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">
            Categoría{" "} <BiSolidCategoryAlt />
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

        <Form.Group className="mb-3">
          <Form.Label className="solicitud-form-label">
            Subir RUT (PDF o Imagen){" "} <IoIosDocument />
            <OverlayTrigger placement="right" overlay={<Tooltip>Campo obligatorio</Tooltip>}>
              <span> *</span>
            </OverlayTrigger>
          </Form.Label>

          <Form.Control
            type="file"
            accept=".pdf, .jpg, .jpeg, .png"
            name="rutFile"
            onChange={(e) =>
              setFormData({
                ...formData,
                rutFile: e.target.files[0]
              })
            }
            className="form-control-no-focus rounded-pill"
            required
          />
        </Form.Group>

        <Form.Group className="mb-4 fw-bold">
          <Form.Check
            type="checkbox"
            name="autorizo"
            label="Autorizo el uso de mis datos personales"
            checked={formData.autorizo || false}
            onChange={(e) =>
              setFormData({
                ...formData,
                autorizo: e.target.checked
              })
            }
            required
          />
        </Form.Group>


        <div className="solicitud-form-submit mt-5">
          <button className="solicitud-form-button rounded-pill" type="submit"><b>Enviar solicitud <IoIosSend /> </b></button> 
        </div>
      </Form>
    </div>
  );
};

export default SolicitudSocioForm;