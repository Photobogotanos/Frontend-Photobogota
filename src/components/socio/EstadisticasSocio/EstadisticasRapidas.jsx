import { Row, Col, Card } from "react-bootstrap";
import { FaEye, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const EstadisticasRapidas = ({ periodo }) => {
  // Datos que cambian según el período seleccionado
  const getDataByPeriodo = () => {
    switch (periodo) {
      case "semana":
        return {
          visitas: "2,147",
          visitasCambio: "+5.2%",
          resenas: "127",
          resenasCambio: "+3.1%",
          calificacion: "4.3",
          calificacionCambio: "+0.1",
          resenasNuevas: "12",
          resenasNuevasCambio: "+8.5%",
        };
      case "ano":
        return {
          visitas: "89,432",
          visitasCambio: "+45.2%",
          resenas: "4,521",
          resenasCambio: "+32.5%",
          calificacion: "4.7",
          calificacionCambio: "+0.4",
          resenasNuevas: "892",
          resenasNuevasCambio: "+28.3%",
        };
      case "mes":
      default:
        return {
          visitas: "12,847",
          visitasCambio: "+18.5%",
          resenas: "847",
          resenasCambio: "+12.3%",
          calificacion: "4.5",
          calificacionCambio: "+0.2",
          resenasNuevas: "56",
          resenasNuevasCambio: "+8.7%",
        };
    }
  };

  const data = getDataByPeriodo();

  const estadisticasRapidas = [
    {
      id: "stat-visitas",
      titulo: "Visitas Totales",
      valor: data.visitas,
      cambio: data.visitasCambio,
      positivo: true,
      icono: <FaEye />,
      color: "#806fbe",
    },
    {
      id: "stat-resenas",
      titulo: "Reseñas Totales",
      valor: data.resenas,
      cambio: data.resenasCambio,
      positivo: true,
      icono: <FaStar />,
      color: "#f39c12",
    },
    {
      id: "stat-calificacion",
      titulo: "Calificación Promedio",
      valor: data.calificacion,
      cambio: data.calificacionCambio,
      positivo: true,
      icono: <FaStarHalfAlt />,
      color: "#27ae60",
    },
    {
      id: "stat-resenas-nuevas",
      titulo: "Reseñas Nuevas",
      valor: data.resenasNuevas,
      cambio: data.resenasNuevasCambio,
      positivo: true,
      icono: <FaRegStar />,
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
              <div className="stat-info">
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
