import { useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import SpotCard from "./SpotCard";
import "./MiPerfil.css";

export default function MiPerfil() {
  const [tab, setTab] = useState("publicaciones");

  return (
    <Container className="perfil-container">

      {/* HEADER DEL PERFIL */}
      <div className="perfil-header">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          alt="Foto perfil"
          className="perfil-avatar"
        />

        <div className="perfil-info">
          <div className="perfil-badges">
            <span className="badge-miembro">🟢 Miembro</span>
            <span className="badge-nivel">Nivel: 320</span>
          </div>

          <h3 className="perfil-nombre">Juan Sebastián Romero</h3>
          <p className="perfil-username">@sbxbxs.r</p>
          <p className="perfil-descripcion">
            Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!
          </p>
        </div>
      </div>

      {/* ESTADÍSTICAS */}
      <Row className="perfil-stats mt-4">
        <Col className="perfil-stat">
          <h4>29</h4>
          <p>Publicaciones</p>
        </Col>

        <Col className="perfil-editar">
          <Button variant="light" className="btn-editar-perfil">
            ✏️ Editar perfil
          </Button>
        </Col>

        <Col className="perfil-stat">
          <h4>48</h4>
          <p>Reseñas</p>
        </Col>
      </Row>

      {/* TABS */}
      <div className="perfil-tabs mt-4">
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

      {/* CONTENIDO SEGÚN TAB */}
      <div className="perfil-tab-content">

        {tab === "publicaciones" && (
          <Row className="card-grid">
            <SpotCard
              img="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
              title="Alcaldía local Barrios Unidos"
              tags={["Naturaleza", "Spots"]}
              rating="4.8"
              likes="294"
            />
            <SpotCard
              img="https://images.unsplash.com/photo-1581291519195-ef11498d1cf5"
              title="Parroquia San Anselmo"
              tags={["Spots"]}
              rating="2.6"
              likes="12"
            />
            <SpotCard
              img="https://images.unsplash.com/photo-1501785888041-af3ef285b470"
              title="Cl. 152 #9-57, Bogotá"
              tags={["Naturaleza", "Spots"]}
              rating="3.8"
              likes="65"
            />
          </Row>
        )}

        {tab === "resenas" && (
          <p className="text-muted mt-5">Aún no hay reseñas.</p>
        )}

        {tab === "guardados" && (
          <p className="text-muted mt-5">No has guardado publicaciones.</p>
        )}
      </div>
    </Container>
  );
}
