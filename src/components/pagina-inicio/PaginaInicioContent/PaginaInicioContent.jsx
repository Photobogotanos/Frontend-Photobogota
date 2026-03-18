import "./PaginaInicioContent.css";
const fotoPrincipal = "/images/img-home/pagina-inicio-main.jpg";
const inspo1 = "/images/img-home/inspo1.jpg";
const inspo3 = "/images/img-home/inspo3.jpg";
const centro = "/images/img-home/centro.jpg";
const villaLuz = "/images/img-home/villa-luz.jpg";
const aeropuertoDorado = "/images/img-home/aeropuerto-dorado.jpg";
const portalAmericas = "/images/img-home/portal-americas.jpg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { IoPin } from "react-icons/io5";
import { FaRegHeart, FaTimes, FaLock } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import { FaCamera, FaStar, FaHeart, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Configuración de iconos de Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function PaginaInicioContent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();

  const openModal = (img, title = "") => {
    setSelectedImg(img);
    setSelectedTitle(title);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  // Datos de lugares demostrativos para la versión no logueada
  const lugaresDemostracion = [
    {
      id: 1,
      nombre: "Museo del Oro",
      coord: [4.601, -74.072],
      direccion: "Cra. 6 #15-88, Santa Fe, Bogotá",
      categoria: "Museo",
    },
    {
      id: 2,
      nombre: "Monserrate",
      coord: [4.605, -74.056],
      direccion: "Carrera 2 Este #21-48, Bogotá",
      categoria: "Atractivo turístico",
    },
    {
      id: 3,
      nombre: "Plaza de Bolívar",
      coord: [4.598, -74.076],
      direccion: "Carrera 7 #11-10, Bogotá",
      categoria: "Plaza",
    },
    {
      id: 4,
      nombre: "Jardín Botánico",
      coord: [4.668, -74.099],
      direccion: "Calle 63 #68-95, Bogotá",
      categoria: "Parque",
    },
  ];

  const handleMarkerClick = () => {
    setShowLoginPrompt(true);
  };

  return (
    <div className="pg-inicio-total">
      {/* HERO */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pg-inicio-hero"
      >
        <img src={fotoPrincipal} alt="Bogotá desde las alturas" />
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
            Un espacio para compartir miradas fotográficas y redescubrir Bogotá
            desde diferentes perspectivas
          </motion.p>
        </div>
      </motion.div>

      {/* INSPIRACIÓN */}
      <h2 className="section-title">Inspiración del día</h2>
      <Row className="g-4">
        {[
          {
            id: "inspo-1",
            img: inspo1,
            user: "@sebass.ye",
            loc: "Cl. 24 #69a-59, Torre Colpatria",
          },
          {
            id: "inspo-2",
            img: centro,
            user: "@vxc_xerg",
            loc: "Cra. 4 #13-19, Museo del oro",
          },
          { id: "inspo-3", img: inspo3, user: "@void0bits", loc: "Cl. 19 #2a-10, Las aguas" },
        ].map((item, i) => (
          <Col xs={12} md={6} lg={4} key={item.id}>
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="card-inspo"
            >
              <img
                src={item.img}
                alt={`Inspiración ${i + 1}`}
                onClick={() => openModal(item.img, `Foto de ${item.user}`)}
                style={{ cursor: "pointer" }}
              />
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
          {
            id: "review-1",
            user: "@sxbxxs.r",
            text: "La mejor app para descubrir spots fotográficos en Bogotá. ¡Insuperable!",
          },
          {
            id: "review-2",
            user: "@dieg.oamt",
            text: "Gracias a PhotoBogotá encontré lugares que ni sabía que existían. 100% recomendada.",
          },
          {
            id: "review-3",
            user: "@danfel_fr",
            text: "Ahora entiendo por qué Bogotá es tan fotogénica. Esta app me abrió los ojos.",
          },
        ].map((review, i) => (
          <Col md={4} key={review.id}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-review"
            >
              <p className="user-name">{review.user}</p>
              <p>"{review.text}"</p>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* TOP SPOTS */}
      <h2 className="section-title">Top Spots más visitados</h2>
      <Row className="g-4">
        {[
          { id: "spot-1", img: aeropuertoDorado, name: "Aeropuerto El Dorado", likes: 1795 },
          { id: "spot-2", img: villaLuz, name: "Parque villa luz", likes: 1247 },
          { id: "spot-3", img: portalAmericas, name: "Portal Las Ámericas", likes: 1386 },
        ].map((spot, i) => (
          <Col xs={12} md={4} key={spot.id}>
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="card-spot"
            >
              <img
                src={spot.img}
                alt={spot.name}
                onClick={() => openModal(spot.img, spot.name)}
                style={{ cursor: "pointer" }}
              />
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

      {/* GUÍA + MAPA DEMOSTRATIVO */}
      <div className="guia-container pb-5">
        <div className="guia-text">
          <motion.h3
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            Descubre Bogotá con nuestro mapa interactivo
          </motion.h3>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
              Mapa Interactivo (Versión Demostrativa)
            </h4>
            <p>
              Explora Bogotá con nuestro mapa lleno de spots marcados por la
              comunidad.{" "}
              <strong>
                Haz clic en los marcadores para ver más información.
              </strong>
            </p>

            <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
              Funcionalidades completas
            </h4>
            <p>
              Al registrarte podrás: añadir nuevos spots, guardar tus favoritos,
              ver fotos detalladas, leer reseñas completas y acceder a
              información exclusiva.
            </p>

            <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
              Todo lo que necesitas saber
            </h4>
            <p>
              Fotos reales, tips de luz, horarios ideales y cómo llegar. Sin
              sorpresas.
            </p>

            <div className="demo-note mt-4 p-3 rounded">
              <FaLock className="me-2 " />
              <strong>Nota:</strong> Esta es una versión demostrativa.
              Regístrate para acceder a todas las funcionalidades.
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mapa-demo-container"
        >
          <div className="mapa-demo-overlay">
            <div className="mapa-demo-content">
              <h5>Mapa Interactivo de PhotoBogotá</h5>
              <p className="text-muted mb-3">
                Haz clic en los marcadores para ver información básica
              </p>

              <div className="mapa-demo-wrapper">
                <MapContainer
                  center={[4.6529, -74.075]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="mapa-demo"
                  zoomControl={false}
                  maxBounds={[
                    [4.2, -74.6],
                    [5.1, -73.6],
                  ]}
                  minZoom={11}
                  maxZoom={16}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                  />

                  {lugaresDemostracion.map((lugar) => (
                    <Marker
                      key={lugar.id}
                      position={lugar.coord}
                      eventHandlers={{
                        click: () => handleMarkerClick(lugar),
                      }}
                    >
                      <Popup>
                        <div className="popup-demo">
                          <strong>{lugar.nombre}</strong>
                          <p className="mb-1">
                            <small>{lugar.categoria}</small>
                          </p>
                          <p className="mb-2">{lugar.direccion}</p>
                          <div className="demo-lock-info">
                            <FaLock size={12} className="me-1" />
                            <small>
                              Inicia sesión para ver fotos y reseñas
                            </small>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                <div className="mapa-demo-legend">
                  <div className="legend-item">
                    <div className="legend-marker"></div>
                    <span>Lugar fotográfico</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-lock">
                      <FaLock size={10} />
                    </div>
                    <span>Contenido exclusivo para usuarios</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MODAL PARA IMÁGENES */}
      <Modal
        show={showModal}
        onHide={closeModal}
        centered
        size="lg"
        className="custom-modal"
      >
        <Modal.Body className="p-0 position-relative">
          <button
            className="modal-close-btn"
            onClick={closeModal}
            aria-label="Cerrar modal"
          >
            <FaTimes />
          </button>
          {selectedTitle && (
            <div className="modal-title p-3">
              <h4 className="mb-0">{selectedTitle}</h4>
            </div>
          )}
          <div className="modal-image-container">
            <img src={selectedImg} alt="Vista previa" className="modal-image" />
          </div>
        </Modal.Body>
      </Modal>

      {/* MODAL PARA INVITACION A REGISTRASE */}
      <Modal
        show={showLoginPrompt}
        onHide={() => setShowLoginPrompt(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <h4>Contenido exclusivo</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center py-3">
            <div className="mb-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <FaLock size={48} className="icono-demo-modal mb-3" />
              </motion.div>
              <h5>¡Desbloquea todas las funcionalidades!</h5>
            </div>
            <p className="mb-4">Al registrarte en PhotoBogotá podrás:</p>

            <ul className="apple-list mb-4">
              <li>
                <FaCamera /> Fotos detalladas de cada lugar
              </li>
              <li>
                <FaStar /> Reseñas completas de otros usuarios
              </li>
              <li>
                <FaHeart /> Guarda tus spots favoritos
              </li>
              <li>
                <FaPlus /> Agrega nuevos lugares a la comunidad
              </li>
            </ul>

            <div className="d-grid gap-2">
              <button
                className="button-register-modal-demo"
                onClick={() => {
                  navigate("/creacion-cuenta");
                }}
              >
                Regístrate Gratis
              </button>
              <button
                className="button-login-modal-demo"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Iniciar Sesión
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
