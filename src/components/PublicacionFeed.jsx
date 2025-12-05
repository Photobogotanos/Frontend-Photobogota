import { FaHeart, FaCommentDots, FaShare, FaRegHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState } from "react";
import PublicacionCompleta from "./PublicacionCompleta";

const AVATAR_DEFAULT = "/images/user-pfp/default-avatar.jpg";
const IMAGEN_DEFAULT = "/images/publicaciones/default-post.jpg"; 

const PublicacionFeed = ({ publicacion, alToggleMeGusta }) => {
  const [abrirCompleto, setAbrirCompleto] = useState(false);
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);

  const tieneVariasImagenes = publicacion.imagenes.length > 1;

  const imagenAnterior = (e) => {
    e.stopPropagation();
    setIndiceImagenActual((prev) =>
      prev === 0 ? publicacion.imagenes.length - 1 : prev - 1
    );
    setErrorImagen(false);
  };

  const imagenSiguiente = (e) => {
    e.stopPropagation();
    setIndiceImagenActual((prev) =>
      prev === publicacion.imagenes.length - 1 ? 0 : prev + 1
    );
    setErrorImagen(false);
  };

  return (
    <>
      <div className="tarjeta-publicacion">
        {/* Header */}
        <div className="d-flex align-items-center mb-3">
          <img
            src={errorAvatar ? AVATAR_DEFAULT : publicacion.avatar}
            onError={() => setErrorAvatar(true)}
            className="rounded-circle me-3"
            width={45}
            height={45}
            alt="usuario"
          />

          <div className="flex-grow-1">
            <strong className="d-block">{publicacion.usuario}</strong>
            <div className="texto-secundario">
              {publicacion.nombreUsuario} · {publicacion.tiempo}
            </div>
          </div>

          <span className="ms-auto insignia-popular">Popular 🔥</span>
        </div>

        {/* Carrusel */}
        <div className="contenedor-imagen-feed">
          <div className="carrusel-imagenes" onClick={() => setAbrirCompleto(true)}>
            <img
              src={errorImagen ? IMAGEN_DEFAULT : publicacion.imagenes[indiceImagenActual]}
              onError={() => setErrorImagen(true)}
              className="imagen-feed"
              alt="publicación"
              loading="lazy"
            />

            {tieneVariasImagenes && (
              <>
                <button className="boton-nav-carrusel izquierda" onClick={imagenAnterior}>
                  <FaChevronLeft />
                </button>

                <button className="boton-nav-carrusel derecha" onClick={imagenSiguiente}>
                  <FaChevronRight />
                </button>

                <div className="indicador-carrusel">
                  {indiceImagenActual + 1} / {publicacion.imagenes.length}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Interacciones */}
        <div className="d-flex gap-4 my-3">
          <button
            className="boton-interaccion"
            onClick={() => alToggleMeGusta(publicacion.id)}
          >
            {publicacion.meGustaDado ? (
              <FaHeart className="text-danger" />
            ) : (
              <FaRegHeart />
            )}
            <span className="ms-1">{publicacion.meGustas}</span>
          </button>

          <button
            className="boton-interaccion"
            onClick={() => setAbrirCompleto(true)}
          >
            <FaCommentDots />
            <span className="ms-1">{publicacion.comentarios}</span>
          </button>

          <button className="boton-interaccion">
            <FaShare />
          </button>
        </div>

        {/* Texto y comentarios */}
        <p className="mb-2 texto-publicacion">{publicacion.texto}</p>
        <span
          className="enlace-comentarios"
          onClick={() => setAbrirCompleto(true)}
        >
          Ver los {publicacion.comentarios} comentarios
        </span>
      </div>

      {/* Modal de publicación completa */}
      {abrirCompleto && (
        <PublicacionCompleta
          publicacion={publicacion}
          alCerrar={() => setAbrirCompleto(false)}
          alToggleMeGusta={alToggleMeGusta}
        />
      )}
    </>
  );
};

export default PublicacionFeed;