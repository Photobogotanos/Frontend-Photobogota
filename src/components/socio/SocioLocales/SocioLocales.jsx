import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { FaStore, FaPlus, FaMapMarkerAlt, FaPhone, FaClock, FaPen, FaToggleOn, FaToggleOff } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import { obtenerMisLocales, cambiarVisibilidadLocal } from "@/services/spot.service";
import { esLocalPropio, esLocalDeshabilitado } from "@/utils/spot.util";
import { useAuth } from "@/context/AuthContext";
import "./SocioLocales.css";

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

  const manejarVisibilidad = async (local) => {
    const deshabilitado = esLocalDeshabilitado(local);

    const confirmacion = await Swal.fire({
      title: deshabilitado ? "¿Habilitar este local?" : "¿Deshabilitar este local?",
      text: deshabilitado
        ? "El local volverá a aparecer en el mapa para todos los usuarios."
        : "El local dejará de aparecer en el mapa público. Podrás habilitarlo de nuevo desde aquí cuando quieras.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: deshabilitado ? "Sí, habilitar" : "Sí, deshabilitar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: deshabilitado ? "#28a745" : "#dc3545",
      reverseButtons: true,
    });

    if (!confirmacion.isConfirmed) return;

    const resultado = await cambiarVisibilidadLocal(local.id);

    if (resultado.exitoso) {
      setLocales((prev) =>
        prev.map((l) =>
          l.id === local.id
            ? { ...l, deshabilitado: resultado.deshabilitado }
            : l,
        ),
      );
      toast.success(resultado.mensaje || "Visibilidad actualizada");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          resultado.mensaje ||
          "No se pudo cambiar la visibilidad del local.",
        confirmButtonColor: "#806fbe",
      });
    }
  };

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
          const deshabilitado = esLocalDeshabilitado(local);
          const imagen =
            local.imagen ||
            local.imagenes?.[0] ||
            "/images/spots/spot-demo.webp";

          return (
            <Col key={local.id} xs={12} md={6} lg={4}>
              <Card className={`local-card h-100${deshabilitado ? " deshabilitado" : ""}`}>
                <div className="local-card-img-wrap">
                  {deshabilitado && (
                    <span className="local-card-badge">Local deshabilitado</span>
                  )}
                  <Card.Img
                    variant="top"
                    src={imagen}
                    alt={local.nombre}
                    className={`local-card-img${deshabilitado ? " deshabilitada" : ""}`}
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

                  <div className="d-flex flex-wrap gap-2 mt-2">
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
                      to={`/editar-local/${local.id}`}
                      variant="outline-secondary"
                      size="sm"
                      style={{
                        background: "#fff",
                        color: "#3b3f45",
                        border: "1px solid #ced4da",
                      }}
                    >
                      <FaPen className="me-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => manejarVisibilidad(local)}
                      style={
                        deshabilitado
                          ? {
                              background: "#28a745",
                              color: "#fff",
                              border: "none",
                            }
                          : {
                              background: "#fff3cd",
                              color: "#8a6d1a",
                              border: "1px solid #ffe08a",
                            }
                      }
                    >
                      {deshabilitado ? (
                        <>
                          <FaToggleOn className="me-1" />
                          Habilitar
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="me-1" />
                          Deshabilitar
                        </>
                      )}
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