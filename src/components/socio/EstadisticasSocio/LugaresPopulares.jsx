import { Card } from "react-bootstrap";
import { FaStar, FaExternalLinkAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LugaresPopulares = () => {
  const navigate = useNavigate();

  const lugaresPopulares = [
    {
      id: "1",
      nombre: "Estación Aguas",
      visitas: 850,
      rating: 4.8,
      imagen: "/images/spots/spot-demo.jpg",
    },
    {
      id: "2",
      nombre: "Monserrate",
      visitas: 720,
      rating: 4.6,
      imagen: "/images/spots/spot-demo2.jpg",
    },
    {
      id: "3",
      nombre: "Parque El Jazmín",
      visitas: 580,
      rating: 4.5,
      imagen: "/images/spots/spot-demo3.jpg",
    },
    {
      id: "4",
      nombre: "Parque Timiza",
      visitas: 450,
      rating: 4.7,
      imagen: "/images/spots/spot-demo4.jpg",
    },
    {
      id: "5",
      nombre: "Estación Minuto de Dios",
      visitas: 380,
      rating: 4.9,
      imagen: "/images/spots/spot-demo5.jpg",
    },
  ];

  const handleLugarClick = (lugarId) => {
    navigate(`/spot/${lugarId}`);
  };

  return (
    <Card className="lugares-populares-card">
      <Card.Header className="grafico-header">
        <h3><FaStar className="card-icon" /> Tus Lugares Mejor Valorados</h3>
        <span className="grafico-subtitle">Ranking por rating y visitas</span>
      </Card.Header>
      <Card.Body>
        <div className="lugares-lista">
          {lugaresPopulares.map((lugar, index) => (
            <div 
              key={lugar.id} 
              className="lugar-item"
              onClick={() => handleLugarClick(lugar.id)}
              style={{ cursor: 'pointer' }}
            >
              <span className="lugar-ranking">#{index + 1}</span>
              <img src={lugar.imagen} alt={lugar.nombre} className="lugar-imagen" />
              <div className="lugar-info">
                <span className="lugar-nombre">{lugar.nombre}</span>
                <div className="lugar-rating">
                  <FaStar className="star-icon" />
                  <span>{lugar.rating}</span>
                  <span className="lugar-visitas">{lugar.visitas} visitas</span>
                </div>
              </div>
              <FaExternalLinkAlt className="lugar-arrow" />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LugaresPopulares;
