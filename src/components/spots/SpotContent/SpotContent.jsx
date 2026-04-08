import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import FiltrosMapa from "@/components/mapa/FiltrosMapa/FiltrosMapa";
import MapaBogota from "@/components/mapa/MapaBogota/MapaBogota";
import { FaChevronUp, FaChevronDown, FaMapMarkerAlt, FaStar, FaTag, FaHeart, FaCamera } from "react-icons/fa";
import { obtenerSpotPorId } from "@/services/spot.service";
import { toast } from "react-hot-toast";
import "./SpotContent.css";

const MapaContent = () => {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [cargandoSpot, setCargandoSpot] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});

  useEffect(() => {
    if (id) {
      const cargarSpot = async () => {
        setCargandoSpot(true);
        const resultado = await obtenerSpotPorId(id);
        if (resultado.exitoso) {
          setSpot(resultado.datos);
        } else {
          toast.error(resultado.mensaje);
        }
        setCargandoSpot(false);
      };
      cargarSpot();
    }
  }, [id]);

  if (cargandoSpot) {
    return (
      <div className="lugar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (spot) {
    return (
      <div className="lugar-content-wrapper">
        <div className="lugar-imagen-principal">
          {spot.imagen ? (
            <img src={spot.imagen} alt={spot.nombre} />
          ) : (
            <div style={{ backgroundColor: '#ddd', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span>Sin imagen</span>
            </div>
          )}
        </div>

        <div className="lugar-info-container">
          <h1 className="lugar-nombre">{spot.nombre}</h1>
          <p className="lugar-direccion">
            <FaMapMarkerAlt className="location-icon" />
            {spot.direccion}
          </p>

          <div className="lugar-badges">
            {spot.categoria && (
              <span className="badge-categoria">
                <FaTag className="category-icon" />
                {spot.categoria}
              </span>
            )}
            {spot.localidad && (
              <span className="badge-localidad">
                <FaMapMarkerAlt className="category-icon" />
                {spot.localidad}
              </span>
            )}
            <div className="lugar-rating-badge">
              <FaStar className="star-icon" />
              <span className="rating-text">{spot.rating}</span>
              <span className="reviews-text">({spot.totalResenas} reseñas)</span>
            </div>
          </div>

          {spot.descripcion && (
            <div className="lugar-descripcion">
              <h3><FaMapMarkerAlt className="section-icon" /> Descripción</h3>
              <p>{spot.descripcion}</p>
            </div>
          )}

          {spot.recomendacion && (
            <div className="lugar-recomendacion">
              <h3><FaHeart className="section-icon" /> ¿Por qué recomendarlo?</h3>
              <p>{spot.recomendacion}</p>
            </div>
          )}

          {spot.tipsFoto && (
            <div className="lugar-tips">
              <h3><FaCamera className="section-icon" /> Tips de fotografía</h3>
              <p>{spot.tipsFoto}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mapa-content-container">

      <button
        className="toggle-filtros-btn"
        onClick={() => setFiltrosVisibles(!filtrosVisibles)}
      >
        {filtrosVisibles ? <FaChevronUp /> : <FaChevronDown />}
        <span>{filtrosVisibles ? "Ocultar filtros" : "Mostrar filtros"}</span>
      </button>

      {filtrosVisibles && (
        <Row className="mapa-row filtros-row">
          <Col className="p-0">
            <FiltrosMapa onFiltrar={setFiltrosActivos} />
          </Col>
        </Row>
      )}

      <Row className="mapa-row">
        <Col className="p-0">
          <MapaBogota filtros={filtrosActivos} />
        </Col>
      </Row>
    </div>
  );
};

export default MapaContent;