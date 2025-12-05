import { FaTimes, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaCommentDots, FaShare } from "react-icons/fa";
import { useState } from "react";
import ListaComentarios from "./ListaComentarios";
import EntradaComentario from "./EntradaComentario";

const AVATAR_DEFAULT = "/images/user-pfp/default-avatar.jpg";
const IMAGEN_DEFAULT = "/images/publicaciones/default-post.jpg";

const PublicacionCompleta = ({ publicacion, alCerrar, alToggleMeGusta }) => {
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);
  const [errorImagen, setErrorImagen] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const tieneVariasImagenes = publicacion.imagenes.length > 1;

  const imagenAnterior = () => {
    setIndiceImagenActual((prev) => 
      prev === 0 ? publicacion.imagenes.length - 1 : prev - 1
    );
    setErrorImagen(false);
  };

  const imagenSiguiente = () => {
    setIndiceImagenActual((prev) => 
      prev === publicacion.imagenes.length - 1 ? 0 : prev + 1
    );
    setErrorImagen(false);
  };

  return (
    <div className="overlay-post-completo" onClick={alCerrar}>
      <div className="contenedor-post-completo" onClick={(e) => e.stopPropagation()}>
        
        {/* Izquierda: imagen con navegación */}
        <div className="seccion-imagen-post">
          <img 
            src={errorImagen ? IMAGEN_DEFAULT : publicacion.imagenes[indiceImagenActual]}
            onError={() => setErrorImagen(true)}
            className="imagen-post-completo" 
            alt="publicación"
          />
          
          {tieneVariasImagenes && (
            <>
              <button className="boton-nav-imagen izquierda" onClick={imagenAnterior}>
                <FaChevronLeft />
              </button>
              <button className="boton-nav-imagen derecha" onClick={imagenSiguiente}>
                <FaChevronRight />
              </button>
              <div className="indicador-imagenes">
                {indiceImagenActual + 1} / {publicacion.imagenes.length}
              </div>
            </>
          )}
        </div>

        {/* Derecha: información y comentarios */}
        <div className="seccion-comentarios-post">
          <button className="btn btn-light mb-3" onClick={alCerrar}>
            <FaTimes /> Cerrar
          </button>

          {/* Header del usuario */}
          <div className="d-flex align-items-center mb-3">
            <img
              src={errorAvatar ? AVATAR_DEFAULT : publicacion.avatar}
              onError={() => setErrorAvatar(true)}
              className="rounded-circle me-3"
              width={45}
              height={45}
              alt="usuario"
            />
            <div>
              <strong>{publicacion.usuario}</strong>
              <div className="texto-secundario">
                {publicacion.nombreUsuario} · {publicacion.tiempo}
              </div>
            </div>
          </div>

          <p className="mb-3">{publicacion.texto}</p>

          {/* Botones de interacción */}
          <div className="d-flex gap-4 mb-3 pb-3 border-bottom">
            <button 
              className="boton-interaccion"
              onClick={() => alToggleMeGusta(publicacion.id)}
            >
              {publicacion.meGustaDado ? <FaHeart className="text-danger" /> : <FaRegHeart />}
              <span className="ms-1">{publicacion.meGustas}</span>
            </button>
            <button className="boton-interaccion">
              <FaCommentDots />
              <span className="ms-1">{publicacion.comentarios}</span>
            </button>
            <button className="boton-interaccion">
              <FaShare />
            </button>
          </div>

          <ListaComentarios idPublicacion={publicacion.id} />
          <EntradaComentario idPublicacion={publicacion.id} />
        </div>
      </div>
    </div>
  );
};

export default PublicacionCompleta;