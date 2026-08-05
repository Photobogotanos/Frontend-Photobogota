import { useState, useEffect, useReducer, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaCommentDots } from "react-icons/fa";
import { obtenerSpotPorId } from "@/services/spot.service";
import {
  obtenerCalificacionesDelSpot,
  crearCalificacion,
  actualizarCalificacion,
} from "@/services/calificacion.service";
import { useAuth } from "@/context/AuthContext";
import { useGuardados } from "@/hooks/useGuardados";
import { toast } from "react-hot-toast";
import { resenaReducer, initialResenaState } from "./ResenaReducer";
import ReportarModal from "./ReportarModal";
import SpotInfo from "./SpotInfo";
import NuevaResenaCard from "./NuevaResenaCard";
import ResenasLista from "./ResenasLista";
import MapaVista from "./MapaVista";
import "./SpotContent.css";

const MAX_COMENTARIO = 500;

// Extrae el id del autor de una calificación, sin importar la forma exacta
// en la que el backend lo haya serializado (usuario, usuario.id, usuarioId...)
const obtenerIdAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : (calificacion?.usuario?.login ??
      calificacion?.usuario?.id ??
      calificacion?.usuarioId ??
      calificacion?.idUsuario);

const obtenerNombreAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : calificacion?.usuario?.nombreUsuario ||
      calificacion?.usuario?.nombre ||
      calificacion?.nombreUsuario ||
      calificacion?.usuarioNombre ||
      "Usuario";

const MapaContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario, logueado } = useAuth();
  const { isGuardado, toggleGuardado } = useGuardados();
  const [spot, setSpot] = useState(null);
  const [cargandoSpot, setCargandoSpot] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [guardandoSpot, setGuardandoSpot] = useState(false);

  // Calificaciones (estrellas) del spot
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargandoCalificaciones, setCargandoCalificaciones] = useState(false);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [enviandoCalificacion, setEnviandoCalificacion] = useState(false);
  // Controla si el formulario de "mi calificación" está en modo edición.
  // Cuando el usuario ya calificó, por defecto se muestra en modo lectura.
  const [editandoResena, setEditandoResena] = useState(false);
  const [estadoResena, dispatchResena] = useReducer(
    resenaReducer,
    initialResenaState,
  );

  // Popup de reporte: puede abrirse desde una reseña puntual
  // (contextoReporte con resenaId) o desde el spot en general (contextoReporte null).
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [contextoReporte, setContextoReporte] = useState(null);

  const abrirReporteSpot = () => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte(null);
    setModalReporteAbierto(true);
  };

  const abrirReporteResena = (resenaId, nombreAutorResena) => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte({ resenaId, nombreAutorResena });
    setModalReporteAbierto(true);
  };

  const cerrarReporte = () => {
    setModalReporteAbierto(false);
    setContextoReporte(null);
  };

  const handleGuardarSpot = async () => {
    if (!logueado) {
      toast.error("Inicia sesión para guardar spots");
      return;
    }
    setGuardandoSpot(true);
    const resultado = await toggleGuardado(id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
    } else {
      toast.error(resultado.mensaje);
    }
    setGuardandoSpot(false);
  };

  useEffect(() => {
    if (!id) return;
    let activo = true;

    const cargarSpot = async () => {
      if (!activo) return;
      setCargandoSpot(true);
      const resultado = await obtenerSpotPorId(id);
      if (!activo || !resultado) return;
      if (resultado.exitoso) {
        setSpot(resultado.datos);
      } else {
        toast.error(resultado.mensaje);
      }
      setCargandoSpot(false);
    };
    cargarSpot();

    return () => {
      activo = false;
    };
  }, [id]);

  // Trae todas las calificaciones del spot y detecta si el usuario logueado
  // ya tiene una entrada propia, para pasar el formulario a modo edición.
  const cargarCalificaciones = useCallback(
    async (spotId) => {
      setCargandoCalificaciones(true);
      const resultado = await obtenerCalificacionesDelSpot(spotId);

      if (resultado.exitoso) {
        setCalificaciones(resultado.datos);

        const idUsuarioLogueado = usuario?.nombreUsuario ?? usuario?.login ?? usuario?.id;
        const propia = idUsuarioLogueado
          ? resultado.datos.find(
              (calificacion) =>
                obtenerIdAutorCalificacion(calificacion) === idUsuarioLogueado,
            )
          : null;

        if (propia) {
          setMiCalificacion(propia);
          dispatchResena({ type: "SET_RATING", payload: propia.estrellas });
          dispatchResena({
            type: "SET_COMENTARIO",
            payload: propia.comentario || "",
          });
        } else {
          setMiCalificacion(null);
          dispatchResena({ type: "RESET_FORM" });
        }
      } else {
        toast.error(resultado.mensaje);
      }

      setCargandoCalificaciones(false);
    },
    [usuario],
  );

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
      cargarCalificaciones(id);
    }
  }, [id, cargarCalificaciones]);

  const handleSubmitCalificacion = async (evento) => {
    evento.preventDefault();

    if (!logueado) {
      toast.error("Debes iniciar sesión para calificar este spot");
      return;
    }

    const estrellas = estadoResena.nuevaResena.rating;
    const comentario = estadoResena.nuevaResena.comentario.trim();

    if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
      toast.error("Seleccioná una calificación entre 1 y 5 estrellas");
      return;
    }

    if (comentario.length > MAX_COMENTARIO) {
      toast.error(
        `El comentario no puede superar los ${MAX_COMENTARIO} caracteres`,
      );
      return;
    }

    setEnviandoCalificacion(true);

    const body = { estrellas, comentario };

    const resultado = miCalificacion
      ? await actualizarCalificacion(id, miCalificacion.id, body)
      : await crearCalificacion(id, body);

    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      await cargarCalificaciones(id);
      setEditandoResena(false);
    } else {
      toast.error(resultado.mensaje);
    }

    setEnviandoCalificacion(false);
  };

  // Descarta cambios sin guardar y vuelve a la vista de solo lectura con
  // los valores que ya estaban guardados.
  const handleCancelarEdicion = () => {
    if (miCalificacion) {
      dispatchResena({ type: "SET_RATING", payload: miCalificacion.estrellas });
      dispatchResena({
        type: "SET_COMENTARIO",
        payload: miCalificacion.comentario || "",
      });
    }
    setEditandoResena(false);
  };

  if (cargandoSpot) {
    return (
      <div className="lugar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (spot) {
    return (
      <div className="lugar-content-wrapper">
        <SpotInfo
          spot={spot}
          esGuardado={isGuardado(spot.id)}
          guardandoSpot={guardandoSpot}
          handleGuardarSpot={handleGuardarSpot}
          abrirReporteSpot={abrirReporteSpot}
        />
        <div className="resenas-container">
          <h3 className="resenas-titulo">
            <FaCommentDots className="section-icon" /> Calificaciones
          </h3>
          <NuevaResenaCard
            logueado={logueado}
            miCalificacion={miCalificacion}
            editandoResena={editandoResena}
            setEditandoResena={setEditandoResena}
            handleSubmitCalificacion={handleSubmitCalificacion}
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
        <ReportarModal
          show={modalReporteAbierto}
          onCerrar={cerrarReporte}
          spotId={spot.id}
          resenaId={contextoReporte?.resenaId ?? null}
          nombreAutorResena={contextoReporte?.nombreAutorResena ?? null}
        />
      </div>
    );
  }

  return (
    <MapaVista
      filtrosVisibles={filtrosVisibles}
      onToggleFiltros={() => setFiltrosVisibles(!filtrosVisibles)}
      onFiltrar={setFiltrosActivos}
      filtros={filtrosActivos}
    />
  );
};

export default MapaContent;
