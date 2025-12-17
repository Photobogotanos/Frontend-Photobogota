import { useState, useEffect } from "react";
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

const SolicitudEnviada = () => {
  const [solicitudData, setSolicitudData] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("solicitudSocio");
    if (data) {
      const parsed = JSON.parse(data);

      if (!parsed.solicitudId) {
        const newId = `SOL-${Date.now().toString().slice(-8)}`;
        const updatedData = { ...parsed, solicitudId: newId };
        localStorage.setItem("solicitudSocio", JSON.stringify(updatedData));
        setSolicitudData(updatedData);
      } else {
        setSolicitudData(parsed);
      }
    }
  }, []);

  const handleSearch = () => {
    const data = localStorage.getItem("solicitudSocio");
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.solicitudId === searchId.trim()) {
        setSolicitudData(parsed);
        setError("");
      } else {
        setError("Código de solicitud no encontrado.");
      }
    } else {
      setError("No hay solicitudes registradas.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
                placeholder="Ej: SOL-12345678"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="search-input"
              />
            </div>

            <button onClick={handleSearch} className="search-button">
              <FiSearch className="btn-icon" />
              Buscar Solicitud
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

  const solicitudId =
    solicitudData.solicitudId || `SOL-${Date.now().toString().slice(-8)}`;
  const fechaActual =
    solicitudData.fechaEnvio ||
    new Date().toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

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
            <span className="code-value">{solicitudId}</span>
          </div>

          <div className="result-details">
            <div className="solicitud-enviada-component">
              {/* Detalles de la Solicitud - Grid compacto */}
              <div className="details-section">
                <div className="details-header">
                  <FiFileText className="details-icon" />
                  <h3 className="details-title">Detalles de la Solicitud</h3>
                </div>

                {/* Estado - En una línea */}
                <div className="status-line">
                  <FiClock className="status-icon" />
                  <div className="status-content">
                    <span className="status-label">Estado:</span>
                    <Badge className="status-badge">
                      Pendiente de revisión
                    </Badge>
                  </div>
                </div>

                <div className="info-grid-compact">
                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiCalendar className="info-icon" />
                      <div className="info-label-small">Fecha de envío</div>
                    </div>
                    <div className="info-value-small">{fechaActual}</div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiFileText className="info-icon" />
                      <div className="info-label-small">Razón Social</div>
                    </div>
                    <div className="info-value-small">
                      {solicitudData.razonSocial}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiUser className="info-icon" />
                      <div className="info-label-small">Propietario</div>
                    </div>
                    <div className="info-value-small">
                      {solicitudData.propietario}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiTag className="info-icon" />
                      <div className="info-label-small">Categoría</div>
                    </div>
                    <div>
                      <div className="info-value-small">
                        {solicitudData.categoria}
                      </div>
                      <span className="category-tag">
                        {solicitudData.categoria}
                      </span>
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiMail className="info-icon" />
                      <div className="info-label-small">Correo electrónico</div>
                    </div>
                    <div className="info-value-small">
                      {solicitudData.email}
                    </div>
                  </div>

                  <div className="info-row">
                    <div className="info-label-with-icon">
                      <FiPhone className="info-icon" />
                      <div className="info-label-small">Teléfono</div>
                    </div>
                    <div className="info-value-small">
                      {solicitudData.telefono}
                    </div>
                  </div>
                </div>
              </div>

              {/* Próximos pasos - Compacto */}
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
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SolicitudEnviada;
