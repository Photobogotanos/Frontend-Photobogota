import { motion as m, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  FaInstagram,
  FaLinkedin,
  FaBriefcase,
  FaGraduationCap,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./NosotrosContent.css";

const fotoNosotros2 = "../public/images/img-home/nosotros2.jpg";
const fotoNosotros3 = "../public/images/img-home/nosotros3.jpg";
const fotoSoto = "../public/images/img-home/soto.jpg";
const fotoSebastian = "../public/images/img-home/sebastian.jpg";
const fotoDanfel = "../public/images/img-home/danfel.jpg";
const fotoYanpol = "../public/images/img-home/yanpol.jpg";

const carouselImages = [
  { src: fotoNosotros2, alt: "Equipo PhotoBogota", caption: "Nosotros" },
  { src: fotoNosotros3, alt: "Equipo celebrando", caption: "Juntos" },
];

const teamMembers = [
  {
    name: "Sebastian Sotomayor",
    role: "Full Stack Developer",
    photo: fotoSoto,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Experiencia en C#, programación móvil, escritorio y consola",
    status: "Buscando oportunidades laborales",
    instagram:
      "https://www.instagram.com/sebass.ye?igsh=MXRldHhwanFhMzd0aA%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/sebassye/",
    song: "/songs/Daft-Punk-Instant-Crush.mp3",
    songName: "Instant Crush - Daft Punk",
  },
  {
    name: "Sebastian Romero",
    role: "Frontend Developer",
    photo: fotoSebastian,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Especializado en desarrollo web moderno y diseño de interfaces",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/sxbxxs.r?igsh=MW8wOWVvNjQ1Y2J4ZA==",
    linkedin: null,
    song: "/songs/Entrega-Grupo-Niche.mp3",
    songName: "Entrega - Grupo Niche",
  },
  {
    name: "Daniel Cruz",
    role: "Frontend Developer",
    photo: fotoDanfel,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise:
      "Desarrollador web con experiencia en php, angular, typescript y mysql",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/danfel_fr?igsh=ZW5vM3o0MTRuYWJv",
    linkedin: null,
    song: "/songs/Gustavo-Cerati-Me-Quedo-Aqui.mp3",
    songName: "Me Quedo Aquí - Cerati",
  },
  {
    name: "Juan Marin",
    role: "PowerApps Developer",
    photo: fotoYanpol,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise:
      "Desarrollador de aplicaciones con PowerApps y automatización con Power Automate",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/void0bits?igsh=MTN0OWtvOHN3eGZhbQ==",
    linkedin: null,
    song: "/songs/Mazzy-Star-Fade-Into-You.mp3",
    songName: "Fade Into You - Mazzy Star",
  },
];

export default function NosotrosContent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [playing, setPlaying] = useState({});
  const audioRefs = useRef([]);

  useEffect(() => {
    // Crear instancias de audio para cada miembro
    audioRefs.current = teamMembers.map((member) => {
      const audio = new Audio(member.song);
      audio.addEventListener("ended", () => {
        setPlaying((prev) => ({
          ...prev,
          [teamMembers.indexOf(member)]: false,
        }));
      });
      return audio;
    });

    // Limpiar al desmontar
    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? carouselImages.length - 1 : prev - 1
    );
  };

  const isMobile = window.matchMedia(
    "(hover: none) and (pointer: coarse)"
  ).matches;

  const handleCardClick = (index, e) => {
    const isInteractive = e.target.closest("button, a");

    if (isInteractive) return;

    setFlipped((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleAudio = (index, e) => {
    e.stopPropagation();

    const audio = audioRefs.current[index];

    if (!audio) {
      console.error("Audio no encontrado en el índice", index);
      return;
    }

    if (playing[index]) {
      audio.pause();
      setPlaying((prev) => ({ ...prev, [index]: false }));
    } else {
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a && !a.paused) {
          a.pause();
        }
      });

      setPlaying({}); // limpia estados previos
      audio.currentTime = 0;

      audio
        .play()
        .then(() => {
          setPlaying({ [index]: true });
        })
        .catch((err) => {
          console.error("Error audio:", err);
        });
    }
  };

  return (
    <div className="nosotros-wrapper">
      <Row>
        <Col lg={6} className="mb-4 mb-lg-0">
          <motion.h3
            className="nosotros-title-animated"
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
          >
            ¿Quienes somos?
          </motion.h3>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <p className="nosotros-description">
              Representando a lo mejor de la programación web y el grupo más
              duro de la ficha, somos unos aprendices en busca de mostrar a
              Bogotá con la bella vista que nosotros y muchos más tenemos de la
              misma por medio de este sitio web hecho con cariño y amor. Además
              de dejar en alto nuestra ciudad también tratamos de explorar en el
              desarrollo de software, en el conocimiento continuo y sobre todo
              en pasar un rato bacano en el proceso.
              <br />
              <br />
              Nuestro mega equipo se compone de: Sebastian Sotomayor, Sebastian
              Romero, Daniel Cruz y Juan Marin. Y juntos hacemos realidad el
              proyecto de PhotoBogota
            </p>
          </motion.div>
        </Col>
        <Col lg={6}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="carousel-container"
          >
            <div className="carousel-wrapper">
              <AnimatePresence mode="sync">
                <motion.div
                  key={currentSlide}
                  className="carousel-slide"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <img
                    src={carouselImages[currentSlide].src}
                    alt={carouselImages[currentSlide].alt}
                    className="carousel-image"
                  />
                  <div className="carousel-overlay"></div>
                  <div className="carousel-content">
                    <motion.h1
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      {carouselImages[currentSlide].caption}
                    </motion.h1>
                    <motion.p
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      Conozca un poquito de lo que hay detrás de estos ideales
                    </motion.p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                className="carousel-btn carousel-btn-prev"
                onClick={prevSlide}
                aria-label="Anterior"
              >
                <FaChevronLeft />
              </button>
              <button
                className="carousel-btn carousel-btn-next"
                onClick={nextSlide}
                aria-label="Siguiente"
              >
                <FaChevronRight />
              </button>

              <div className="carousel-indicators">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </Col>
      </Row>

      <motion.h3
        className="team-title-animated"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
      >
        Nuestro Equipo
      </motion.h3>

      <Row className="team-row">
        {teamMembers.map((member, index) => (
          <Col key={index} xs={12} sm={6} lg={3} className="mb-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className={`team-card-3d ${flipped[index] ? "flipped" : ""}`}
                onClick={(e) => handleCardClick(index, e)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(index, e) }}
                role="button"
                tabIndex={0}
                aria-label={`Ver más información de ${member.name}`}
              >
                <div className="team-card-inner-3d">
                  {/* Front */}
                  <div className="team-card-front">
                    <div className="team-photo-wrapper">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="team-img"
                      />
                      <div className="photo-gradient"></div>
                    </div>
                    <div className="team-front-info">
                      <h4 className="team-name">{member.name}</h4>
                      <p className="team-role">{member.role}</p>
                    </div>
                  </div>

                  {/* Back */}
                  <div className="team-card-back">
                    <div className="team-back-content">
                      <h4 className="team-name-back">{member.name}</h4>

                      <div className="team-info-item">
                        <FaGraduationCap size={16} className="info-icon" />
                        <p>{member.education}</p>
                      </div>

                      <div className="team-info-item">
                        <FaBriefcase size={16} className="info-icon" />
                        <p>{member.expertise}</p>
                      </div>

                      <div className="team-status">
                        <span className="status-badge">{member.status}</span>
                      </div>

                      <div className="team-social-links">
                        {member.instagram && (
                          <a
                            href={member.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn instagram-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaInstagram size={18} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-btn linkedin-btn"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaLinkedin size={18} />
                          </a>
                        )}
                      </div>

                      <div className="song-section">
                        <p>
                          {playing[index]
                            ? "Reproduciendo..."
                            : "Canción Favorita:"}
                          <br />
                          <strong>{member.songName}</strong>
                        </p>
                        <button
                          type="button"
                          className="song-btn"
                          onClick={(e) => toggleAudio(index, e)}
                          aria-label={
                            playing[index]
                              ? "Pausar canción"
                              : "Reproducir canción"
                          }
                        >
                          {playing[index] ? <FaPause /> : <FaPlay />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </Col>
        ))}
      </Row>
    </div>
  );
}
