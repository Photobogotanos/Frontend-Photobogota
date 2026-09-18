import { Card } from "react-bootstrap";
import { FaStar, FaExternalLinkAlt, FaInbox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const imagenPorDefecto = `${import.meta.env.BASE_URL}images/spots/spot-demo.webp`;

const LugaresPopulares = ({ lugares }) => {
  const navigate = useNavigate();

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
        {lugares.length === 0 ? (
          <div className="text-center py-4">
            <FaInbox className="mb-2" style={{ color: "#bbb", fontSize: "2rem" }} />
            <p className="text-muted mb-0">Aún no hay visitas registradas en tus locales.</p>
          </div>
        ) : (
          <div className="lugares-lista">
            {lugares.map((lugar, index) => (
              <div 
                key={lugar.id} 
                className="lugar-item"
                onClick={() => handleLugarClick(lugar.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleLugarClick(lugar.id);
                  }
                }}
              >
                <span className="lugar-ranking">#{index + 1}</span>
                <img src={lugar.imagen || imagenPorDefecto} alt={lugar.nombre} className="lugar-imagen" />
                <div className="lugar-info">
                  <span className="lugar-nombre">{lugar.nombre}</span>
                  <div className="lugar-rating">
                    <FaStar className="star-icon" />
                    <span>{Number(lugar.rating) || 0}</span>
                    <span className="lugar-visitas">{Number(lugar.visitas) || 0} visitas</span>
                  </div>
                </div>
                <FaExternalLinkAlt className="lugar-arrow" />
              </div>
            ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default LugaresPopulares;