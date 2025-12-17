import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { IoMdClose } from "react-icons/io";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import "./ModalTerminos.css";

const ModalTerminos = ({ showModal, setShowModal, formData, setFormData }) => {
  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      size="lg"
      centered
      className="modal-terminos-solicitud"
    >
      <Modal.Header closeButton className="modal-terminos-header">
        <h2 className="modal-terminos-titulo">
          <HiDocumentText size={32} />
          Términos y Condiciones
        </h2>
      </Modal.Header>
      <Modal.Body className="modal-terminos-body">
        <div className="modal-terminos-contenido">
          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              1. Aceptación de los Términos
            </h5>
            <p className="modal-terminos-seccion-texto">
              Al completar y enviar el presente formulario de solicitud de
              membresía, usted acepta estar obligado por estos términos y
              condiciones. Si no está de acuerdo con alguno de estos términos,
              no deberá completar la solicitud.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              2. Propósito Académico
            </h5>
            <p className="modal-terminos-seccion-texto">
              Esta solicitud forma parte del proyecto de grado "Photo Bogotá",
              desarrollado con fines educativos y académicos. La información
              recopilada será utilizada exclusivamente para los propósitos del
              proyecto y su evaluación académica.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              3. Uso de Datos Personales
            </h5>
            <p className="modal-terminos-seccion-texto">
              Los datos personales proporcionados en este formulario serán
              tratados de forma confidencial y utilizados únicamente para:
            </p>
            <ul className="modal-terminos-lista">
              <li>Procesar su solicitud de membresía</li>
              <li>Comunicarnos con usted respecto al estado de su solicitud</li>
              <li>Fines estadísticos y de análisis del proyecto académico</li>
              <li>
                Cumplir con los requisitos académicos del proyecto de grado
              </li>
            </ul>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              4. Veracidad de la Información
            </h5>
            <p className="modal-terminos-seccion-texto">
              El solicitante declara que toda la información proporcionada es
              veraz y exacta. Cualquier falsedad o inexactitud en los datos
              suministrados puede resultar en el rechazo de la solicitud o la
              cancelación de la membresía.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              5. Documentación Requerida
            </h5>
            <p className="modal-terminos-seccion-texto">
              El archivo RUT (Registro Único Tributario) debe ser legible y
              válido. La empresa se reserva el derecho de solicitar
              documentación adicional para verificar la información
              proporcionada.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              6. Protección de Datos
            </h5>
            <p className="modal-terminos-seccion-texto">
              Nos comprometemos a proteger su información personal de acuerdo
              con la Ley 1581 de 2012 de Protección de Datos Personales de
              Colombia. Sus datos no serán compartidos con terceros sin su
              consentimiento expreso, excepto cuando sea requerido por
              autoridades académicas o legales competentes.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              7. Derechos del Titular
            </h5>
            <p className="modal-terminos-seccion-texto">
              Como titular de los datos, usted tiene derecho a:
            </p>
            <ul className="modal-terminos-lista">
              <li>Conocer, actualizar y rectificar sus datos personales</li>
              <li>Solicitar prueba de la autorización otorgada</li>
              <li>Ser informado sobre el uso que se ha dado a sus datos</li>
              <li>
                Revocar la autorización y/o solicitar la supresión de sus datos
              </li>
            </ul>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">
              8. Proceso de Evaluación
            </h5>
            <p className="modal-terminos-seccion-texto">
              La solicitud será evaluada por el equipo del proyecto. El tiempo
              de respuesta puede variar según el volumen de solicitudes
              recibidas. No todas las solicitudes serán necesariamente
              aprobadas.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">9. Modificaciones</h5>
            <p className="modal-terminos-seccion-texto">
              Nos reservamos el derecho de modificar estos términos y
              condiciones en cualquier momento. Las modificaciones serán
              notificadas a través de los medios de contacto proporcionados.
            </p>
          </div>

          <div className="modal-terminos-seccion">
            <h5 className="modal-terminos-seccion-titulo">10. Contacto</h5>
            <p className="modal-terminos-seccion-texto">
              Para cualquier consulta, aclaración o ejercicio de sus derechos
              relacionados con estos términos y condiciones, puede contactarnos
              a través de los medios de comunicación proporcionados en la
              plataforma del proyecto.
            </p>
          </div>

          <div className="modal-terminos-footer">
            <strong className="modal-terminos-footer-label">
              Fecha de última actualización:
            </strong>
            <span className="modal-terminos-footer-fecha">Noviembre 2025</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="modal-terminos-footer-botones">
        <Button
          variant="outline-secondary"
          onClick={() => setShowModal(false)}
          className="modal-terminos-btn-cerrar rounded-pill"
        >
          <IoMdClose size={20} />
          Cerrar
        </Button>
        <button
          onClick={() => {
            setFormData({ ...formData, aceptaTerminos: true });
            setShowModal(false);
          }}
          className="modal-terminos-btn-aceptar rounded-pill"
        >
          <IoCheckmarkCircle size={20} />
          Aceptar Términos
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalTerminos;
