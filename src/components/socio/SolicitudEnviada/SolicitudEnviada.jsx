import { useState } from "react";
import Container from "react-bootstrap/Container";
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
} from "react-icons/fi";
import "./SolicitudEnviada.css";
import BackButton from "@/components/common/BackButton";
import { obtenerAspirantePorCodigo } from "@/services/aspirante.service";

const ESTADO_LABELS = {
  PENDIENTE: "Pendiente de revisión",
  APROBADO: "Aprobada",
  RECHAZADO: "Rechazada",
};

const ESTADO_VARIANTS = {
  PENDIENTE: "warning",
  APROBADO: "success",
  RECHAZADO: "danger",
};

const SolicitudEnviada = () => {
  const [solicitudData, setSolicitudData] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

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
                placeholder="Ej: ABC-12345678"
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

  const estadoLabel = ESTADO_LABELS[solicitudData.estado] ?? solicitudData.estado;
  const estadoVariant = ESTADO_VARIANTS[solicitudData.estado] ?? "secondary";

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
                    <Badge bg={estadoVariant} className="status-badge">
                      {estadoLabel}
                    </Badge>
                  </div>
                </div>

                <div className="info-grid-compact">
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
                    <div className="info-value-small">{solicitudData.propietario}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiTag className="info-icon" />
                      <div className="info-label-small">Categoría</div>
                    </div>
                    <div>
                      <div className="info-value-small">{solicitudData.categoria}</div>
                      <span className="category-tag">{solicitudData.categoria}</span>
                    </div>
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