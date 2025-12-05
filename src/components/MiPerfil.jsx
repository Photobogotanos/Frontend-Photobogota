import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import SpotCard from "./SpotCard";
import ReviewCard from "./ReviewCard";
import "./MiPerfil.css";

export default function MiPerfil() {
  const [tab, setTab] = useState("publicaciones");

  return (
    
    <Container fluid className="perfil-container">
      
      <div className="perfil-header mt-5">
        <img
          src="public/images/default-post.jpg"
          alt="Foto perfil"
          className="perfil-avatar"
        />
        

        <div className="perfil-info">
          <div className="perfil-badges">
            <span className="badge-miembro"><FaCamera /> Miembro</span>
            <span className="badge-nivel">Nivel: 320</span>
          </div>

          <h3 className="perfil-nombre">Juan Sebastian Romero</h3>
          <p className="perfil-username">@sxbxxs.r</p>

          <p className="perfil-descripcion">
            Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos
            y explora nuevos destinos cercanos!
          </p>
        </div>
      </div>

      <Row className="perfil-stats">
        <Col xs={4} className="perfil-stat">
          <h4>29</h4>
          <p>Publicaciones</p>
        </Col>

        <Col xs={4} className="perfil-stat">
          <h4>48</h4>
          <p>Reseñas</p>
        </Col>
      </Row>

      <Row>
          <button className="btn-editar-perfil">
            <FiEdit3 size={18} /> Editar perfil
          </button>
      </Row>

      <div className="line-divider" />

      <div className="perfil-tabs">
        <button
          className={tab === "publicaciones" ? "tab-activa" : ""}
          onClick={() => setTab("publicaciones")}
        >
          Mis Publicaciones
        </button>

        <button
          className={tab === "resenas" ? "tab-activa" : ""}
          onClick={() => setTab("resenas")}
        >
          Reseñas
        </button>

        <button
          className={tab === "guardados" ? "tab-activa" : ""}
          onClick={() => setTab("guardados")}
        >
          Guardados
        </button>
      </div>

      <div className="perfil-tab-content">

        {tab === "publicaciones" && (
  <div className="publicaciones-grid">
    <SpotCard
      img="public/images/default-post.jpg"
      title="Alcaldía local Barrios Unidos"
      tags={["Naturaleza", "Spots"]}
      rating="4.8"
      likes="294"
    />
    <SpotCard
      img="public/images/default-post.jpg"
      title="Parroquia San Anselmo"
      tags={["Spots"]}
      rating="2.6"
      likes="12"
    />
    <SpotCard
      img="public/images/default-post.jpg"
      title="Cl. 152 #9-57, Bogotá"
      tags={["Naturaleza", "Spots"]}
      rating="3.8"
      likes="65"
    />
    <SpotCard
      img="public/images/default-post.jpg"
      title="Parque de Bavaria"
      tags={["Urbano", "Spots"]}
      rating="4.3"
      likes="79"
    />
    <SpotCard
      img="public/images/default-post.jpg"
      title="Cl. 152 #9-57, Bogotá"
      tags={["Naturaleza", "Spots"]}
      rating="3.8"
      likes="65"
    />
    <SpotCard
      img="public/images/default-post.jpg"
      title="Parque de Bavaria"
      tags={["Urbano", "Spots"]}
      rating="4.3"
      likes="79"
    />
  </div>
)}
    
        {tab === "resenas" && (
  <div className="reviews-container">
    <ReviewCard
      title="Museo del oro"
      rating={5}
      text="La experiencia en el Museo del Oro fue increíble, con una impresionante colección que cuenta la historia de los pueblos indígenas de Colombia. Las exhibiciones están bien organizadas y el espacio es moderno. Sin embargo, el único inconveniente fue la falta de parqueadero cercano, lo que obligó a dejar el carro lejos. A pesar de eso, es una visita muy recomendable para conocer más sobre la cultura colombiana."
      likes={45}
      date="3 meses"
    />

    <ReviewCard
      title="Bar Gyal"
      rating={2}
      text="Un espacio reducido e incómodo, donde los precios son demasiado altos para la calidad de lo que ofrecen. Aunque la atención al cliente es buena, el ambiente se ve opacado por la actitud del público, que no es el más agradable. En general, no lo recomendaría debido a la relación calidad-precio y el entorno."
      likes={9}
      date="20 días"
    />
  </div>
)}
      </div>
    </Container>
  );
}
