import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Swal from "sweetalert2";
import { IoIosSend } from "react-icons/io";
import { FaSearch } from "react-icons/fa";

// Importar componentes
import HeaderSolicitudSocio from "./HeaderSolicitudSocio";
import InformacionPersonal from "./InformacionPersonal";
import InformacionNegocio from "./InformacionNegocio";
import FormCheckboxes from "./FormCheckboxes";
import ModalTerminos from "./ModalTerminos";

// Importar validaciones
import validateForm from "@/utils/validacionesSolicitudSocio";

// Importar estilos
import "./SolicitudSocioForm.css";

// Constantes
const CATEGORIAS = ["Restaurante", "Cafetería", "Comercio", "Empresa", "Otro"];

const INITIAL_FORM_STATE = {
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
  fechaNacimiento: "",
  razonSocial: "",
  localidad: "",
  direccion: "",
  nit: "",
  propietario: "",
  categoria: "",
  rutDocumento: null,
  autorizoUsoDatos: false,
  aceptaTerminos: false,
};

const SolicitudSocioForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [showModal, setShowModal] = useState(false);

  const categoriaOptions = CATEGORIAS.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = validateForm(formData);
    
    if (!validation.valido) {
      return Swal.fire("Advertencia", validation.mensaje, "warning");
    }

    // Preparar datos para guardar
    const fechaEnvio = new Date().toLocaleString();
    const solicitudId = `SOL-${Date.now().toString().slice(-8)}`;

    const dataToSave = {
      ...formData,
      fechaEnvio,
      solicitudId,
    };

    localStorage.setItem("solicitudSocio", JSON.stringify(dataToSave));
    
    Swal.fire({
      icon: "success",
      title: "Solicitud enviada",
      text: "Tu información ha sido enviada correctamente.",
      confirmButtonText: "Aceptar",
    }).then(() => {
      navigate("/solicitud-enviada");
    });
  };

  const handleConsultarClick = () => {
    navigate("/solicitud-enviada");
  };

  return (
    <div className="solicitud-socio-form">
      <HeaderSolicitudSocio />

      <Form className="mt-5">
        <Row>
          {/* Columna 1: Información Personal */}
          <Col md={6}>
            <InformacionPersonal
              formData={formData}
              handleChange={handleChange}
            />
          </Col>

          {/* Columna 2: Información Empresarial */}
          <Col md={6}>
            <InformacionNegocio
              formData={formData}
              handleChange={handleChange}
              categoriaOptions={categoriaOptions}
              setFormData={setFormData}
            />
          </Col>
        </Row>

        {/* Checkboxes */}
        <Row className="mt-4">
          <Col md={12}>
            <FormCheckboxes
              formData={formData}
              setFormData={setFormData}
              setShowModal={setShowModal}
            />
          </Col>
        </Row>

        {/* Botones */}
        <div className="solicitud-form-submit mt-4">
          <button
            className="btn-consultar rounded-pill"
            type="button"
            onClick={handleConsultarClick}
          >
            <FaSearch className="btn-icon" />
            Consultar solicitud
          </button>

          <button
            className="solicitud-form-button rounded-pill"
            type="submit"
            onClick={handleSubmit}
          >
            <IoIosSend className="btn-icon" />
            <b>Enviar solicitud</b>
          </button>
        </div>
      </Form>

      {/* Modal de Términos */}
      <ModalTerminos
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
};

export default SolicitudSocioForm;