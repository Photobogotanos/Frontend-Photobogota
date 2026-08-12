import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaStore, FaPlus, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import { obtenerMisLocales } from "@/services/spot.service";
import { useAuth } from "@/context/AuthContext";
import "./SocioLocales.css";

// Red de seguridad cliente mientras el backend termina de implementar el
// contrato (GET /spots?tipo=LOCAL&mios=true): nunca muestra locales que no
// pertenezcan a la cuenta logueada.
const esLocalPropio = (local, usuarioLogueado) => {
  const tipo = (local.tipo || "").toUpperCase();
  if (tipo !== "LOCAL") return false;

  const identificadoresSpot = [
    local.creador?.nombreUsuario,
    local.creador?.username,
    local.creadorId,
    local.creadorUsername,
    local.nombreUsuarioCreador,
    local.usernameCreador,
  ]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());

  const identificadoresUsuario = [
    usuarioLogueado?.id,
    usuarioLogueado?.username?.replace(/^@/, ""),
    usuarioLogueado?.nombreUsuario,
    usuarioLogueado?.nombre,
  ]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());

  const identificadoresUsuarioSet = new Set(identificadoresUsuario);

  // Sin identificador de creador ni de usuario activo: confiamos en el filtro
  // mios del backend y no descartamos el local.
  if (identificadoresSpot.length === 0 || identificadoresUsuario.length === 0) {
    return true;
  }

  return identificadoresSpot.some((creador) =>
    identificadoresUsuarioSet.has(creador),
  );
};

export default function SocioLocales() {
  const { usuario } = useAuth();
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const cargarLocales = async () => {
      setCargando(true);

      try {
        // Contrato con backend: GET /spots?tipo=LOCAL&mios=true (sin mocks).
        // Si no hay locales responde lista vacía y se muestra el estado vacío.
        const resultado = await obtenerMisLocales();

        if (cancelado) return;

        const lista = (resultado.datos || []).filter((item) =>
          esLocalPropio(item, usuario),
        );

        setLocales(lista);
      } catch (err) {
        if (cancelado) return;
        console.error("Error al cargar locales propios:", err);
        setLocales([]);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarLocales();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo se cargan al montar
  }, []);

  // ── Cargando ──────────────────────────────────────────────
  if (cargando) {
    return (
      <div className="locales-estado text-center py-5">
        <Spinner animation="border" role="status" style={{ color: "#806fbe" }} />
        <p className="text-muted mt-3 mb-0">Cargando tus locales...</p>
      </div>
    );
  }

  // ── Sin locales ───────────────────────────────────────────
  if (locales.length === 0) {
    return (
      <div className="locales-container">
        <div className="locales-header">
          <span className="locales-top-text">Mis establecimientos</span>
          <div className="locales-title-group">
            <h1 className="locales-titulo">
              <FaStore className="locales-header-icon" />
              Mis Locales
            </h1>
            <p className="locales-subtitulo">
              Administra los establecimientos asociados a tu cuenta de socio
            </p>
          </div>
          <span className="locales-header-line" />
        </div>

        <div className="locales-vacio">
          <FaStore className="locales-vacio-icon" />
          <p className="locales-vacio-texto mb-0">
            <strong>Aún no tienes locales registrados,</strong> puedes
            intentar creando tu primer local.
          </p>
          <Link
            to="/crear-spot"
            className="btn btn-sm locales-vacio-btn"
          >
            <FaPlus className="me-1" />
            Crear mi primer local
          </Link>
        </div>
      </div>
    );
  }

  // ── Lista de locales ──────────────────────────────────────
  return (
    <div className="locales-container">
      <div className="locales-header">
        <span className="locales-top-text">Mis establecimientos</span>
        <div className="locales-title-group">
          <h1 className="locales-titulo">
            <FaStore className="locales-header-icon" />
            Mis Locales
          </h1>
          <p className="locales-subtitulo">
            Administra los establecimientos asociados a tu cuenta de socio
          </p>
        </div>
        <span className="locales-header-line" />
      </div>

      <Row className="g-3">
        {locales.map((local) => {
          const imagen =
            local.imagen ||
            local.imagenes?.[0] ||
            "/images/spots/spot-demo.jpg";

          return (
            <Col key={local.id} xs={12} md={6} lg={4}>
              <Card className="local-card h-100">
                <div className="local-card-img-wrap">
                  <Card.Img
                    variant="top"
                    src={imagen}
                    alt={local.nombre}
                    className="local-card-img"
                  />
                </div>
                <Card.Body>
                  <Card.Title className="local-card-title">
                    {local.nombre}
                  </Card.Title>

                  {local.direccion && (
                    <p className="local-card-meta mb-1">
                      <FaMapMarkerAlt className="me-1" />
                      {local.direccion}
                    </p>
                  )}

                  {(local.telefono || local.horario) && (
                    <div className="local-card-extra text-muted small mb-2">
                      {local.telefono && (
                        <span className="d-block">
                          <FaPhone className="me-1" />
                          {local.telefono}
                        </span>
                      )}
                      {local.horario && (
                        <span className="d-block">
                          <FaClock className="me-1" />
                          {local.horario}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-2">
                    <Button
                      as={Link}
                      to={`/spot/${local.id}`}
                      variant="outline-secondary"
                      size="sm"
                      style={{
                        background: "#806fbe",
                        color: "#fff",
                        border: "none",
                      }}
                    >
                      Ver detalle
                    </Button>
                    <Button
                      as={Link}
                      to="/crear-promocion"
                      variant="outline-secondary"
                      size="sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #fff3e0, #ffe0b2)",
                        color: "#e65100",
                        border: "1px solid #ffb74d",
                      }}
                    >
                      Crear promoción
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};