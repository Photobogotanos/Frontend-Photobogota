import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoPin } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { LazyMotion, m, domAnimation } from "framer-motion";
import { getSpots } from "@/mocks/spots.helpers";

const topSpots = getSpots().slice(0, 3);

export default function TopSpotsSection({ onImageClick }) {
  return (
    <section className="pg-section" aria-labelledby="topspots-title">
      <h2 id="topspots-title" className="section-title">
        Top Spots más visitados
      </h2>
      <LazyMotion features={domAnimation}>
        <Row className="g-4">
          {topSpots.map((spot, i) => (
            <Col xs={12} md={4} key={spot.id}>
              <m.article
                initial={{ y: 48, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="card-spot"
              >
                <button
                  type="button"
                  className="card-spot-media"
                  onClick={() => onImageClick(spot.imagen, spot.nombre)}
                  aria-label={`Ver ${spot.nombre}`}
                >
                  <img
                    src={spot.imagen}
                    alt={spot.nombre}
                    loading="lazy"
                    decoding="async"
                    width={640}
                    height={420}
                  />
                  <span className="card-spot-rank" aria-hidden="true">
                    #{i + 1}
                  </span>
                </button>
                <div className="card-info">
                  <h3 className="card-info-title">{spot.nombre}</h3>
                  <div className="location">
                    <IoPin aria-hidden="true" />
                    <span>{spot.localidad}</span>
                  </div>
                  <div className="likes">
                    <FaRegHeart aria-hidden="true" />
                    <span>{spot.totalResenas.toLocaleString()} reseñas</span>
                  </div>
                </div>
              </m.article>
            </Col>
          ))}
        </Row>
      </LazyMotion>
    </section>
  );
}
