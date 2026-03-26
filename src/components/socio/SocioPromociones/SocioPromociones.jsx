import { useState } from "react";
import { Container, Row, Col, Card, Badge, Button } from "react-bootstrap";
import "./SocioPromociones.css";
import { PROMOCIONES } from "@/mocks/promocion.mock";
import { CiShoppingTag } from "react-icons/ci";
import { FaCheckCircle } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { FaCircleXmark } from "react-icons/fa6";
import { FaRegClock } from "react-icons/fa";
import { TfiStatsUp } from "react-icons/tfi";
import { BsMailbox } from "react-icons/bs";

import { Link } from "react-router-dom";


// Datos de ejemplo para las promociones
const promocionesEjemplo = [
  
];

const SocioPromociones = () => {
  const [filtroEstado, setFiltroEstado] = useState("todas");

  // Filtrar promociones según el estado seleccionado
  const promocionesFiltradas = filtroEstado === "todas"
    ? promocionesEjemplo
    : promocionesEjemplo.filter(p => p.estado === filtroEstado);

  // Obtener el color del badge según el estado
  const getBadgeColor = (estado) => {
    switch (estado) {
      case "activa":
        return "success";
      case "expirada":
        return "danger";
      case "proximamente":
        return "info";
      default:
        return "secondary";
    }
  };

  // Formatear fecha
  const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Container className="promociones-container">
      {/* Header */}
      <div className="promociones-header">
        <div className="header-info">
          <h1 className="header-titulo">
            <span className="header-icon"><CiShoppingTag /></span>
            Mis Promociones
          </h1>
          <p className="header-subtitulo">
            Gestiona y administra las ofertas y descuentos para tus clientes
          </p>
        </div>
        <Link className="btn-crear-promocion">
          + Crear Nueva Promoción
        </Link>
      </div>

      {/* Filtros */}
      <div className="filtros-promociones">
        <button
          className={`filtro-btn ${filtroEstado === "todas" ? "activo" : ""}`}
          onClick={() => setFiltroEstado("todas")}
        >
          Todas ({promocionesEjemplo.length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === "activa" ? "activo" : ""}`}
          onClick={() => setFiltroEstado("activa")}
        >
          Activas ({promocionesEjemplo.filter(p => p.estado === "activa").length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === "proximamente" ? "activo" : ""}`}
          onClick={() => setFiltroEstado("proximamente")}
        >
          Próximamente ({promocionesEjemplo.filter(p => p.estado === "proximamente").length})
        </button>
        <button
          className={`filtro-btn ${filtroEstado === "expirada" ? "activo" : ""}`}
          onClick={() => setFiltroEstado("expirada")}
        >
          Expiradas ({promocionesEjemplo.filter(p => p.estado === "expirada").length})
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <Row className="estadisticas-rapidas mb-4">
        <Col md={4}>
          <div className="stat-box">
            <div className="stat-icon-promociones" style={{ background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)" }}>
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <span className="stat-label">Promociones Activas</span>
              <span className="stat-number">
                {promocionesEjemplo.filter(p => p.estado === "activa").length}
              </span>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-box">
            <div className="stat-icon-promociones" style={{ background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)" }}>
              <TfiStatsUp />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total Usos</span>
              <span className="stat-number">
                {promocionesEjemplo.reduce((acc, p) => acc + p.usos, 0)}
              </span>
            </div>
          </div>
        </Col>
        <Col md={4}>
          <div className="stat-box">
            <div className="stat-icon-promociones" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
              <TbTargetArrow />
            </div>
            <div className="stat-content">
              <span className="stat-label">Descuentos Promedio</span>
              <span className="stat-number">31%</span>
            </div>
          </div>
        </Col>
      </Row>

      {/* Grid de promociones */}
      <Row className="promociones-grid">
        {promocionesFiltradas.map((promocion) => (
          <Col key={promocion.id} lg={6} xl={4} className="mb-4">
            <Card className={`promocion-card ${promocion.estado}`}>
              <div className="promocion-imagen-container">
                <Card.Img 
                  variant="top" 
                  src={promocion.imagen} 
                  alt={promocion.titulo}
                  className="promocion-imagen"
                />
                <Badge 
                  bg={getBadgeColor(promocion.estado)} 
                  className="promocion-badge"
                >
                  {promocion.estado === "activa" && <><FaCheckCircle /> Activa</>}
                  {promocion.estado === "expirada" && <><FaCircleXmark /> Expirada</> }
                  {promocion.estado === "proximamente" && <><FaRegClock /> Próximamente</> }
                </Badge>
                <div className="promocion-descuento">
                  {promocion.descuento} OFF
                </div>
              </div>
              
              <Card.Body className="promocion-body">
                <Card.Title className="promocion-titulo">
                  {promocion.titulo}
                </Card.Title>
                
                <Card.Text className="promocion-descripcion">
                  {promocion.descripcion}
                </Card.Text>
                
                <div className="promocion-codigo">
                  <span className="codigo-label">Código:</span>
                  <code className="codigo-valor">{promocion.codigo}</code>
                  <Button 
                    variant="link" 
                    size="sm" 
                    className="btn-copy"
                    onClick={() => navigator.clipboard.writeText(promocion.codigo)}
                  >
                    📋
                  </Button>
                </div>
                
                <div className="promocion-fechas">
                  <div className="fecha-item">
                    <span className="fecha-label">Inicio:</span>
                    <span className="fecha-valor">{formatFecha(promocion.fechaInicio)}</span>
                  </div>
                  <div className="fecha-item">
                    <span className="fecha-label">Fin:</span>
                    <span className="fecha-valor">{formatFecha(promocion.fechaFin)}</span>
                  </div>
                </div>
                
                <div className="promocion-usos">
                  <div className="usos-info">
                    <span>Usos: {promocion.usos} / {promocion.usosMaximos}</span>
                    <span className="usos-porcentaje">
                      {Math.round((promocion.usos / promocion.usosMaximos) * 100)}%
                    </span>
                  </div>
                  <div className="usos-bar">
                    <div 
                      className="usos-progress" 
                      style={{ 
                        width: `${(promocion.usos / promocion.usosMaximos) * 100}%`,
                        background: promocion.usos >= promocion.usosMaximos 
                          ? "#ef4444" 
                          : "var(--color-primary)"
                      }}
                    />
                  </div>
                </div>
                
                <div className="promocion-acciones">
                  <Button variant="outline-primary" size="sm" className="btn-editar">
                    ✏️ Editar
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="btn-duplicar">
                    📋 Duplicar
                  </Button>
                  {promocion.estado === "activa" && (
                    <Button variant="outline-danger" size="sm" className="btn-desactivar">
                      ✕ Desactivar
                    </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mensaje si no hay resultados */}
      {promocionesFiltradas.length === 0 && (
        <div className="no-resultados">
          <div className="no-resultados-icon"><BsMailbox /></div>
          <h3>No se encontraron promociones</h3>
          <p>No hay promociones con el filtro seleccionado.</p>
        </div>
      )}
    </Container>
  );
};

export default SocioPromociones;
