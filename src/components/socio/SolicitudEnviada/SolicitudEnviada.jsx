import { useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Badge } from "react-bootstrap";
import toast from "react-hot-toast";
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
import "./SolicitudEnviada.css";
import BackButton from "@/components/common/BackButton";
import {
  obtenerAspirantePorCodigo,
  reenviarDocumentosAspirante,
  subirDocumentoAspirante,
} from "@/services/aspirante.service";
import { getEstadoMeta } from "@/utils/estadoAspiranteUtils";

const SolicitudEnviada = () => {
  const [solicitudData, setSolicitudData] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // Estado para el reenvío de documentos cuando la solicitud
  // fue devuelta para corrección.
  const [archivoReenvio, setArchivoReenvio] = useState(null);
  const [enviandoReenvio, setEnviandoReenvio] = useState(false);
  const [errorReenvio, setErrorReenvio] = useState("");

  const handleSearch = async () => {
    const codigo = searchId.trim();
    if (!codigo) {
      setError("Por favor ingresa un código de solicitud.");
      return;
    }

    setCargando(true);
    setError("");
    setSolicitudData(null);

    try {
      const data = await obtenerAspirantePorCodigo(codigo);
      setSolicitudData(data);
    } catch (err) {
      if (err?.response?.status === 404) {
        setError("Código de solicitud no encontrado.");
      } else {
        setError("Ocurrió un error al buscar la solicitud. Intenta de nuevo.");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleResetSearch = () => {
    setSolicitudData(null);
    setSearchId("");
    setError("");
    setArchivoReenvio(null);
    setErrorReenvio("");
  };

  // El aspirante sube su nuevo documento y esto reactiva la solicitud,
  // pasándola de vuelta a PENDIENTE para que el moderador la revise otra vez.
  const handleReenviarDocumentos = async () => {
    if (!archivoReenvio) {
      setErrorReenvio("Selecciona el archivo que quieres volver a enviar.");
      return;
    }

    setEnviandoReenvio(true);
    setErrorReenvio("");

    try {
      const { url: rutaArchivo } = await subirDocumentoAspirante(archivoReenvio);
      const tipoArchivo = archivoReenvio.type === "application/pdf" ? "pdf" : "imagen";
      const actualizada = await reenviarDocumentosAspirante(solicitudData.codigo, rutaArchivo, tipoArchivo);
      setSolicitudData(actualizada);
      setArchivoReenvio(null);
      toast.success("¡Documentos reenviados! Tu solicitud vuelve a estar en revisión.");
    } catch (err) {
      console.error("Error al reenviar documentos:", err);
      setErrorReenvio("No se pudo reenviar el documento. Intenta de nuevo.");
    } finally {
      setEnviandoReenvio(false);
    }
  };

  if (!solicitudData) {
    return (
      <div className="solicitud-search-page">
        <Container className="search-container">
          <div className="search-icon-wrapper">
            <FiSearch className="search-main-icon" />
          </div>

          <h2 className="search-title">Consultar Estado de Solicitud</h2>
          <p className="search-subtitle">
            Ingresa el código de tu solicitud para ver su estado actual y
            detalles.
          </p>

          <div className="search-form">
            <div className="input-wrapper">
              <FiSearch className="input-icon" />
              <Form.Control
                type="text"
                placeholder="Ej: SOL-123456"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
                disabled={cargando}
              />
            </div>

            <button onClick={handleSearch} className="search-button" disabled={cargando}>
              <FiSearch className="btn-icon" />
              {cargando ? "Buscando..." : "Buscar Solicitud"}
            </button>

            {error && (
              <div className="error-message">
                <FiAlertCircle className="error-icon" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="search-help">
            <p className="help-title">¿No tienes tu código?</p>
            <p className="help-text">
              El código de solicitud fue enviado a tu correo electrónico cuando
              completaste el formulario. Revisa tu bandeja de entrada o spam.
            </p>
          </div>
          <div className="justify-content-center d-flex mb-4 mt-3">
            <BackButton />
          </div>
        </Container>
      </div>
    );
  }

  const fechaFormateada = solicitudData.fechaSolicitud
    ? new Date(solicitudData.fechaSolicitud).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "No disponible";

  const { label: estadoLabel, variant: estadoVariant } = getEstadoMeta(solicitudData.estado);
  const requiereCorreccion = solicitudData.estado === "EN_CORRECCION";
  const esPendiente = solicitudData.estado === "PENDIENTE";

  return (
    <div className="solicitud-result-page mt-5">
      <Container className="result-container mt-3">
        <div className="result-card">
          <div className="result-icon-wrapper">
            <FiCheckCircle className="result-main-icon" />
          </div>

          <h2 className="result-title">¡Solicitud Encontrada!</h2>
          <p className="result-subtitle">
            Aquí tienes los detalles de tu solicitud de ingreso como socio.
          </p>

          <div className="result-code">
            <span className="code-label">Código de solicitud:</span>
            <span className="code-value">{solicitudData.codigo}</span>
          </div>

          <div className="result-details">
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

                {/* Si el moderador pidió correcciones, mostramos el motivo
                    y el formulario para volver a subir el documento */}
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
                            onChange={(e) => setArchivoReenvio(e.target.files?.[0] ?? null)}
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
                          className="search-button"
                          onClick={handleReenviarDocumentos}
                          disabled={enviandoReenvio}
                        >
                          <FiUploadCloud className="btn-icon" />
                          {enviandoReenvio ? "Enviando..." : "Reenviar documento"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Cuando ya se le crearon las credenciales, le indicamos
                    que revise su correo (nunca mostramos la contraseña aquí) */}
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
                <button className="search-button" onClick={handleResetSearch}>
                  <FiSearch className="btn-icon" />
                  Buscar otra solicitud
                </button>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SolicitudEnviada;
