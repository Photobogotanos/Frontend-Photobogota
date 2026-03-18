import { Card } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const LugaresPopulares = () => {
  const lugaresPopulares = [
    {
      id: "lugar-1",
      nombre: "Parque Central",
      visitas: 850,
      rating: 4.8,
      imagen: "/images/spots/spot-demo.jpg",
    },
    {
      id: "lugar-2",
      nombre: "Plaza Mayor",
      visitas: 720,
      rating: 4.6,
      imagen: "/images/spots/spot-demo2.jpg",
    },
    {
      id: "lugar-3",
      nombre: "Mercado Local",
      visitas: 580,
      rating: 4.5,
      imagen: "/images/spots/spot-demo3.jpg",
    },
    {
      id: "lugar-4",
      nombre: "Mirador Norte",
      visitas: 450,
      rating: 4.7,
      imagen: "/images/spots/spot-demo4.jpg",
    },
    {
      id: "lugar-5",
      nombre: "Jardín Botánico",
      visitas: 380,
      rating: 4.9,
      imagen: "/images/spots/spot-demo5.jpg",
    },
  ];

  return (
    <Card className="lugares-populares-card">
      <Card.Header className="grafico-header">
        <h3><FaStar className="card-icon" /> Tus Lugares Mejor Valorados</h3>
        <span className="grafico-subtitle">Ranking por rating y visitas</span>
      </Card.Header>
      <Card.Body>
        <div className="lugares-lista">
          {lugaresPopulares.map((lugar, index) => (
            <div key={lugar.id} className="lugar-item">
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
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default LugaresPopulares;
