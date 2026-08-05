import { FaRegCalendarAlt, FaFlag } from "react-icons/fa";
import StarRating from "./StarRating";

const ResenasLista = ({
  cargandoCalificaciones,
  calificaciones,
  usuario,
  navigate,
  abrirReporteResena,
  obtenerIdAutorCalificacion,
  obtenerNombreAutorCalificacion,
}) =>
  cargandoCalificaciones ? (
    <div className="lugar-loading">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Cargando...</span>
      </div>
    </div>
  ) : calificaciones.length > 0 ? (
    <div className="resenas-lista">
      {calificaciones.map((calificacion) => {
        const idUsuarioLogueado = usuario?.nombreUsuario ?? usuario?.login ?? usuario?.id;
        const esPropia =
          idUsuarioLogueado &&
          obtenerIdAutorCalificacion(calificacion) ===
            idUsuarioLogueado;
        const nombreAutor =
          obtenerNombreAutorCalificacion(calificacion);
        const fecha =
          calificacion.fechaCreacion ||
          calificacion.fecha ||
          calificacion.createdAt;

        const navegarAlPerfil = (e) => {
          e.stopPropagation();
          navigate(
            esPropia ? "/perfil" : `/usuario/${nombreAutor}`,
          );
        };

        return (
          <div key={calificacion.id} className="resena-card">
            <div className="resena-header">
              <div className="resena-usuario">
                <div
                  className="usuario-avatar"
                  onClick={navegarAlPerfil}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      navegarAlPerfil(e);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={
                    esPropia
                      ? "Ver tu perfil"
                      : `Ver perfil de ${nombreAutor}`
                  }
                >
                  <div className="avatar-placeholder">
                    {nombreAutor.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="usuario-info">
                  <button
                    type="button"
                    className="usuario-nombre"
                    onClick={navegarAlPerfil}
                    aria-label={
                      esPropia
                        ? "Ver tu perfil"
                        : `Ver perfil de ${nombreAutor}`
                    }
                  >
                    {nombreAutor}
                    {esPropia && (
                      <span className="mi-resena-badge">(Tú)</span>
                    )}
                  </button>
                  {fecha && (
                    <span className="resena-fecha">
                      <FaRegCalendarAlt className="date-icon" />
                      {fecha}
                    </span>
                  )}
                </div>
              </div>
              <div className="resena-rating">
                <StarRating rating={calificacion.estrellas} />
              </div>
            </div>
            {calificacion.comentario && (
              <p className="resena-comentario">
                {calificacion.comentario}
              </p>
            )}
            {!esPropia && (
              <div className="resena-acciones">
                <button
                  type="button"
                  className="btn-reportar-resena"
                  onClick={() =>
                    abrirReporteResena(calificacion.id, nombreAutor)
                  }
                >
                  <FaFlag className="btn-icon" />
                  Reportar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  ) : (
    <p className="resenas-nota-vacia">
      Todavía no hay calificaciones para este spot. ¡Sé el primero en
      calificar!
    </p>
  );

export default ResenasLista;
