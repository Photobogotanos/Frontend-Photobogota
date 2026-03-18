import { Row, Col, Card } from "react-bootstrap";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaChartLine, FaHeart, FaMapMarkerAlt, FaUsers } from "react-icons/fa";

const GraficosEstadisticos = () => {
  // Datos de ejemplo para el gráfico de visitas
  const datosVisitas = [
    { name: "Ene", visitas: 1200 },
    { name: "Feb", visitas: 1900 },
    { name: "Mar", visitas: 1500 },
    { name: "Abr", visitas: 2500 },
    { name: "May", visitas: 2200 },
    { name: "Jun", visitas: 3200 },
  ];

  // Datos para el gráfico de interacciones
  const datosInteracciones = [
    { name: "Me gusta", value: 4500 },
    { name: "Comentarios", value: 1200 },
    { name: "Compartidos", value: 800 },
    { name: "Guardados", value: 650 },
  ];

  const COLORS = ["#806fbe", "#9b8cd4", "#c5bce6", "#e0daf2"];

  // Datos para el gráfico de lugares populares
  const datosLugares = [
    { name: "Parque Central", visitas: 850 },
    { name: "Plaza Mayor", visitas: 720 },
    { name: "Mercado Local", visitas: 580 },
    { name: "Mirador Norte", visitas: 450 },
    { name: "Jardín Botánico", visitas: 380 },
  ];

  // Datos demográficos
  const datosDemografia = [
    { name: "18-24", hombres: 120, mujeres: 150 },
    { name: "25-34", hombres: 280, mujeres: 320 },
    { name: "35-44", hombres: 180, mujeres: 210 },
    { name: "45-54", hombres: 90, mujeres: 110 },
    { name: "55+", hombres: 40, mujeres: 50 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "12px",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
            {label}
          </p>
          {payload.map((entry) => (
              <p key={entry.name} style={{ margin: "4px 0", fontSize: "13px" }}>
                {entry.name}: {entry.value}
              </p>
            ))}
        </div>
      );
    }
    return null;
  };

  const CustomTooltipPie = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: "12px",
            borderRadius: "8px",
            color: "#fff",
          }}
        >
          <p style={{ margin: 0, fontWeight: "bold", fontSize: "14px" }}>
            {payload[0].name}
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            Valor: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Gráficos principales */}
      <Row className="graficos-principales">
        <Col xs={12} lg={8}>
          <Card className="grafico-card">
            <Card.Header className="grafico-header">
              <h3><FaChartLine className="card-icon" /> Tendencia de Visitas</h3>
              <span className="grafico-subtitle">Visitas en los últimos 6 meses</span>
            </Card.Header>
            <Card.Body className="grafico-body">
              <div className="grafico-linea-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={datosVisitas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                    <XAxis
                      dataKey="name"
                      tick={{ color: "#666", fontSize: 12 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <YAxis
                      tick={{ color: "#666", fontSize: 12 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="visitas"
                      stroke="#806fbe"
                      strokeWidth={3}
                      fill="rgba(128, 111, 190, 0.2)"
                      dot={{ fill: "#806fbe", stroke: "#fff", strokeWidth: 2, r: 5 }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} lg={4}>
          <Card className="grafico-card">
            <Card.Header className="grafico-header">
              <h3><FaHeart className="card-icon" /> Distribución de Interacciones</h3>
              <span className="grafico-subtitle">Tipos de engagement</span>
            </Card.Header>
            <Card.Body className="grafico-body">
              <div className="grafico-doughnut-container">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={datosInteracciones}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {datosInteracciones.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[datosInteracciones.indexOf(entry) % COLORS.length]}
                      />
                    ))}
                    </Pie>
                    <Tooltip content={<CustomTooltipPie />} />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      formatter={(value) => (
                        <span style={{ color: "#444", fontSize: "12px" }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Segunda fila de gráficos */}
      <Row className="graficos-secundarios">
        <Col xs={12} lg={6}>
          <Card className="grafico-card">
            <Card.Header className="grafico-header">
              <h3><FaMapMarkerAlt className="card-icon" /> Lugares Más Visitados</h3>
              <span className="grafico-subtitle">Top 5 de tus ubicaciones</span>
            </Card.Header>
            <Card.Body className="grafico-body">
              <div className="grafico-barras-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosLugares}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                    <XAxis
                      dataKey="name"
                      tick={{ color: "#666", fontSize: 11 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <YAxis
                      tick={{ color: "#666", fontSize: 12 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="visitas"
                      fill="#806fbe"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col xs={12} lg={6}>
          <Card className="grafico-card">
            <Card.Header className="grafico-header">
              <h3><FaUsers className="card-icon" /> Distribución por Edad</h3>
              <span className="grafico-subtitle">Audiencia segmentada por género</span>
            </Card.Header>
            <Card.Body className="grafico-body">
              <div className="grafico-barras-container">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={datosDemografia}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
                    <XAxis
                      dataKey="name"
                      tick={{ color: "#666", fontSize: 12 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <YAxis
                      tick={{ color: "#666", fontSize: 12 }}
                      axisLine={{ stroke: "#ddd" }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      formatter={(value) => (
                        <span style={{ color: "#444", fontSize: "12px" }}>{value}</span>
                      )}
                    />
                    <Bar dataKey="hombres" fill="rgba(128, 111, 190, 0.8)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="mujeres" fill="rgba(200, 180, 240, 0.8)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GraficosEstadisticos;
