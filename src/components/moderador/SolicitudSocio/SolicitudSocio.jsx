import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { FiUsers } from "react-icons/fi";
import SolicitudFiltros from "./SolicitudFiltros";
import SolicitudCard from "./SolicitudCard";
import SolicitudModal from "./SolicitudModal";
import ModalRechazo from "./ModalRechazo";
import EstadisticasSolicitudes from "./EstadisticasSolicitudes";
import {
  obtenerAspirantes,
  obtenerEstadisticasAspirantes,
  aprobarAspirante,
  rechazarAspirante,
  solicitarCorreccionAspirante,
  agregarComentarioAspirante,
  enviarCredencialesAspirante,
} from "@/services/aspirante.service";
import "./SolicitudSocio.css";

// Dashboard del moderador para revisar y procesar solicitudes de membresía
// (HU: "Como moderador quiero revisar y procesar solicitudes de membresía").
// Todo el estado viene del backend real — nada de datos de ejemplo.
export default function SolicitudSocio() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoStats, setCargandoStats] = useState(true);

  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  // El modal de motivo se reutiliza para "rechazar" y "solicitar corrección".
  // accionPendiente guarda cuál de las dos acciones se está por confirmar
  // y sobre qué solicitud, para saber qué endpoint llamar al confirmar.
  const [accionPendiente, setAccionPendiente] = useState(null); // { id, tipo: 'rechazar' | 'correccion' }

  const cargarSolicitudes = useCallback(async () => {
    setCargando(true);
    try {
      const datos = await obtenerAspirantes();
      setSolicitudes(datos);
    } catch (error) {
      console.error("Error al cargar solicitudes:", error);
      toast.error("No se pudieron cargar las solicitudes");
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarEstadisticas = useCallback(async () => {
    setCargandoStats(true);
    try {
      const datos = await obtenerEstadisticasAspirantes();
      setEstadisticas(datos);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    } finally {
      setCargandoStats(false);
    }
  }, []);

  useEffect(() => {
    cargarSolicitudes();
    cargarEstadisticas();
  }, [cargarSolicitudes, cargarEstadisticas]);

  // Reemplaza en la lista local la solicitud actualizada que devuelve el
  // backend, así no hace falta recargar todo el listado tras cada acción.
  const actualizarSolicitudLocal = (actualizada) => {
    setSolicitudes((prev) => prev.map((s) => (s.id === actualizada.id ? actualizada : s)));
    if (solicitudSeleccionada?.id === actualizada.id) {
      setSolicitudSeleccionada(actualizada);
    }
  };

  const handleTabSelect = (key) => {
    const mapa = {
      Todos: "todos",
      Pendiente: "PENDIENTE",
      Correccion: "EN_CORRECCION",
      Aprobadas: "APROBADAS", // agrupa ENVIO_CREDENCIALES + APROBADO
      Rechazadas: "RECHAZADO",
    };
    setFiltroEstado(mapa[key] ?? "todos");
  };

  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    setMostrarModal(false);
    setSolicitudSeleccionada(null);
  };

  const handleAprobar = async (id) => {
    try {
      const actualizada = await aprobarAspirante(id);
      actualizarSolicitudLocal(actualizada);
      toast.success("Solicitud aprobada. Queda en espera de envío de credenciales.");
      cargarEstadisticas();
      handleCerrarModal();
    } catch (error) {
      console.error("Error al aprobar:", error);
      toast.error(error.response?.data?.message || error.response?.data?.mensaje || "No se pudo aprobar la solicitud");
    }
  };

  // Abre el modal de motivo, ya sea para rechazar o para solicitar corrección.
  const handleAbrirRechazar = (id) => setAccionPendiente({ id, tipo: "rechazar" });
  const handleAbrirCorreccion = (id) => setAccionPendiente({ id, tipo: "correccion" });

  const handleConfirmarAccionPendiente = async (motivo) => {
    if (!accionPendiente) return;
    const { id, tipo } = accionPendiente;
    try {
      const actualizada = tipo === "rechazar"
        ? await rechazarAspirante(id, motivo)
        : await solicitarCorreccionAspirante(id, motivo);

      actualizarSolicitudLocal(actualizada);
      toast.success(tipo === "rechazar"
        ? "Solicitud rechazada."
        : "Se solicitaron correcciones. El aspirante podrá reenviar sus documentos.");
      cargarEstadisticas();
      setAccionPendiente(null);
      handleCerrarModal();
    } catch (error) {
      console.error(`Error al ${tipo}:`, error);
      toast.error(error.response?.data?.message || error.response?.data?.mensaje || "No se pudo completar la acción");
    }
  };

  const handleAgregarComentario = async (id, texto) => {
    try {
      const actualizada = await agregarComentarioAspirante(id, texto);
      actualizarSolicitudLocal(actualizada);
      toast.success("Comentario agregado");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      toast.error("No se pudo agregar el comentario");
    }
  };

  const handleEnviarCredenciales = async (id) => {
    try {
      const actualizada = await enviarCredencialesAspirante(id);
      actualizarSolicitudLocal(actualizada);
      toast.success(`Cuenta de socio creada (usuario: ${actualizada.nombreUsuarioGenerado}). Se enviaron las credenciales por correo.`);
      cargarEstadisticas();
      handleCerrarModal();
    } catch (error) {
      console.error("Error al enviar credenciales:", error);
      toast.error(error.response?.data?.message || error.response?.data?.mensaje || "No se pudieron enviar las credenciales");
    }
  };

  // Filtro combinado: estado (tab activo) + búsqueda por texto libre
  const solicitudesFiltradas = solicitudes.filter((s) => {
    const coincideEstado =
      filtroEstado === "todos" ||
      (filtroEstado === "APROBADAS"
        ? (s.estado === "ENVIO_CREDENCIALES" || s.estado === "APROBADO")
        : s.estado === filtroEstado);

    const texto = busqueda.trim().toLowerCase();
    const coincideBusqueda =
      !texto ||
      s.codigo?.toLowerCase().includes(texto) ||
      s.razonSocial?.toLowerCase().includes(texto) ||
      `${s.nombres} ${s.apellidos}`.toLowerCase().includes(texto);

    return coincideEstado && coincideBusqueda;
  });

  const pendientesCount = solicitudes.filter((s) => s.estado === "PENDIENTE").length;

  return (
    <div className="solicitud-socio-container">
      <div className="solicitud-socio-header">
        <div className="solicitud-socio-title-group">
          <span className="solicitud-socio-top-text">Moderación</span>
          <h1 className="solicitud-socio-title">
            <FiUsers className="header-icon" /> Solicitudes de Membresía
          </h1>
          <p className="solicitud-socio-subtitle">Revisa, aprueba, rechaza o solicita correcciones a los aspirantes a socio</p>
        </div>
        {pendientesCount > 0 && (
          <span className="badge bg-warning pending-count">{pendientesCount} pendiente(s) por revisar</span>
        )}
      </div>
      <div className="spot-header-line" />

      <EstadisticasSolicitudes estadisticas={estadisticas} loading={cargandoStats} />

      <SolicitudFiltros
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        solicitudes={solicitudes}
        onTabSelect={handleTabSelect}
        onBusqueda={setBusqueda}
      />

      {cargando ? (
        <p className="text-center text-muted mt-4">Cargando solicitudes...</p>
      ) : solicitudesFiltradas.length === 0 ? (
        <p className="text-center text-muted mt-4">No hay solicitudes que coincidan con este filtro</p>
      ) : (
        <div className="solicitudes-list">
          {solicitudesFiltradas.map((solicitud) => (
            <SolicitudCard
              key={solicitud.id}
              solicitud={solicitud}
              onVerDetalle={handleVerDetalle}
              onAprobar={handleAprobar}
              onRechazar={handleAbrirRechazar}
              onSolicitarCorreccion={handleAbrirCorreccion}
              onEnviarCredenciales={handleEnviarCredenciales}
            />
          ))}
        </div>
      )}

      <SolicitudModal
        show={mostrarModal}
        solicitud={solicitudSeleccionada}
        onCerrar={handleCerrarModal}
        onAprobar={handleAprobar}
        onRechazar={handleAbrirRechazar}
        onSolicitarCorreccion={handleAbrirCorreccion}
        onEnviarCredenciales={handleEnviarCredenciales}
        onAgregarComentario={handleAgregarComentario}
      />

      <ModalRechazo
        show={!!accionPendiente}
        onCerrar={() => setAccionPendiente(null)}
        onConfirmar={handleConfirmarAccionPendiente}
        titulo={accionPendiente?.tipo === "rechazar" ? "Motivo de rechazo" : "Correcciones a solicitar"}
        etiqueta={
          accionPendiente?.tipo === "rechazar"
            ? "Explica por qué se rechaza esta solicitud:"
            : "Explica qué debe corregir o volver a enviar el aspirante:"
        }
        textoConfirmar={accionPendiente?.tipo === "rechazar" ? "Confirmar rechazo" : "Solicitar corrección"}
        varianteConfirmar={accionPendiente?.tipo === "rechazar" ? "danger" : "warning"}
        mensajeValidacion={
          accionPendiente?.tipo === "rechazar"
            ? "Para poder confirmar un rechazo de solicitud, es necesario que des una razón válida"
            : "Para solicitar una corrección, es necesario que expliques qué debe corregir el aspirante"
        }
      />
    </div>
  );
}
