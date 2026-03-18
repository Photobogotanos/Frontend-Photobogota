import { Row, Col, Card } from "react-bootstrap";
import { FaEye, FaHeart, FaComment, FaShare } from "react-icons/fa";

const EstadisticasRapidas = () => {
  const estadisticasRapidas = [
    {
      id: "stat-visitas",
      titulo: "Visitas Totales",
      valor: "12,847",
      cambio: "+18.5%",
      positivo: true,
      icono: <FaEye />,
      color: "#806fbe",
    },
    {
      id: "stat-likes",
      titulo: "Me gusta",
      valor: "4,521",
      cambio: "+12.3%",
      positivo: true,
      icono: <FaHeart />,
      color: "#e74c3c",
    },
    {
      id: "stat-comentarios",
      titulo: "Comentarios",
      valor: "1,247",
      cambio: "+8.7%",
      positivo: true,
      icono: <FaComment />,
      color: "#3498db",
    },
    {
      id: "stat-compartidos",
      titulo: "Compartidos",
      valor: "856",
      cambio: "-2.1%",
      positivo: false,
      icono: <FaShare />,
      color: "#2ecc71",
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
