import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import "./LugarContent.css";

const LugarContent = () => {
  const { id } = useParams();
  const [lugar, setLugar] = useState(null);
  const [nuevaResena, setNuevaResena] = useState({ rating: 0, comentario: "" });
  const [hoverRating, setHoverRating] = useState(0);

  // === DATOS DE LUGARES CON RESEÑAS ===
  const lugaresData = {
    1: { 
      id: 1, 
      nombre: "Museo del Oro", 
      direccion: "Cra. 6 #15-88, Santa Fe, Bogotá, Cundinamarca",
      imagen: "/images/lugares/museo-oro.jpg",
      rating: 4.8,
      totalResenas: 1095,
      categoria: "Museo",
      descripcion: "El Museo del Oro del Banco de la República es uno de los museos más importantes de Colombia y del mundo. Alberga la colección de orfebrería prehispánica más grande del planeta, con más de 34.000 piezas de oro y 25.000 objetos en cerámica, piedra, hueso y textiles.",
      resenas: [
        {
          id: 1,
          usuario: "usuario_123",
          avatar: null,
          rating: 4,
          fecha: "Hace 2 meses",
          comentario: "La experiencia en el Museo del Oro fue increíble, con una impresionante colección que cuenta la historia de los pueblos indígenas de Colombia. Las exhibiciones están bien organizadas y el espacio es moderno. Sin embargo, el único inconveniente fue la falta de parqueadero cercano, lo que obligó a dejar el carro lejos. A pesar de eso, es una visita muy recomendable para aprender más sobre la cultura colombiana."
        },
        {
          id: 2,
          usuario: "gustavo_petrico",
          avatar: null,
          rating: 5,
          fecha: "Hace 3 meses",
          comentario: "El Museo del Oro, más que un espacio de exhibición, es un testimonio vivo de nuestra historia y nuestra identidad. A través de sus piezas precolombinas, el museo nos conecta con las raíces más profundas y nos recuerda la riqueza cultural que los pueblos indígenas de Colombia crearon y dejaron como legado para el mundo."
        },
        {
          id: 3,
          usuario: "danfel_fr",
          avatar: null,
          rating: 5,
          fecha: "Hace 3 días",
          comentario: "Este museo es muy chévere, lastima que nos robarón el oro los españoles"
        }
      ]
    },
    2: { 
      id: 2, 
      nombre: "Monserrate", 
      direccion: "Carrera 2 Este #21-48, Bogotá",
      imagen: "/images/lugares/monserrate.jpg",
      rating: 4.7,
      totalResenas: 2340,
      categoria: "Atractivo turístico",
      descripcion: "Cerro emblemático de Bogotá con una altura de 3.152 metros sobre el nivel del mar. En su cima se encuentra el Santuario del Señor Caído de Monserrate, uno de los principales sitios de peregrinación en Colombia.",
      resenas: [
        {
          id: 1,
          usuario: "maria_turista",
          avatar: null,
          rating: 5,
          fecha: "Hace 1 semana",
          comentario: "La vista desde Monserrate es espectacular. Subir en teleférico fue una experiencia increíble. El santuario es hermoso y hay muchos restaurantes con comida típica."
        }
      ]
    },
    3: { 
      id: 3, 
      nombre: "Plaza de Bolívar", 
      direccion: "Carrera 7 #11-10, Bogotá",
      imagen: "/images/lugares/plaza-bolivar.jpg",
      rating: 4.5,
      totalResenas: 3200,
      categoria: "Plaza",
      descripcion: "Principal plaza de la ciudad y centro neurálgico de Bogotá. Rodeada por edificios históricos como la Catedral Primada, el Capitolio Nacional, el Palacio de Justicia y el Palacio Liévano.",
      resenas: [
        {
          id: 1,
          usuario: "carlos_historia",
          avatar: null,
          rating: 4,
          fecha: "Hace 2 semanas",
          comentario: "Un lugar lleno de historia en el corazón de Bogotá. Las palomas son un símbolo icónico del lugar. Recomiendo visitar temprano para evitar las multitudes."
        }
      ]
    },
    4: { 
      id: 4, 
      nombre: "Jardín Botánico", 
      direccion: "Calle 63 #68-95, Bogotá",
      imagen: "/images/lugares/jardin-botanico.jpg",
      rating: 4.6,
      totalResenas: 1580,
      categoria: "Parque",
      descripcion: "El Jardín Botánico José Celestino Mutis es el jardín botánico más grande de Colombia, con una extensión de 19.5 hectáreas. Alberga más de 20.000 plantas de todo el país.",
      resenas: [
        {
          id: 1,
          usuario: "natura_lover",
          avatar: null,
          rating: 5,
          fecha: "Hace 5 días",
          comentario: "Un oasis en medio de la ciudad. Perfecto para pasar el día en familia. El invernadero de orquídeas es impresionante."
        }
      ]
    },
    5: { 
      id: 5, 
      nombre: "Museo Nacional", 
      direccion: "Carrera 7 #28-66, Bogotá",
      imagen: "/images/lugares/museo-nacional.jpg",
      rating: 4.7,
      totalResenas: 890,
      categoria: "Museo",
      descripcion: "El museo más antiguo de Colombia, fundado en 1823. Alberga más de 20,000 piezas incluyendo objetos de arte, historia y etnografía del periodo precolombino hasta la actualidad.",
      resenas: [
        {
          id: 1,
          usuario: "arte_colombia",
          avatar: null,
          rating: 5,
          fecha: "Hace 1 mes",
          comentario: "Excelente recorrido por la historia de Colombia. Las exhibiciones son muy completas y educativas. El edificio en sí es una obra arquitectónica impresionante."
        }
      ]
    }
  };

  useEffect(() => {
    // Cargar datos del lugar
    const lugarData = lugaresData[id];
    if (lugarData) {
      setLugar(lugarData);
    }
  }, [id]);

  const handleSubmitResena = (e) => {
    e.preventDefault();
    if (nuevaResena.rating === 0 || nuevaResena.comentario.trim() === "") {
      alert("Por favor completa la calificación y el comentario");
      return;
    }
    
    // Aquí iría la lógica para guardar la reseña
    console.log("Nueva reseña:", nuevaResena);
    
    // Resetear formulario
    setNuevaResena({ rating: 0, comentario: "" });
    alert("¡Reseña enviada exitosamente!");
  };

  const renderStars = (rating, isInteractive = false) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span 
          key={index}
          className={`star ${isInteractive ? 'interactive' : ''}`}
          onClick={isInteractive ? () => setNuevaResena({ ...nuevaResena, rating: starValue }) : undefined}
          onMouseEnter={isInteractive ? () => setHoverRating(starValue) : undefined}
          onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
        >
          {starValue <= (isInteractive ? (hoverRating || nuevaResena.rating) : rating) ? (
            <FaStar className="star-filled" />
          ) : (
            <FaRegStar className="star-empty" />
          )}
        </span>
      );
    });
  };

  if (!lugar) {
    return <div className="lugar-loading">Cargando...</div>;
  }

  return (
    <div className="lugar-content">
      {/* Imagen Principal */}
      <div className="lugar-imagen-principal">
        <img src={lugar.imagen} alt={lugar.nombre} />
      </div>

      {/* Información del Lugar */}
      <div className="lugar-info-container">
        <h1 className="lugar-nombre">{lugar.nombre}</h1>
        <p className="lugar-direccion">{lugar.direccion}</p>
        
        <div className="lugar-badges">
          <span className="badge-categoria">{lugar.categoria}</span>
          <div className="lugar-rating-badge">
            <FaStar className="star-icon" />
            <span className="rating-text">{lugar.rating}</span>
            <span className="reviews-text">({lugar.totalResenas} reseñas)</span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="lugar-acciones">
          <Button variant="primary" className="btn-ver-mapa">
            📍 Ver en mapa
          </Button>
          <Button variant="outline-primary" className="btn-galeria">
            📷 Galería
          </Button>
        </div>

        {/* Descripción */}
        <div className="lugar-descripcion">
          <h3>Sobre este lugar</h3>
          <p>{lugar.descripcion}</p>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <div className="resenas-container">
        <h2 className="resenas-titulo">Reseñas y comentarios</h2>

        {/* Formulario para Nueva Reseña */}
        <div className="nueva-resena-card">
          <h4>Deja tu reseña</h4>
          <form onSubmit={handleSubmitResena}>
            <div className="rating-input">
              <label>Tu calificación:</label>
              <div className="stars-input">
                {renderStars(nuevaResena.rating, true)}
              </div>
            </div>
            
            <div className="comentario-input">
              <textarea
                placeholder="Comparte tu experiencia en este lugar..."
                value={nuevaResena.comentario}
                onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                rows="4"
              />
            </div>
            
            <Button type="submit" variant="primary">
              Publicar reseña
            </Button>
          </form>
        </div>

        {/* Lista de Reseñas Existentes */}
        <div className="resenas-lista">
          {lugar.resenas.map((resena) => (
            <div key={resena.id} className="resena-card">
              <div className="resena-header">
                <div className="resena-usuario">
                  <div className="usuario-avatar">
                    {resena.avatar ? (
                      <img src={resena.avatar} alt={resena.usuario} />
                    ) : (
                      <div className="avatar-placeholder">
                        {resena.usuario.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="usuario-info">
                    <span className="usuario-nombre">{resena.usuario}</span>
                    <span className="resena-fecha">{resena.fecha}</span>
                  </div>
                </div>
                <div className="resena-rating">
                  {renderStars(resena.rating)}
                </div>
              </div>
              <p className="resena-comentario">{resena.comentario}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LugarContent;