import Form from "react-bootstrap/Form";
import { Badge } from "react-bootstrap";
import {
  FiSearch,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiMail,
  FiPhone,
  FiUser,
  FiCalendar,
  FiTag,
  FiUploadCloud,
} from "react-icons/fi";

export default function DetallesSolicitud({
  solicitudData,
  fechaFormateada,
  estadoLabel,
  estadoVariant,
  requiereCorreccion,
  esPendiente,
  enviandoReenvio,
  errorReenvio,
  onArchivoReenvioChange,
  onReenviarDocumentos,
  onReset,
}) {
  return (
    <div className="solicitud-enviada-component">
      <div className="details-section">
        <div className="details-header">
          <FiFileText className="details-icon" />
          <h3 className="details-title">Detalles de la Solicitud</h3>
        </div>

        <div className="status-line">
          <FiClock className="status-icon" />
          <div className="status-content">
            <span className="status-label">Estado:</span>
            <Badge bg={estadoVariant}>
              {estadoLabel}
            </Badge>
          </div>
        </div>

        {requiereCorreccion && (
          <div className="next-steps mt-3" style={{ borderLeft: "4px solid #0dcaf0" }}>
            <div className="next-steps-content">
              <FiAlertCircle className="next-steps-icon" />
              <div>
                <p className="next-steps-text mb-2">
                  <strong>El moderador solicitó una corrección:</strong><br />
                  {solicitudData.motivoDecision}
                </p>
                <Form.Group className="mb-2">
                  <Form.Label className="mb-1" style={{ fontSize: "0.9rem" }}>
                    Sube el documento corregido:
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={onArchivoReenvioChange}
                    disabled={enviandoReenvio}
                  />
                </Form.Group>
                {errorReenvio && (
                  <div className="error-message mb-2">
                    <FiAlertCircle className="error-icon" />
                    <span>{errorReenvio}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="search-button"
                  onClick={onReenviarDocumentos}
                  disabled={enviandoReenvio}
                >
                  <FiUploadCloud className="btn-icon" />
                  {enviandoReenvio ? "Enviando..." : "Reenviar documento"}
                </button>
              </div>
            </div>
          </div>
        )}

        {solicitudData.estado === "APROBADO" && solicitudData.nombreUsuarioGenerado && (
          <div className="next-steps mt-3" style={{ borderLeft: "4px solid #198754" }}>
            <div className="next-steps-content">
              <FiCheckCircle className="next-steps-icon" />
              <p className="next-steps-text">
                <strong>¡Ya eres socio de PhotoBogota!</strong><br />
                Te enviamos un correo a <strong>{solicitudData.email}</strong> con tu usuario
                (<strong>{solicitudData.nombreUsuarioGenerado}</strong>), tu contraseña temporal,
                el manual del socio y el contacto de soporte por si lo necesitas.
              </p>
            </div>
          </div>
        )}

        {solicitudData.estado === "ENVIO_CREDENCIALES" && (
          <div className="next-steps mt-3" style={{ borderLeft: "4px solid #20c997" }}>
            <div className="next-steps-content">
              <FiClock className="next-steps-icon" />
              <p className="next-steps-text">
                <strong>¡Tu solicitud fue aprobada!</strong><br />
                Estamos preparando tu cuenta de socio. En breve recibirás un correo con tus
                credenciales de acceso, el manual del socio y el contacto de soporte.
              </p>
            </div>
          </div>
        )}

        {solicitudData.estado === "RECHAZADO" && solicitudData.motivoDecision && (
          <div className="next-steps mt-3" style={{ borderLeft: "4px solid #dc3545" }}>
            <div className="next-steps-content">
              <FiAlertCircle className="next-steps-icon" />
              <p className="next-steps-text">
                <strong>Motivo del rechazo:</strong><br />
                {solicitudData.motivoDecision}
              </p>
            </div>
          </div>
        )}

        <div className="info-grid-compact mt-3">
          <div className="info-row">
            <div className="info-label-with-icon">
              <FiCalendar className="info-icon" />
              <div className="info-label-small">Fecha de envío</div>
            </div>
            <div className="info-value-small">{fechaFormateada}</div>
          </div>

          <div className="info-row">
            <div className="info-label-with-icon">
              <FiFileText className="info-icon" />
              <div className="info-label-small">Razón Social</div>
            </div>
            <div className="info-value-small">{solicitudData.razonSocial}</div>
          </div>

          <div className="info-row">
            <div className="info-label-with-icon">
              <FiUser className="info-icon" />
              <div className="info-label-small">Propietario</div>
            </div>
            <div className="info-value-small">{solicitudData.nombrePropietario}</div>
          </div>

          <div className="info-row">
            <div className="info-label-with-icon">
              <FiTag className="info-icon" />
              <div className="info-label-small">Categoría</div>
            </div>
            <span className="category-tag">{solicitudData.categoria}</span>
          </div>

          <div className="info-row">
            <div className="info-label-with-icon">
              <FiMail className="info-icon" />
              <div className="info-label-small">Correo electrónico</div>
            </div>
            <div className="info-value-small">{solicitudData.email}</div>
          </div>

          <div className="info-row">
            <div className="info-label-with-icon">
              <FiPhone className="info-icon" />
              <div className="info-label-small">Teléfono</div>
            </div>
            <div className="info-value-small">{solicitudData.telefono}</div>
          </div>
        </div>
      </div>

      {esPendiente && (
        <div className="next-steps">
          <div className="next-steps-content">
            <FiAlertCircle className="next-steps-icon" />
            <p className="next-steps-text">
              Te notificaremos por correo cuando tu solicitud sea
              revisada. Proceso: <strong>hasta 7 días hábiles</strong>.
              Usa tu código para consultar el estado.
            </p>
          </div>
        </div>
      )}

      <div className="justify-content-center d-flex mt-3">
        <button type="button" className="search-button" onClick={onReset}>
          <FiSearch className="btn-icon" />
          Buscar otra solicitud
        </button>
      </div>
    </div>
  );
}
