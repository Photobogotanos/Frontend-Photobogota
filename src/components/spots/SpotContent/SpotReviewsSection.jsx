import { FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NuevaResenaCard from "./NuevaResenaCard";
import ResenasLista from "./ResenasLista";
import ModalSancion from "./ModalSancion";
import { obtenerIdAutorCalificacion, obtenerNombreAutorCalificacion } from "./spotContentUtils";

const MAX_COMENTARIO = 500;

const SpotReviewsSection = ({
  usuario,
  logueado,
  calificaciones,
  cargandoCalificaciones,
  miCalificacion,
  enviandoCalificacion,
  editandoResena,
  setEditandoResena,
  sancionRecibida,
  setSancionRecibida,
  estadoResena,
  dispatchResena,
  handleSubmitCalificacion,
  handleCancelarEdicion,
  verEstadoDeSancion,
  abrirReporteResena,
  recargarUsuario,
}) => {
  const navigate = useNavigate();

  return (
    <div className="resenas-container">
      <div className="resenas-inner">
        <h3 className="resenas-titulo">
          <FaCommentDots className="section-icon" /> Calificaciones
        </h3>
        <NuevaResenaCard
          logueado={logueado}
          miCalificacion={miCalificacion}
          editandoResena={editandoResena}
          setEditandoResena={setEditandoResena}
          handleSubmitCalificacion={(e) =>
            handleSubmitCalificacion(e, logueado, recargarUsuario)
          }
          estadoResena={estadoResena}
          dispatchResena={dispatchResena}
          enviandoCalificacion={enviandoCalificacion}
          handleCancelarEdicion={handleCancelarEdicion}
          maxComentario={MAX_COMENTARIO}
        />
        <ResenasLista
          cargandoCalificaciones={cargandoCalificaciones}
          calificaciones={calificaciones}
          usuario={usuario}
          navigate={navigate}
          abrirReporteResena={abrirReporteResena}
          obtenerIdAutorCalificacion={obtenerIdAutorCalificacion}
          obtenerNombreAutorCalificacion={obtenerNombreAutorCalificacion}
        />
      </div>
      <ModalSancion
        show={Boolean(sancionRecibida)}
        sancion={sancionRecibida}
        onCerrar={() => setSancionRecibida(null)}
        onVerEstado={() => verEstadoDeSancion(recargarUsuario)}
      />
    </div>
  );
};

export default SpotReviewsSection;