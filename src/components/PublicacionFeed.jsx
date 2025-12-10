import { FaHeart, FaCommentDots, FaShare, FaRegHeart, FaChevronLeft, FaChevronRight, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState } from "react";
import PublicacionCompleta from "./PublicacionCompleta";
import "./PublicacionFeed.css";

const AVATAR_DEFAULT = "/images/user-pfp/default-avatar.jpg";
const IMAGEN_DEFAULT = "/images/publicaciones/default-post.jpg";

const PublicacionFeed = ({ publicacion, alToggleMeGusta, alToggleGuardar }) => {
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
            <strong className="d-block texto-usuario">{publicacion.usuario}</strong>
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
                <button
                  className="boton-nav-carrusel izquierda"
                  onClick={imagenAnterior}
                  aria-label="Imagen anterior"
                >
                  <FaChevronLeft />
                </button>

                <button
                  className="boton-nav-carrusel derecha"
                  onClick={imagenSiguiente}
                  aria-label="Imagen siguiente"
                >
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
        <div className="d-flex justify-content-between align-items-center my-3">
          <div className="d-flex gap-4">
            <button
              className="boton-interaccion"
              onClick={() => alToggleMeGusta(publicacion.id)}
            >
              {publicacion.meGustaDado ? (
                <FaHeart className="text-danger" />
              ) : (
                <FaRegHeart />
              )}
              <span className="ms-1 contador-interaccion">{publicacion.meGustas}</span>
            </button>

            <button
              className="boton-interaccion"
              onClick={() => setAbrirCompleto(true)}
            >
              <FaCommentDots />
              <span className="ms-1 contador-interaccion">{publicacion.comentarios}</span>
            </button>

            <button className="boton-interaccion">
              <FaShare />
            </button>
          </div>

          {/* Botón de guardar */}
          <button
            className="boton-interaccion boton-guardar"
            onClick={() => alToggleGuardar && alToggleGuardar(publicacion.id)}
          >
            {publicacion.guardado ? (
              <FaBookmark className="text-warning" />
            ) : (
              <FaRegBookmark />
            )}
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
          alToggleGuardar={alToggleGuardar}
        />
      )}
    </>
  );
};

export default PublicacionFeed;