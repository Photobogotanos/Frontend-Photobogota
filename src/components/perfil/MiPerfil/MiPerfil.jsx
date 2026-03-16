import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { FiEdit3 } from "react-icons/fi";
import { FaCamera, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import "./MiPerfil.css";

export default function MiPerfil() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("publicaciones");
  const [tienePublicaciones, setTienePublicaciones] = useState(true);
  const [tieneResenas, setTieneResenas] = useState(true);
  const [tieneGuardados, setTieneGuardados] = useState(false);
  const [mostrarEditarPerfil, setMostrarEditarPerfil] = useState(false);
  const [mostrarFotoPerfil, setMostrarFotoPerfil] = useState(false);
  const [perfilData, setPerfilData] = useState({
    nombreCompleto: "Juan Sebastian Romero",
    nombreUsuario: "sxbxxs.r",
    descripcion:
      "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
    foto: "public/images/user-pfp/default-avatar.jpg",
  });

  const handlePerfilActualizado = (datosActualizados) => {
    setPerfilData(datosActualizados);
  };

  return (
    <Container fluid className="perfil-container">
      <div className="perfil-header">
        <img
          src={perfilData.foto}
          alt="Foto perfil"
          className="perfil-avatar"
          onClick={() => setMostrarFotoPerfil(true)}
          style={{ cursor: "pointer" }}
        />

        <div className="perfil-info">
          <div className="perfil-badges">
            <span className="badge-miembro">
              <FaCamera /> Miembro
            </span>
            <span className="badge-nivel">Nivel: 320</span>
          </div>

          <h3 className="perfil-nombre">{perfilData.nombreCompleto}</h3>
          <p className="perfil-username">@{perfilData.nombreUsuario}</p>

          <p className="perfil-descripcion">{perfilData.descripcion}</p>
        </div>
      </div>

      <Row className="perfil-stats">
        <Col xs={4} className="perfil-stat">
          <h4>{tienePublicaciones ? "6" : "0"}</h4>
          <p>Publicaciones</p>
        </Col>

        <Col xs={4} className="perfil-stat">
          <h4>{tieneResenas ? "6" : "0"}</h4>
          <p>Reseñas</p>
        </Col>

        <Col xs={4} className="perfil-stat">
          <h4>{tieneGuardados ? "12" : "0"}</h4>
          <p>Guardados</p>
        </Col>
      </Row>

      <div className="perfil-edit-wrapper">
        <button
          className="btn-editar-perfil"
          onClick={() => setMostrarEditarPerfil(true)}
        >
          <FiEdit3 size={18} /> Editar perfil
        </button>
      </div>

      <div className="line-divider" />

      <div className="perfil-tabs">
        <button
          className={tab === "publicaciones" ? "tab-activa" : ""}
          onClick={() => setTab("publicaciones")}
        >
          Mis Spots
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
        {/* SECCIÓN PUBLICACIONES */}
        {tab === "publicaciones" && (
          <div>
            {tienePublicaciones ? (
              <div className="publicaciones-grid">
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Alcaldía local Barrios Unidos"
                  tags={["Naturaleza", "Spots"]}
                  rating="4.8"
                  likes="294"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Parroquia San Anselmo"
                  tags={["Spots"]}
                  rating="2.6"
                  likes="12"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Cl. 152 #9-57, Bogotá"
                  tags={["Naturaleza", "Spots"]}
                  rating="3.8"
                  likes="65"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Parque de Bavaria"
                  tags={["Urbano", "Spots"]}
                  rating="4.3"
                  likes="79"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Cl. 152 #9-57, Bogotá"
                  tags={["Naturaleza", "Spots"]}
                  rating="3.8"
                  likes="65"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Parque de Bavaria"
                  tags={["Urbano", "Spots"]}
                  rating="4.3"
                  likes="79"
                />
              </div>
            ) : (
              <div className="no-contenido">
                <div className="empty-icon">
                  <FaMapMarkerAlt size={48} />
                </div>
                <h4>No tienes publicaciones</h4>
                <p>
                  Comparte tus lugares favoritos para que otros los descubran
                </p>
                <button
                  className="btn-explorar"
                  onClick={() => navigate("/crear-publicacion")}
                >
                  ¡Crea tu primera publicación!
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN RESEÑAS */}
        {tab === "resenas" && (
          <div>
            {tieneResenas ? (
              <div className="reviews-grid">
                <ReviewCard
                  title="Jardín Botánico"
                  rating={5}
                  text="Un paraíso natural increíble. Perfecto para senderismo y fotografía. La biodiversidad es impresionante. Recomiendo llevar ropa adecuada y suficiente agua."
                  likes={567}
                  date="Hace 2 meses"
                  placeId={"4"}
                />
                <ReviewCard
                  title="Restaurante El Cielo"
                  rating={4}
                  text="Experiencia gastronómica excepcional con presentación creativa de platos. Los sabores son únicos y el servicio es impecable. Un poco costoso, pero vale la pena para ocasiones especiales."
                  likes={234}
                  date="Hace 1 mes"
                  placeId={"3"}
                />
                <ReviewCard
                  title="Café Bourbon"
                  rating={4}
                  text="El mejor café de la ciudad. Ambiente acogedor y personal amable. Perfecto para trabajar o leer un libro tranquilo."
                  likes={189}
                  date="Hace 2 semanas"
                  placeId={"2"}
                />
                <ReviewCard
                  title="Galería de Arte Moderno"
                  rating={5}
                  text="Exposiciones increíbles y siempre renovadas. El espacio es luminoso y bien diseñado. Entrada gratuita los domingos."
                  likes={312}
                  date="Hace 1 semana"
                  placeId={"1"}
                />
                <ReviewCard
                  title="Museo del oro"
                  rating={5}
                  text="La experiencia en el Museo del Oro fue increíble, con una impresionante colección que cuenta la historia de los pueblos indígenas de Colombia. Las exhibiciones están bien organizadas y el espacio es moderno. Sin embargo, el único inconveniente fue la falta de parqueadero cercano, lo que obligó a dejar el carro lejos. A pesar de eso, es una visita muy recomendable para conocer más sobre la cultura colombiana."
                  likes={945}
                  date="Hace 3 meses"
                  placeId={"5"}
                />
                <ReviewCard
                  title="Bar Gyal"
                  rating={2}
                  text="Un espacio reducido e incómodo, donde los precios son demasiado altos para la calidad de lo que ofrecen. Aunque la atención al cliente es buena, el ambiente se ve opacado por la actitud del público, que no es el más agradable. En general, no lo recomendaría debido a la relación calidad-precio y el entorno."
                  likes={9}
                  date="Hace 20 días"
                  placeId={"4"}
                />
              </div>
            ) : (
              <div className="no-contenido">
                <div className="empty-icon">
                  <FaRegEdit size={48} />
                </div>
                <h4>No tienes reseñas</h4>
                <p>Comparte tu experiencia sobre los lugares que visitas</p>
                <button
                  className="btn-explorar"
                  onClick={() => navigate("/mapa")}
                >
                  Escribir primera reseña
                </button>
              </div>
            )}
          </div>
        )}

        {/* SECCIÓN GUARDADOS */}
        {tab === "guardados" && (
          <div>
            {tieneGuardados ? (
              <div className="guardados-grid">
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Café Bourbon"
                  tags={["Café", "Spots"]}
                  rating="4.7"
                  likes="189"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Galería de Arte Moderno"
                  tags={["Arte", "Cultural"]}
                  rating="4.5"
                  likes="156"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Teatro Nacional"
                  tags={["Teatro", "Cultural"]}
                  rating="4.8"
                  likes="278"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Mirador de la Calera"
                  tags={["Vistas", "Montaña"]}
                  rating="4.6"
                  likes="124"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Restaurante Andrés Carne de Res"
                  tags={["Restaurante", "Nocturno"]}
                  rating="4.4"
                  likes="367"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Parque de la 93"
                  tags={["Parque", "Urbano"]}
                  rating="4.2"
                  likes="89"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Usaquén - Mercado de las Pulgas"
                  tags={["Mercado", "Artesanías"]}
                  rating="4.3"
                  likes="142"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Cinemateca Distrital"
                  tags={["Cine", "Cultural"]}
                  rating="4.1"
                  likes="67"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Biblioteca Virgilio Barco"
                  tags={["Biblioteca", "Arquitectura"]}
                  rating="4.7"
                  likes="98"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Zona G - Gastronómica"
                  tags={["Gastronomía", "Restaurantes"]}
                  rating="4.5"
                  likes="213"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Parque Simón Bolívar"
                  tags={["Parque", "Naturaleza"]}
                  rating="4.6"
                  likes="178"
                />
                <SpotCard
                  img="public/images/publicaciones/default-post.jpg"
                  title="Monserrate"
                  tags={["Religioso", "Vistas"]}
                  rating="4.9"
                  likes="456"
                />
              </div>
            ) : (
              <div className="no-contenido">
                <div className="empty-icon">
                  <GrMapLocation size={48} />
                </div>
                <h4>No hay lugares guardados</h4>
                <p>Guarda tus lugares favoritos, para visitarlos después</p>
                <button
                  className="btn-explorar"
                  onClick={() => navigate("/mapa")}
                >
                  Explorar lugares
                </button>
              </div>
            )}
          </div>
        )}

        <div className="debug-controls">
          <small>Debug:</small>
          <div className="debug-buttons">
            <button onClick={() => setTienePublicaciones(!tienePublicaciones)}>
              {tienePublicaciones ? "Sin publicaciones" : "Con publicaciones"}
            </button>
            <button onClick={() => setTieneResenas(!tieneResenas)}>
              {tieneResenas ? "Sin reseñas" : "Con reseñas"}
            </button>
            <button onClick={() => setTieneGuardados(!tieneGuardados)}>
              {tieneGuardados ? "Sin guardados" : "Con guardados"}
            </button>
          </div>
        </div>
      </div>

      <EditarPerfilModal
        show={mostrarEditarPerfil}
        onHide={() => setMostrarEditarPerfil(false)}
        perfilData={perfilData}
        onPerfilActualizado={handlePerfilActualizado}
      />

      <FotoPerfilModal
        show={mostrarFotoPerfil}
        onHide={() => setMostrarFotoPerfil(false)}
        foto={perfilData.foto}
        nombre={perfilData.nombreCompleto}
      />
    </Container>
  );
}
