import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./SolicitudSocioForm.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
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
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
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
    rutDocumento: null,
    autorizoUsoDatos: false,
    aceptaTerminos: false,
  });

  const [showModal, setShowModal] = useState(false);

  const categorias = [
    "Restaurante",
    "Cafetería",
    "Comercio",
    "Empresa",
    "Otro",
  ];

  const categoriaOptions = categorias.map((cat) => ({
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
      return Swal.fire(
        "Advertencia",
        "La fecha de nacimiento es obligatoria",
        "warning"
      );
    }

    if (!formData.razonSocial.trim()) {
      return Swal.fire(
        "Advertencia",
        "La razón social es obligatoria",
        "warning"
      );
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
      return Swal.fire(
        "Advertencia",
        "El nombre del propietario es obligatorio",
        "warning"
      );
    }

    if (!formData.categoria.trim()) {
      return Swal.fire(
        "Advertencia",
        "Debe seleccionar una categoría",
        "warning"
      );
    }

    if (!formData.rutDocumento) {
      return Swal.fire(
        "Advertencia",
        "Debes subir tu archivo RUT (PDF o imagen)",
        "warning"
      );
    }

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(formData.rutDocumento.type)) {
      return Swal.fire(
        "Advertencia",
        "El archivo debe ser PDF, JPG o PNG",
        "warning"
      );
    }

    if (!formData.autorizoUsoDatos) {
      return Swal.fire(
        "Advertencia",
        "Debes autorizar el uso de tus datos personales",
        "warning"
      );
    }

    if (!formData.aceptaTerminos) {
      return Swal.fire(
        "Advertencia",
        "Debes aceptar los términos y condiciones",
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
        <h2 className="solicitud-form-title">Solicitud para ser socio</h2>
        <p className="solicitud-form-subtitle">
          Completa todos los campos obligatorios *
        </p>
      </div>

      <Form className="mt-5">
        <Row>
          {/* Columna 1 */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="nombre">
                Nombre completo <MdDriveFileRenameOutline />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="email">
                Email <MdOutlineEmail />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="telefono">
                Teléfono <MdOutlinePhoneAndroid />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="telefono"
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                //Evitar caracteres no numéricos
                onBeforeInput={(e) => {
                  if (!/^\d+$/.test(e.data)) {
                    e.preventDefault();
                  }
                }}
                //Evitar pegar texto no numérico
                onPaste={(e) => {
                  const pastedText = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(pastedText)) {
                    e.preventDefault();
                  }
                }}
                className="form-control-no-focus rounded-pill input-caret-fade"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                className="solicitud-form-label"
                htmlFor="fechaNacimiento"
              >
                Fecha de nacimiento <MdDateRange />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
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
              <Form.Label
                className="solicitud-form-label"
                htmlFor="razonSocial"
              >
                Razón Social <MdOutlineFactory />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="razonSocial"
                name="razonSocial"
                value={formData.razonSocial}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="localidad">
                Localidad <PiCityDuotone />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="localidad"
                name="localidad"
                value={formData.localidad}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>
          </Col>

          {/* Columna 2 */}
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="direccion">
                Dirección <FaStreetView />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="nit">
                NIT o RUT <FaIdCard />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="nit"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                className="solicitud-form-label"
                htmlFor="propietario"
              >
                Nombre del propietario <FaUserCircle />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="propietario"
                name="propietario"
                value={formData.propietario}
                onChange={handleChange}
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="solicitud-form-label" htmlFor="categoria">
                Categoría <BiSolidCategoryAlt />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Select
                options={categoriaOptions}
                value={
                  categoriaOptions.find(
                    (o) => o.value === formData.categoria
                  ) || null
                }
                onChange={(selected) =>
                  handleChange({
                    target: { name: "categoria", value: selected?.value || "" },
                  })
                }
                placeholder="Seleccione una categoría"
                classNamePrefix="react-select"
                className="react-select-container"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label
                className="solicitud-form-label"
                htmlFor="rutDocumento"
              >
                Subir RUT (PDF o Imagen) <IoIosDocument />
                <OverlayTrigger
                  placement="right"
                  overlay={<Tooltip>Campo obligatorio</Tooltip>}
                >
                  <span> *</span>
                </OverlayTrigger>
              </Form.Label>
              <Form.Control
                id="rutDocumento"
                type="file"
                accept=".pdf, .jpg, .jpeg, .png"
                name="rutDocumento"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rutDocumento: e.target.files[0],
                  })
                }
                className="form-control-no-focus rounded-pill"
                required
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Checkboxes */}
        <Row className="mt-4">
          <Col md={12}>
            <Form.Group className="mb-3 fw-bold">
              <Form.Check
                type="checkbox"
                name="autorizoUsoDatos"
                label="Autorizo el uso de mis datos personales"
                checked={formData.autorizoUsoDatos || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    autorizoUsoDatos: e.target.checked,
                  })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-4 fw-bold">
              <Form.Check
                type="checkbox"
                name="aceptaTerminos"
                checked={formData.aceptaTerminos || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aceptaTerminos: e.target.checked,
                  })
                }
                required
                label={
                  <span className="terminos-label">
                    Acepto los{" "}
                    <span
                      className="terminos-link"
                      onClick={() => setShowModal(true)}
                    >
                      términos y condiciones
                    </span>
                  </span>
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="solicitud-form-submit mt-5">
          <button
            className="solicitud-form-button rounded-pill"
            type="submit"
            onClick={handleSubmit}
          >
            <b>
              Enviar solicitud <IoIosSend />{" "}
            </b>
          </button>
        </div>
      </Form>

      {/* Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="terms-modal"
      >
        <Modal.Header closeButton className="terms-modal-header">
          <Modal.Title className="terms-modal-title">
            <HiDocumentText size={32} />
            Términos y Condiciones
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="terms-modal-body">
          <div className="terms-content">
            <div className="terms-section">
              <h5 className="terms-section-title">
                1. Aceptación de los Términos
              </h5>
              <p className="terms-section-text">
                Al completar y enviar el presente formulario de solicitud de
                membresía, usted acepta estar obligado por estos términos y
                condiciones. Si no está de acuerdo con alguno de estos términos,
                no deberá completar la solicitud.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">2. Propósito Académico</h5>
              <p className="terms-section-text">
                Esta solicitud forma parte del proyecto de grado "Photo Bogotá",
                desarrollado con fines educativos y académicos. La información
                recopilada será utilizada exclusivamente para los propósitos del
                proyecto y su evaluación académica.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">
                3. Uso de Datos Personales
              </h5>
              <p className="terms-section-text">
                Los datos personales proporcionados en este formulario serán
                tratados de forma confidencial y utilizados únicamente para:
              </p>
              <ul className="terms-list">
                <li>Procesar su solicitud de membresía</li>
                <li>
                  Comunicarnos con usted respecto al estado de su solicitud
                </li>
                <li>Fines estadísticos y de análisis del proyecto académico</li>
                <li>
                  Cumplir con los requisitos académicos del proyecto de grado
                </li>
              </ul>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">
                4. Veracidad de la Información
              </h5>
              <p className="terms-section-text">
                El solicitante declara que toda la información proporcionada es
                veraz y exacta. Cualquier falsedad o inexactitud en los datos
                suministrados puede resultar en el rechazo de la solicitud o la
                cancelación de la membresía.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">
                5. Documentación Requerida
              </h5>
              <p className="terms-section-text">
                El archivo RUT (Registro Único Tributario) debe ser legible y
                válido. La empresa se reserva el derecho de solicitar
                documentación adicional para verificar la información
                proporcionada.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">6. Protección de Datos</h5>
              <p className="terms-section-text">
                Nos comprometemos a proteger su información personal de acuerdo
                con la Ley 1581 de 2012 de Protección de Datos Personales de
                Colombia. Sus datos no serán compartidos con terceros sin su
                consentimiento expreso, excepto cuando sea requerido por
                autoridades académicas o legales competentes.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">7. Derechos del Titular</h5>
              <p className="terms-section-text">
                Como titular de los datos, usted tiene derecho a:
              </p>
              <ul className="terms-list">
                <li>Conocer, actualizar y rectificar sus datos personales</li>
                <li>Solicitar prueba de la autorización otorgada</li>
                <li>Ser informado sobre el uso que se ha dado a sus datos</li>
                <li>
                  Revocar la autorización y/o solicitar la supresión de sus
                  datos
                </li>
              </ul>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">8. Proceso de Evaluación</h5>
              <p className="terms-section-text">
                La solicitud será evaluada por el equipo del proyecto. El tiempo
                de respuesta puede variar según el volumen de solicitudes
                recibidas. No todas las solicitudes serán necesariamente
                aprobadas.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">9. Modificaciones</h5>
              <p className="terms-section-text">
                Nos reservamos el derecho de modificar estos términos y
                condiciones en cualquier momento. Las modificaciones serán
                notificadas a través de los medios de contacto proporcionados.
              </p>
            </div>

            <div className="terms-section">
              <h5 className="terms-section-title">10. Contacto</h5>
              <p className="terms-section-text">
                Para cualquier consulta, aclaración o ejercicio de sus derechos
                relacionados con estos términos y condiciones, puede
                contactarnos a través de los medios de comunicación
                proporcionados en la plataforma del proyecto.
              </p>
            </div>

            <div className="terms-footer">
              <strong className="terms-footer-label">
                Fecha de última actualización:
              </strong>
              <span className="terms-footer-date">Noviembre 2025</span>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="terms-modal-footer">
          <Button
            variant="outline-secondary"
            onClick={() => setShowModal(false)}
            className="terms-btn-close rounded-pill"
          >
            <IoMdClose size={20} />
            Cerrar
          </Button>
          <button
            onClick={() => {
              setFormData({ ...formData, aceptaTerminos: true });
              setShowModal(false);
            }}
            className="terms-btn-accept rounded-pill"
          >
            <IoCheckmarkCircle size={20} />
            Aceptar Términos
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SolicitudSocioForm;
