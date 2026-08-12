import { useCallback, useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import "./SocioPromociones.css";
import { CiShoppingTag } from "react-icons/ci";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  obtenerPromocionesMias,
  desactivarPromocion,
  duplicarPromocion,
  eliminarPromocion,
} from "@/services/promocion.service";
import FiltrosPromociones from "./FiltrosPromociones";
import PromocionStats from "./PromocionStats";
import PromocionCard from "./PromocionCard";
import PromocionesVacio from "./PromocionesVacio";

// Extrae la parte numérica de un descuento como "50%" -> 50
const numeroDescuento = (descuento) => {
  if (!descuento) return null;
  const match = String(descuento).match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : null;
};

const SocioPromociones = () => {
  const navigate = useNavigate();
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todas");

  const cargar = useCallback(async () => {
    setCargando(true);
    const resultado = await obtenerPromocionesMias();
    if (resultado.exitoso) {
      setPromociones(resultado.datos || []);
    } else {
      toast.error(resultado.mensaje);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- cargar() es async; el setState ocurre solo tras el await del servicio
    cargar();
  }, [cargar]);

  const promocionesFiltradas =
    filtroEstado === "todas"
      ? promociones
      : promociones.filter((p) => p.estado?.toUpperCase() === filtroEstado);

  const contarPorEstado = (estado) =>
    estado === "todas"
      ? promociones.length
      : promociones.filter((p) => p.estado?.toUpperCase() === estado).length;

  const totalUsos = promociones.reduce((acc, p) => acc + (p.usos || 0), 0);

  const descuentos = promociones
    .map((p) => numeroDescuento(p.descuento))
    .filter((n) => n !== null && n !== undefined);
  const descuentoPromedio =
    descuentos.length > 0
      ? `${Math.round(descuentos.reduce((a, b) => a + b, 0) / descuentos.length)}%`
      : "—";

  const handleEditar = (promocion) => {
    navigate(`/crear-promocion?id=${promocion.id}`);
  };

  const handleToggle = async (promocion) => {
    const resultado = await desactivarPromocion(promocion.id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleDuplicar = async (promocion) => {
    const resultado = await duplicarPromocion(promocion.id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleEliminar = async (promocion) => {
    const resultado = await eliminarPromocion(promocion.id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      cargar();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <Container className="promociones-container">
      <div className="promociones-header">
        <div className="promociones-header-superior">
          <div className="header-info">
            <span className="promociones-top-text">Mis ofertas</span>
            <h1 className="header-titulo">
              <span className="header-icon"><CiShoppingTag /></span>
              Mis Promociones
            </h1>
            <p className="header-subtitulo">
              Gestiona y administra las ofertas y descuentos para tus clientes
            </p>
          </div>
          <Link
            to="/crear-promocion"
            className="btn-crear-promocion"
            aria-label="Crear nueva promoción"
          >
            <FaPlus />
            <span className="texto-completo">Crear Promoción</span>
            <span className="texto-corto"></span>
          </Link>
        </div>
        <span className="promociones-header-line" />
      </div>

      {cargando && promociones.length === 0 ? (
        <div className="promociones-cargando text-center py-5">
          <Spinner animation="border" role="status" style={{ color: "#806fbe" }} />
          <p className="text-muted mt-3 mb-0">Cargando tus promociones...</p>
        </div>
      ) : (
        <>
          <FiltrosPromociones
            filtroEstado={filtroEstado}
            onChange={setFiltroEstado}
            contarPorEstado={contarPorEstado}
          />

          <PromocionStats
            activas={contarPorEstado("ACTIVA")}
            totalUsos={totalUsos}
            descuentoPromedio={descuentoPromedio}
          />

          <Row className="promociones-grid">
            {promocionesFiltradas.map((promocion) => (
              <Col key={promocion.id} lg={6} xl={4} className="mb-4">
                <PromocionCard
                  promocion={promocion}
                  onEditar={handleEditar}
                  onDuplicar={handleDuplicar}
                  onToggle={handleToggle}
                  onEliminar={handleEliminar}
                />
              </Col>
            ))}
          </Row>

          {promocionesFiltradas.length === 0 && <PromocionesVacio />}
        </>
      )}
    </Container>
  );
};

export default SocioPromociones;