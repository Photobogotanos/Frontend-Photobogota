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

// Importar servicio

import { crearAspirante } from "@/services/aspirante.service";

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
  const [cargando, setCargando] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar formulario
    const validation = validateForm(formData);
    if (!validation.valido) {
      return Swal.fire("Advertencia", validation.mensaje, "warning");
    }

    setCargando(true);

    try {
      // Mapear campos del formulario al DTO del backend
      const solicitudData = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        nit: formData.nit,
        // El DTO usa "fechaNacimiento" como LocalDate (YYYY-MM-DD)
        fechaNacimiento: formData.fechaNacimiento,
        // El formulario usa "propietario", el DTO usa "nombrePropietario"
        nombrePropietario: formData.propietario,
        razonSocial: formData.razonSocial,
        categoria: formData.categoria,
        localidad: formData.localidad,
        rutaArchivo: null,
        tipoArchivo: null,
      };

      const respuesta = await crearAspirante(solicitudData);

      // Guardar ID de solicitud para la pantalla de consulta
      localStorage.setItem("solicitudId", respuesta.id);

      Swal.fire({
        icon: "success",
        title: "Solicitud enviada",
        text: "Tu información ha sido enviada correctamente.",
        confirmButtonText: "Aceptar",
      }).then(() => {
        navigate("/solicitud-enviada");
      });

    } catch (error) {
      // Manejo de errores de validación del backend (400)
      if (error.response?.status === 400) {
        const mensajes = error.response?.data?.errors;
        const texto = mensajes
          ? Object.values(mensajes).join("\n")
          : error.response?.data?.message || "Datos inválidos. Revisa el formulario.";

        Swal.fire({
          icon: "warning",
          title: "Datos inválidos",
          text: texto,
          confirmButtonText: "Aceptar",
        });

      // Email duplicado (409)
      } else if (error.response?.status === 409) {
        Swal.fire({
          icon: "warning",
          title: "Email ya registrado",
          text: "Ya existe una solicitud con este correo electrónico.",
          confirmButtonText: "Aceptar",
        });

      // Error de servidor o red
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.response?.data?.message || "No se pudo enviar la solicitud. Intenta de nuevo.",
          confirmButtonText: "Aceptar",
        });
      }
    } finally {
      setCargando(false);
    }
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
            disabled={cargando}
          >
            <FaSearch className="btn-icon" />
            Consultar solicitud
          </button>

          <button
            className="solicitud-form-button rounded-pill"
            type="submit"
            onClick={handleSubmit}
            disabled={cargando}
          >
            <IoIosSend className="btn-icon" />
            <b>{cargando ? "Enviando..." : "Enviar solicitud"}</b>
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