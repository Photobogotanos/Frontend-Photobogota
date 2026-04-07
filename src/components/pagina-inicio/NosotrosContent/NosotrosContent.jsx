import { m, LazyMotion, domAnimation } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TeamCard from "./TeamCard";
import TeamCarousel from "./TeamCarousel.jsx";
import "./NosotrosContent.css";
import FotoNosotros2 from "/images/img-home/nosotros2.jpg?url";
import FotoNosotros3 from "/images/img-home/nosotros3.jpg?url";
import FotoSoto from "/images/img-home/soto.jpg?url";
import FotoSebastian from "/images/img-home/sebastian.jpg?url";
import FotoDanfel from "/images/img-home/danfel.jpg?url";
import FotoYanpol from "/images/img-home/yanpol.jpg?url";

import CancionSoto from '/songs/Daft-Punk-Instant-Crush.mp3?url';
import CancionSebastian from '/songs/Entrega-Grupo-Niche.mp3?url';
import CancionDanfel from '/songs/Gustavo-Cerati-Me-Quedo-Aqui.mp3?url';
import CancionYanpol from '/songs/Mazzy-Star-Fade-Into-You.mp3?url';

const fotoNosotros2 = FotoNosotros2;
const fotoNosotros3 = FotoNosotros3;
const fotoSoto = FotoSoto;
const fotoSebastian = FotoSebastian;
const fotoDanfel = FotoDanfel;
const fotoYanpol = FotoYanpol;

const carouselImages = [
  { id: "nosotros2", src: fotoNosotros2, alt: "Equipo PhotoBogota", caption: "Nosotros" },
  { id: "nosotros3", src: fotoNosotros3, alt: "Equipo celebrando", caption: "Juntos" },
];

const teamMembers = [
  {
    id: "sebastian-sotomayor",
    name: "Sebastian Sotomayor",
    role: "Full Stack Developer",
    photo: fotoSoto,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Experiencia en C#, programación móvil, escritorio y consola",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/sebass.ye?igsh=MXRldHhwanFhMzd0aA%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/sebassye/",
    song: CancionSoto,
    songName: "Instant Crush - Daft Punk",
  },
  {
    id: "sebastian-romero",
    name: "Sebastian Romero",
    role: "Frontend Developer",
    photo: fotoSebastian,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Especializado en desarrollo web moderno y diseño de interfaces",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/sxbxxs.r?igsh=MW8wOWVvNjQ1Y2J4ZA==",
    linkedin: null,
    song: CancionSebastian,
    songName: "Entrega - Grupo Niche",
  },
  {
    id: "daniel-cruz",
    name: "Daniel Cruz",
    role: "Frontend Developer",
    photo: fotoDanfel,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Desarrollador web con experiencia en php, angular, typescript y mysql",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/danfel_fr?igsh=ZW5vM3o0MTRuYWJv",
    linkedin: null,
    song: CancionDanfel,
    songName: "Me Quedo Aquí - Cerati",
  },
  {
    id: "juan-marin",
    name: "Juan Marin",
    role: "PowerApps Developer",
    photo: fotoYanpol,
    education: "Tecnólogo SENA - Análisis y Desarrollo de Software",
    expertise: "Desarrollador de aplicaciones con PowerApps y automatización con Power Automate",
    status: "Buscando oportunidades laborales",
    instagram: "https://www.instagram.com/void0bits?igsh=MTN0OWtvOHN3eGZhbQ==",
    linkedin: null,
    song: CancionYanpol,
    songName: "Fade Into You - Mazzy Star",
  },
];

export default function NosotrosContent() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [playing, setPlaying] = useState({});
  const audioRefs = useRef([]);

  useEffect(() => {
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

    return () => {
      audioRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
    };
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));

  const handleCardClick = (index, e) => {
    if (e.target.closest("button, a")) return;
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleAudio = (index, e) => {
    e.stopPropagation();
    const audio = audioRefs.current[index];
    if (!audio) return;

    if (playing[index]) {
      audio.pause();
      setPlaying((prev) => ({ ...prev, [index]: false }));
    } else {
      audioRefs.current.forEach((a, i) => {
        if (i !== index && a && !a.paused) a.pause();
      });
      setPlaying({});
      audio.currentTime = 0;
      audio.play()
        .then(() => setPlaying({ [index]: true }))
        .catch((err) => console.error("Error audio:", err));
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="nosotros-wrapper">
        <Row>
          <Col lg={6} className="mb-4 mb-lg-0">
            <m.h3
              className="nosotros-title-animated"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              ¿Quienes somos?
            </m.h3>
            <m.div
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
            </m.div>
          </Col>

          <Col lg={6}>
            <TeamCarousel
              images={carouselImages}
              currentSlide={currentSlide}
              onNext={nextSlide}
              onPrev={prevSlide}
              onGoTo={setCurrentSlide}
            />
          </Col>
        </Row>

        <m.h3
          className="team-title-animated"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Nuestro Equipo
        </m.h3>

        <Row className="team-row">
          {teamMembers.map((member, index) => (
            <Col key={member.id} xs={12} sm={6} lg={3} className="mb-4">
              <TeamCard
                member={member}
                index={index}
                flipped={!!flipped[index]}
                playing={!!playing[index]}
                onCardClick={(e) => handleCardClick(index, e)}
                onToggleAudio={(e) => toggleAudio(index, e)}
              />
            </Col>
          ))}
        </Row>
      </div>
    </LazyMotion>
  );
}