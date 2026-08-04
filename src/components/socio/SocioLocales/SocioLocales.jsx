import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaStore, FaPlus, FaMapMarkerAlt, FaPhone, FaClock } from "react-icons/fa";
import { obtenerSpots } from "@/services/spot.service";
import "./SocioLocales.css";

export default function SocioLocales() {
const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;

    const cargarLocales = async () => {
      setCargando(true);
      setError(null);

      try {
        // Pide al backend solo los del socio logueado y tipo LOCAL
        // Ajusta los params a lo que acepte tu API (mios, creadorId, tipo, etc.)
        const resultado = await obtenerSpots({ tipo: "LOCAL", mios: true });

        if (cancelado) return;

        if (!resultado.exitoso) {
          setError(resultado.mensaje || "No se pudieron cargar los locales.");
          setLocales([]);
          return;
        }

        const lista = (resultado.datos || []).filter(
          (item) =>
            item.tipo === "LOCAL" ||
            item.tipo === "local" ||
            // si el backend aún no manda tipo, confía en el filtro mios
            resultado.esMock
              ? item.rol === "SOCIO" || item.tipo === "LOCAL"
              : true
        );

        setLocales(lista);
      } catch (err) {
        if (cancelado) return;
        console.error("Error al cargar locales:", err);
        setError("Ocurrió un error al cargar tus locales.");
        setLocales([]);
      } finally {
        if (!cancelado) setCargando(false);
      }
    };

    cargarLocales();
    return () => {
      cancelado = true;
    };
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

  // ── Error de red / backend ────────────────────────────────
  if (error) {
    return (
      <div className="locales-estado alert alert-danger mb-4">
        <strong>No se pudieron cargar los locales.</strong>
        <p className="mb-0">{error}</p>
      </div>
    );
  }

  // ── Sin locales (mismo estilo que PromoLocal) ─────────────
  if (locales.length === 0) {
    return (
      <div className="locales-vacio">
        <div className="alert alert-warning mb-4">
          <strong>No tienes locales creados.</strong>
          <p className="mb-2">
            Crea tu primer local para que aparezca aquí y puedas asociarle
            promociones.
          </p>
          <Link
            to="/crear-spot"
            className="btn btn-sm"
            style={{ background: "#806fbe", color: "#fff", border: "none" }}
          >
            <FaPlus className="me-1" />
            Crear local
          </Link>
        </div>
      </div>
    );
  }

  // ── Lista de locales ──────────────────────────────────────
  return (
    <div className="locales-container">
      <div className="locales-header d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="locales-titulo mb-1">
            <FaStore className="me-2" />
            Mis Locales
          </h1>
          <p className="text-muted mb-0">
            Administra los establecimientos asociados a tu cuenta de socio
          </p>
        </div>
        <Link
          to="/crear-spot"
          className="btn"
          style={{ background: "#806fbe", color: "#fff", border: "none" }}
        >
          <FaPlus className="me-1" />
          Crear local
        </Link>
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
                      variant="outline-primary"
                      size="sm"
                    >
                      Ver detalle
                    </Button>
                    <Button
                      as={Link}
                      to="/crear-promocion"
                      variant="outline-secondary"
                      size="sm"
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