import { useState, useEffect, useCallback, useReducer } from "react";
import {
  obtenerCalificacionesDelSpot,
  crearCalificacion,
  actualizarCalificacion,
} from "@/services/calificacion.service";
import { resenaReducer, initialResenaState } from "../components/spots/SpotContent/ResenaReducer";
import { toast } from "react-hot-toast";

const MAX_COMENTARIO = 500;

const obtenerIdAutorCalificacion = (calificacion) =>
  typeof calificacion?.usuario === "string"
    ? calificacion.usuario
    : (calificacion?.usuario?.login ??
      calificacion?.usuario?.id ??
      calificacion?.usuarioId ??
      calificacion?.idUsuario);

export const useResenas = (spotId, usuario) => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [cargandoCalificaciones, setCargandoCalificaciones] = useState(false);
  const [miCalificacion, setMiCalificacion] = useState(null);
  const [enviandoCalificacion, setEnviandoCalificacion] = useState(false);
  const [editandoResena, setEditandoResena] = useState(false);
  const [sancionRecibida, setSancionRecibida] = useState(null);
  const [estadoResena, dispatchResena] = useReducer(resenaReducer, initialResenaState);

  const cargarCalificaciones = useCallback(
    async (id) => {
      setCargandoCalificaciones(true);
      const resultado = await obtenerCalificacionesDelSpot(id);

      if (resultado.exitoso) {
        setCalificaciones(resultado.datos);

        const idUsuarioLogueado =
          usuario?.nombreUsuario ?? usuario?.login ?? usuario?.id;
        const propia = idUsuarioLogueado
          ? resultado.datos.find(
              (calificacion) =>
                obtenerIdAutorCalificacion(calificacion) === idUsuarioLogueado
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
    [usuario]
  );

  useEffect(() => {
    if (spotId) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
      cargarCalificaciones(spotId);
    }
  }, [spotId, cargarCalificaciones]);

  const handleSubmitCalificacion = async (evento, logueado) => {
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
        `El comentario no puede superar los ${MAX_COMENTARIO} caracteres`
      );
      return;
    }

    setEnviandoCalificacion(true);

    const body = { estrellas, comentario };

    const resultado = miCalificacion
      ? await actualizarCalificacion(spotId, miCalificacion.id, body)
      : await crearCalificacion(spotId, body);

    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      await cargarCalificaciones(spotId);
      setEditandoResena(false);
    } else if (resultado.sancion) {
      setSancionRecibida(resultado.sancion);
    } else {
      toast.error(resultado.mensaje);
    }

    setEnviandoCalificacion(false);
  };

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

  const verEstadoDeSancion = async (recargarUsuario) => {
    setSancionRecibida(null);
    try {
      await recargarUsuario();
    } catch {
      // Si la recarga falla, se mantiene la vista actual sin redirigir.
    }
  };

  return {
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
    cargarCalificaciones,
  };
};