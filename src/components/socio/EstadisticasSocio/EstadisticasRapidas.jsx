import { Row, Col, Card } from "react-bootstrap";
import { FaEye, FaStar, FaStarHalfAlt, FaTicketAlt } from "react-icons/fa";

const formatearNumero = (valor) => (Number(valor) || 0).toLocaleString("es-CO");

const formatearPorcentaje = (valor) => {
  const v = Number(valor) || 0;
  const signo = v > 0 ? "+" : "";
  return `${signo}${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}%`;
};

const EstadisticasRapidas = ({ kpis }) => {
  const data = kpis || {};

  const calificacion = Number(data.calificacionPromedio) || 0;
  const calificacionCambio = Number(data.calificacionCambio) || 0;
  const calificacionCambioTexto = `${calificacionCambio > 0 ? "+" : ""}${calificacionCambio.toFixed(1)}`;

  const positivo = (valor) => (Number(valor) || 0) >= 0;

  const estadisticasRapidas = [
    {
      id: "stat-visitas",
      titulo: "Visitas Totales",
      valor: formatearNumero(data.visitas),
      cambio: formatearPorcentaje(data.visitasCambio),
      positivo: positivo(data.visitasCambio),
      icono: <FaEye />,
      color: "#806fbe",
    },
    {
      id: "stat-resenas",
      titulo: "Reseñas Recibidas",
      valor: formatearNumero(data.resenas),
      cambio: formatearPorcentaje(data.resenasCambio),
      positivo: positivo(data.resenasCambio),
      icono: <FaStar />,
      color: "#f39c12",
    },
    {
      id: "stat-calificacion",
      titulo: "Calificación Promedio",
      valor: calificacion ? calificacion.toFixed(1) : "—",
      cambio: calificacionCambioTexto,
      positivo: positivo(calificacionCambio),
      icono: <FaStarHalfAlt />,
      color: "#27ae60",
    },
    {
      id: "stat-usos",
      titulo: "Usos de Promociones",
      valor: formatearNumero(data.usosPromociones),
      cambio: formatearPorcentaje(data.usosPromocionesCambio),
      positivo: positivo(data.usosPromocionesCambio),
      icono: <FaTicketAlt />,
      color: "#3498db",
    },
  ];

  return (
    <Row className="estadisticas-rapidas">
      {estadisticasRapidas.map((stat) => (
        <Col key={stat.id} xs={12} sm={6} lg={3}>
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icono}
              </div>
              <div className="stat-info-socio">
                <span className="stat-titulo">{stat.titulo}</span>
                <span className="stat-valor">{stat.valor}</span>
                <span className={`stat-cambio ${stat.positivo ? "positivo" : "negativo"}`}>
                  {stat.cambio}
                </span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default EstadisticasRapidas;