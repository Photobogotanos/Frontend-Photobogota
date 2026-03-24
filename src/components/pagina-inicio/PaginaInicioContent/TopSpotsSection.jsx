import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoPin } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { getSpots } from "@/mocks/spots.helpers"; 

const topSpots = getSpots().slice(0, 3);

export default function TopSpotsSection({ onImageClick }) {
  return (
    <>
      <h2 className="section-title">Top Spots más visitados</h2>
      <Row className="g-4">
        {topSpots.map((spot, i) => (
          <Col xs={12} md={4} key={spot.id}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="card-spot"
            >
              <img
                src={spot.imagen}
                alt={spot.nombre}
                onClick={() => onImageClick(spot.imagen, spot.nombre)}
                style={{ cursor: "pointer" }}
              />
              <div className="card-info">
                <h5>{spot.nombre}</h5>
                <div className="location">
                  <IoPin /> {spot.localidad}
                </div>
                <div className="likes">
                  <FaRegHeart /> {spot.totalResenas.toLocaleString()} reseñas
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </>
  );
}