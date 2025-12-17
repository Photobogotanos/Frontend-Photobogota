import { FaTimes, FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart, FaShare, FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useState, useEffect } from "react";
import ListaComentarios from "@/components/comentarios/ListaComentario/ListaComentarios";
import EntradaComentario from "@/components/comentarios/EntradaComentario/EntradaComentario";
import "./PublicacionCompleta.css";

const AVATAR_DEFAULT = "/images/user-pfp/default-avatar.jpg";
const IMAGEN_DEFAULT = "/images/publicaciones/default-post.jpg";

const PublicacionCompleta = ({ publicacion, alCerrar, alToggleMeGusta, alToggleGuardar }) => {
  const [indiceImagenActual, setIndiceImagenActual] = useState(0);
  const [errorImagen, setErrorImagen] = useState(false);
  const [errorAvatar, setErrorAvatar] = useState(false);
  const tieneVariasImagenes = publicacion.imagenes.length > 1;

  useEffect(() => {
    document.body.classList.add('body-no-scroll');
    return () => document.body.classList.remove('body-no-scroll');
  }, []);

  const imagenAnterior = () => {
    setIndiceImagenActual((prev) => prev === 0 ? publicacion.imagenes.length - 1 : prev - 1);
    setErrorImagen(false);
  };

  const imagenSiguiente = () => {
    setIndiceImagenActual((prev) => prev === publicacion.imagenes.length - 1 ? 0 : prev + 1);
    setErrorImagen(false);
  };

  return (
    <div className="overlay-post-completo" onClick={alCerrar}>
      <div className="contenedor-post-completo" onClick={(e) => e.stopPropagation()}>
        
        {/* Sección imagen */}
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

        {/* Sección comentarios */}
        <div className="seccion-comentarios-post">
          <div className="header-modal">
            <button className="btn-close-modal" onClick={alCerrar}>
              <FaTimes />
            </button>
            <button className="boton-guardar-modal" onClick={() => alToggleGuardar && alToggleGuardar(publicacion.id)}>
              {publicacion.guardado ? <FaBookmark className="text-warning" /> : <FaRegBookmark />}
            </button>
          </div>

          <div className="header-usuario">
            <img
              src={errorAvatar ? AVATAR_DEFAULT : publicacion.avatar}
              onError={() => setErrorAvatar(true)}
              alt="usuario"
            />
            <div>
              <strong>{publicacion.usuario}</strong>
              <div className="texto-secundario">{publicacion.nombreUsuario} · {publicacion.tiempo}</div>
            </div>
          </div>

          <p className="texto-post">{publicacion.texto}</p>

          <div className="interacciones-post">
            <button className="boton-interaccion" onClick={() => alToggleMeGusta(publicacion.id)}>
              {publicacion.meGustaDado ? <FaHeart className="text-danger" /> : <FaRegHeart />}
              <span>{publicacion.meGustas}</span>
            </button>
            <button className="boton-interaccion">
              <FaShare />
            </button>
          </div>

          <div className="lista-comentarios">
            <ListaComentarios idPublicacion={publicacion.id} />
          </div>
          
          <div className="contenedor-entrada-comentario">
            <EntradaComentario idPublicacion={publicacion.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicacionCompleta;