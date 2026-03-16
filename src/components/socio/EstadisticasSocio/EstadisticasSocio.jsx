import { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import {
  FaEye,
  FaHeart,
  FaComment,
  FaShare,
  FaStar,
  FaStore,
  FaCalendarAlt,
  /*FaTrendingUp,*/
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./EstadisticasSocio.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const EstadisticasSocio = () => {
  const [periodo, setPeriodo] = useState("mes");

  // Datos de ejemplo para el gráfico de visitas
  const datosVisitas = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Visitas",
        data: [1200, 1900, 1500, 2500, 2200, 3200],
        fill: true,
        borderColor: "#806fbe",
        backgroundColor: "rgba(128, 111, 190, 0.2)",
        tension: 0.4,
        pointBackgroundColor: "#806fbe",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Datos para el gráfico de interacciones
  const datosInteracciones = {
    labels: ["Me gusta", "Comentarios", "Compartidos", "Guardados"],
    datasets: [
      {
        data: [4500, 1200, 800, 650],
        backgroundColor: [
          "#806fbe",
          "#9b8cd4",
          "#c5bce6",
          "#e0daf2",
        ],
        borderColor: ["#806fbe", "#9b8cd4", "#c5bce6", "#e0daf2"],
        borderWidth: 1,
        hoverOffset: 10,
      },
    ],
  };

  // Datos para el gráfico de lugares populares
  const datosLugares = {
    labels: ["Parque Central", "Plaza Mayor", "Mercado Local", "Mirador Norte", "Jardín Botánico"],
    datasets: [
      {
        label: "Visitas",
        data: [850, 720, 580, 450, 380],
        backgroundColor: [
          "rgba(128, 111, 190, 0.9)",
          "rgba(155, 140, 212, 0.9)",
          "rgba(182, 169, 230, 0.9)",
          "rgba(209, 198, 245, 0.9)",
          "rgba(230, 225, 247, 0.9)",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Datos demográficos
  const datosDemografia = {
    labels: ["18-24", "25-34", "35-44", "45-54", "55+"],
    datasets: [
      {
        label: "Hombres",
        data: [120, 280, 180, 90, 40],
        backgroundColor: "rgba(128, 111, 190, 0.8)",
        borderRadius: 4,
      },
      {
        label: "Mujeres",
        data: [150, 320, 210, 110, 50],
        backgroundColor: "rgba(200, 180, 240, 0.8)",
        borderRadius: 4,
      },
    ],
  };

  const opcionesGraficoLinea = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const opcionesGraficoDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
          color: "#444",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    cutout: "65%",
  };

  const opcionesGraficoBarras = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const opcionesGraficoDemografia = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
          color: "#444",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  // Tarjetas de estadísticas rápidas
  const estadisticasRapidas = [
    {
      titulo: "Visitas Totales",
      valor: "12,847",
      cambio: "+18.5%",
      positivo: true,
      icono: <FaEye />,
      color: "#806fbe",
    },
    {
      titulo: "Me gusta",
      valor: "4,521",
      cambio: "+12.3%",
      positivo: true,
      icono: <FaHeart />,
      color: "#e74c3c",
    },
    {
      titulo: "Comentarios",
      valor: "1,247",
      cambio: "+8.7%",
      positivo: true,
      icono: <FaComment />,
      color: "#3498db",
    },
    {
      titulo: "Compartidos",
      valor: "856",
      cambio: "-2.1%",
      positivo: false,
      icono: <FaShare />,
      color: "#2ecc71",
    },
  ];

  // Lugares mejor valorados
  const lugaresPopulares = [
    {
      nombre: "Parque Central",
      visitas: 850,
      rating: 4.8,
      imagen: "/images/spots/spot-demo.jpg",
    },
    {
      nombre: "Plaza Mayor",
      visitas: 720,
      rating: 4.6,
      imagen: "/images/spots/spot-demo2.jpg",
    },
    {
      nombre: "Mercado Local",
      visitas: 580,
      rating: 4.5,
      imagen: "/images/spots/spot-demo3.jpg",
    },
    {
      nombre: "Mirador Norte",
      visitas: 450,
      rating: 4.7,
      imagen: "/images/spots/spot-demo4.jpg",
    },
    {
      nombre: "Jardín Botánico",
      visitas: 380,
      rating: 4.9,
      imagen: "/images/spots/spot-demo5.jpg",
    },
  ];

  return (
    <div className="estadisticas-socio-container">
      {/* Header */}
      <div className="estadisticas-header">
        <div className="header-info">
          <h1 className="header-titulo">
            <FaChartLine className="header-icon" />
            Estadísticas de tu Negocio
          </h1>
          <p className="header-subtitulo">
            Monitora el rendimiento de tus lugares y promotions
          </p>
        </div>
        
        <div className="header-controles">
          <div className="selector-periodo">
            <button
              className={`periodo-btn ${periodo === "semana" ? "activo" : ""}`}
              onClick={() => setPeriodo("semana")}
            >
              Semana
            </button>
            <button
              className={`periodo-btn ${periodo === "mes" ? "activo" : ""}`}
              onClick={() => setPeriodo("mes")}
            >
              Mes
            </button>
            <button
              className={`periodo-btn ${periodo === "ano" ? "activo" : ""}`}
              onClick={() => setPeriodo("ano")}
            >
              Año
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas rápidas */}
      <Row className="estadisticas-rapidas">
        {estadisticasRapidas.map((stat, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className="stat-card">
              <Card.Body>
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  {stat.icono}
                </div>
                <div className="stat-info">
                  <span className="stat-titulo">{stat.titulo}</span>
                  <span className="stat-valor">{stat.valor}</span>
                  <span className={`stat-cambio ${stat.positivo ? "positivo" : "negativo"}`}>
                    {/*<FaTrendingUp className={stat.positivo ? "" : "negativo"} />
                    {stat.cambio} */}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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
                <Line data={datosVisitas} options={opcionesGraficoLinea} />
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
                <Doughnut data={datosInteracciones} options={opcionesGraficoDoughnut} />
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
                <Bar data={datosLugares} options={opcionesGraficoBarras} />
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
                <Bar data={datosDemografia} options={opcionesGraficoDemografia} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lugares mejor valorados */}
      <Card className="lugares-populares-card">
        <Card.Header className="grafico-header">
          <h3><FaStar className="card-icon" /> Tus Lugares Mejor Valorados</h3>
          <span className="grafico-subtitle">Ranking por rating y visitas</span>
        </Card.Header>
        <Card.Body>
          <div className="lugares-lista">
            {lugaresPopulares.map((lugar, index) => (
              <div key={index} className="lugar-item">
                <span className="lugar-ranking">#{index + 1}</span>
                <img src={lugar.imagen} alt={lugar.nombre} className="lugar-imagen" />
                <div className="lugar-info">
                  <span className="lugar-nombre">{lugar.nombre}</span>
                  <div className="lugar-rating">
                    <FaStar className="star-icon" />
                    <span>{lugar.rating}</span>
                  </div>
                </div>
                <div className="lugar-visitas">
                  <FaEye className="visita-icon" />
                  <span>{lugar.visitas} visitas</span>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Información adicional */}
      <Row className="info-adicional">
        <Col xs={12} md={4}>
          <div className="info-box">
            <div className="info-icon">
              <FaStore />
            </div>
            <div className="info-content">
              <span className="info-valor">5</span>
              <span className="info-titulo">Lugares Registrados</span>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="info-box">
            <div className="info-icon">
              <FaStar />
            </div>
            <div className="info-content">
              <span className="info-valor">4.7</span>
              <span className="info-titulo">Rating Promedio</span>
            </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="info-box">
            <div className="info-icon">
              <FaCalendarAlt />
            </div>
            <div className="info-content">
              <span className="info-valor">8</span>
              <span className="info-titulo">Meses Activo</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EstadisticasSocio;
