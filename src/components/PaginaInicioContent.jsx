import "./PaginaInicioContent.css";
import main from "../../public/images/img-home/pagina-inicio-main.png";

import inspo1 from "../assets/images/inspo1.png";
import inspo2 from "../assets/images/inspo2.png";
import inspo3 from "../assets/images/inspo3.png";
import monserrate from "../assets/images/monserrate.png";
import jardin from "../assets/images/jardin-botanico.png";
import calera from "../assets/images/calera.png";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { IoPin } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

export default function PaginaInicioContent() {
  return (
    <div className="pg-inicio-total ">
      {/* HERO */}
      <motion.div
        fluid 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pg-inicio-hero"
      >
        <img src={main} alt="Bogotá desde las alturas" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            PhotoBogotá
          </motion.h1>
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Un espacio para compartir miradas fotográficas y redescubrir Bogotá desde diferentes perspectivas
          </motion.p>
        </div>
      </motion.div>

      {/* INSPIRACIÓN */}
      <h2 className="section-title">Inspiración del día</h2>
      <Row className="g-4">
        {[
          { img: inspo1, user: "@sebass.ye", loc: "Cl. 24 #69a-59, Torre Colpatria" },
          { img: inspo2, user: "@vxc_xerg", loc: "Cra. 4 #13-19, La Candelaria" },
          { img: inspo3, user: "@void0bits", loc: "Cl. 19 #2a-10, Torres del Parque" }
        ].map((item, i) => (
          <Col xs={12} md={6} lg={4} key={i}>
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="card-inspo"
            >
              <img src={item.img} alt="" />
              <div className="card-info">
                <h5>{item.user}</h5>
                <div className="location">
                  <IoPin /> {item.loc}
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* RESEÑAS */}
      <h2 className="section-title">Esto dicen nuestros usuarios</h2>
      <Row className="g-4">
        {[
          { user: "@sxbxxs.r", text: "La mejor app para descubrir spots fotográficos en Bogotá. ¡Insuperable!" },
          { user: "@dieg.oamt", text: "Gracias a PhotoBogotá encontré lugares que ni sabía que existían. 100% recomendada." },
          { user: "@danfel_fr", text: "Ahora entiendo por qué Bogotá es tan fotogénica. Esta app me abrió los ojos." }
        ].map((review, i) => (
          <Col md={4} key={i}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-review"
            >
              <p className="user-name">{review.user}</p>
              <p>“{review.text}”</p>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* TOP SPOTS */}
      <h2 className="section-title">Top Spots más visitados</h2>
      <Row className="g-4">
        {[
          { img: monserrate, name: "Monserrate", likes: 1795 },
          { img: jardin, name: "Jardín Botánico", likes: 1247 },
          { img: calera, name: "La Calera", likes: 1386 }
        ].map((spot, i) => (
          <Col xs={12} md={4} key={i}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="card-spot"
            >
              <img src={spot.img} alt={spot.name} />
              <div className="card-info">
                <h5>{spot.name}</h5>
                <div className="likes">
                  <FaRegHeart /> {spot.likes.toLocaleString()}
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* GUÍA + MAPA */}
      <div className="guia-container pb-5">
        <div className="guia-text">
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Cómo encontrar los mejores spots
          </motion.h3>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 style={{fontWeight: "800", margin: "2.5rem 0 1rem"}}>Mapa Interactivo</h4>
            <p>Explora Bogotá con nuestro mapa lleno de spots marcados por la comunidad.</p>

            <h4 style={{fontWeight: "800", margin: "2.5rem 0 1rem"}}>Filtra por categorías</h4>
            <p>Urbano, naturaleza, street art, rooftops, comida, vida nocturna… tú eliges.</p>

            <h4 style={{fontWeight: "800", margin: "2.5rem 0 1rem"}}>Todo lo que necesitas saber</h4>
            <p>Fotos reales, tips de luz, horarios ideales y cómo llegar. Sin sorpresas.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mapa-container"
        >
          <MapContainer center={[4.6495, -74.1014]} zoom={12} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
        </motion.div>
      </div>
    </div>
  );
}