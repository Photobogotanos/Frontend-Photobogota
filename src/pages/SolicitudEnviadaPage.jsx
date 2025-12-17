import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { FiSearch, FiAlertCircle, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import SolicitudEnviada from "@/components/socio/SolicitudEnviada/SolicitudEnviada";
import "./SolicitudEnviadaPage.css";

const SolicitudEnviadaPage = () => {
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
        </Container>
      </div>
    );
  }

  return (
    <div className="solicitud-result-page mt-5">
      <Container className="result-container mt-5">
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
            <span className="code-value">{solicitudData.solicitudId}</span>
          </div>

          <div className="result-details">
            <SolicitudEnviada solicitudData={solicitudData} />
          </div>

        </div>
      </Container>
    </div>
  );
};

export default SolicitudEnviadaPage;