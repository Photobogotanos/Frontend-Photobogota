import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import { FaCamera } from "react-icons/fa";
import SpotCard from "./SpotCard";
import "./MiPerfil.css";
import { col, div } from "framer-motion/client";

export default function MiPerfil() {
  const [tab, setTab] = useState("publicaciones");

  return (
    
    <Container fluid className="perfil-container">
      <br />
      <br />
      {/* HEADER */}
      <div className="perfil-header">
        <img
          src="public/images/users/fotico_perfil.jfif"
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

      {/* STATS + EDITAR */}
      <Row className="perfil-stats">
        <Col xs={4} className="perfil-stat">
          <h4>29</h4>
          <p>Publicaciones</p>
        </Col>

        <Col xs={4} className="perfil-edit-wrapper">
          <button className="btn-editar-perfil">
            <FiEdit3 size={18} /> Editar perfil
          </button>
        </Col>

        <Col xs={4} className="perfil-stat">
          <h4>48</h4>
          <p>Reseñas</p>
        </Col>
      </Row>

      {/* LINEA SEPARADORA */}
      <div className="line-divider" />

      {/* TABS */}
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

      {/* TABS CONTENT */}
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
    {/* Puedes seguir agregando más tarjetas y se irán acomodando automáticamente */}
  </div>
)}

        {tab === "resenas" && (
          <p className="text-muted mt-5 text-center">Aún no hay reseñas.</p>
        )}

        {tab === "guardados" && (
          <p className="text-muted mt-5 text-center">No has guardado publicaciones.</p>
        )}

      </div>
    </Container>
  );
}
