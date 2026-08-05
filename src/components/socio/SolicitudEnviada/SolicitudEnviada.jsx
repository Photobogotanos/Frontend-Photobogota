import { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import toast from "react-hot-toast";
import { FiSearch, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import "./SolicitudEnviada.css";
import BackButton from "@/components/common/BackButton";
import DetallesSolicitud from "./DetallesSolicitud";
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
  const archivoReenvioRef = useRef(null);
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
    archivoReenvioRef.current = null;
    setErrorReenvio("");
  };

  const handleArchivoReenvioChange = (e) => {
    archivoReenvioRef.current = e.target.files?.[0] ?? null;
  };

  // El aspirante sube su nuevo documento y esto reactiva la solicitud,
  // pasándola de vuelta a PENDIENTE para que el moderador la revise otra vez.
  const handleReenviarDocumentos = async () => {
    if (!archivoReenvioRef.current) {
      setErrorReenvio("Selecciona el archivo que quieres volver a enviar.");
      return;
    }

    setEnviandoReenvio(true);
    setErrorReenvio("");

    try {
      const { url: rutaArchivo } = await subirDocumentoAspirante(archivoReenvioRef.current);
      const tipoArchivo = archivoReenvioRef.current.type === "application/pdf" ? "pdf" : "imagen";
      const actualizada = await reenviarDocumentosAspirante(solicitudData.codigo, rutaArchivo, tipoArchivo);
      setSolicitudData(actualizada);
      archivoReenvioRef.current = null;
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

            <button type="button" onClick={handleSearch} className="search-button" disabled={cargando}>
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
            <DetallesSolicitud
              solicitudData={solicitudData}
              fechaFormateada={fechaFormateada}
              estadoLabel={estadoLabel}
              estadoVariant={estadoVariant}
              requiereCorreccion={requiereCorreccion}
              esPendiente={esPendiente}
              enviandoReenvio={enviandoReenvio}
              errorReenvio={errorReenvio}
              onArchivoReenvioChange={handleArchivoReenvioChange}
              onReenviarDocumentos={handleReenviarDocumentos}
              onReset={handleResetSearch}
            />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SolicitudEnviada;
