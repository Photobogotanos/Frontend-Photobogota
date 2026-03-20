import { useState, useEffect, useReducer } from "react";
import { FiClock, FiSearch } from "react-icons/fi";
import "./SolicitudSocio.css";
import SolicitudCard from "./SolicitudCard";
import SolicitudFiltros from "./SolicitudFiltros";
import SolicitudModal from "./SolicitudModal";
import ModalRechazo from "./ModalRechazo";

// Estos son datos de prueba mientras conectamos el backend real.
// Cuando haya API, esto se reemplaza por una llamada a fetch o axios.
const solicitudesEjemplo = [
  {
    solicitudId: "SOL-0001", fechaEnvio: "14/03/2026", razonSocial: "Café Arte La Tertulia",
    propietario: "Carlos García", email: "carlos@tertulia.com", telefono: "3012345678",
    categoria: "Cafetería", direccion: "Carrera 7 # 71-21, Bogotá",
    descripcion: "Café de especialidad con exposiciones de arte", estado: "pendiente",
    documentos: [
      { nombre: "cedula_demo.pdf", url: "/docs/cedula_demo.pdf" },
      { nombre: "rut_demo.pdf", url: "/docs/rut_demo.pdf" }
    ]
  },
  {
    solicitudId: "SOL-0002", fechaEnvio: "13/03/2026", razonSocial: "Fotografía Studio Light",
    propietario: "Maria Lopez", email: "maria@studiolight.co", telefono: "3123456789",
    categoria: "Estudio Fotográfico", direccion: "Calle 93 # 15-32, Bogotá",
    descripcion: "Estudio profesional de fotografía y video", estado: "pendiente",
  },
  {
    solicitudId: "SOL-0003", fechaEnvio: "12/03/2026", razonSocial: "El Rincón del Libro",
    propietario: "Pedro Martínez", email: "pedro@rinconlibro.com", telefono: "3156789012",
    categoria: "Librería", direccion: "Carrera 5 # 23-45, Bogotá",
    descripcion: "Librería especializada en literatura colombiana", estado: "aprobada",
  },
  {
    solicitudId: "SOL-0004", fechaEnvio: "11/03/2026", razonSocial: "Sabores Culinarios",
    propietario: "Ana Rodríguez", email: "ana@sabores.com", telefono: "3201234567",
    categoria: "Restaurante", direccion: "Calle 38 # 8-15, Bogotá",
    descripcion: "Restaurante de cocina tradicional colombiana", estado: "rechazada",
  },
];

// El estado inicial del componente. Arranca con loading en true
// para mostrar el spinner mientras se cargan las solicitudes.
const initialState = {
  solicitudes: [],
  filtroEstado: "todos",
  busqueda: "",
  loading: true,
};

// El reducer es como un centro de control — recibe una acción
// y decide cómo cambia el estado. Cada case es un tipo de acción diferente.
function solicitudReducer(state, action) {
  switch (action.type) {

    // Cuando llegan las solicitudes del backend (o los datos de ejemplo),
    // las guardamos y apagamos el loading.
    case "CARGAR_SOLICITUDES":
      return { ...state, solicitudes: action.payload, loading: false };

    // Cuando el moderador aprueba o rechaza una solicitud,
    // actualizamos su estado y guardamos quién decidió y cuándo.
    case "ACTUALIZAR_ESTADO":
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.solicitudId === action.payload.id
            ? {
                ...s,
                estado: action.payload.estado,
                motivoRechazo: action.payload.motivoRechazo || null,
                decisionPor: "Moderador",
                decisionFecha: new Date().toLocaleString("es-ES"),
              }
            : s
        ),
      };

    // Cuando un moderador escribe un comentario interno,
    // lo agregamos a la lista de comentarios de esa solicitud.
    case "AGREGAR_COMENTARIO":
    return {
      ...state,
      solicitudes: state.solicitudes.map((s) =>
        s.solicitudId === action.payload.id
          ? {
              ...s,
              comentarios: [
                ...(s.comentarios || []),
                {
                  id: Date.now(),
                  texto: action.payload.texto,
                  autor: action.payload.autor,
                  fecha: new Date().toLocaleString("es-ES"),
                },
              ],
            }
          : s
      ),
    };

    // Cambia el filtro de la tab activa (todos, pendiente, aprobada, rechazada).
    case "SET_FILTRO":
      return { ...state, filtroEstado: action.payload };

    // Actualiza el texto del buscador en tiempo real.
    case "SET_BUSQUEDA":
      return { ...state, busqueda: action.payload };

    default:
      return state;
  }
}

export default function SolicitudSocio() {
  // solicitudSeleccionada guarda la solicitud que el moderador abrió en el modal.
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // useReducer reemplaza varios useState — todos los datos relacionados
  // viven en un solo objeto (state) y se actualizan con dispatch.
  const [state, dispatch] = useReducer(solicitudReducer, initialState);
  const { solicitudes, filtroEstado, busqueda, loading } = state;

  // solicitudArechazar guarda el ID de la solicitud que se está por rechazar,
  // mientras el moderador escribe el motivo en el modal de rechazo.
  const [showModalRechazo, setShowModalRechazo] = useState(false);
  const [solicitudArechazar, setSolicitudArechazar] = useState(null);

  // solicitudActualizada asegura que el modal siempre muestre
  // la versión más reciente de la solicitud, incluyendo comentarios nuevos.
  const solicitudActualizada = solicitudes.find(
    (s) => s.solicitudId === solicitudSeleccionada?.solicitudId
  ) || solicitudSeleccionada;

  // Al montar el componente, intentamos cargar datos del localStorage.
  // Si hay una solicitud guardada (enviada desde el formulario público),
  // la mezclamos con los datos de ejemplo.
  useEffect(() => {
    const dataLocalStorage = localStorage.getItem("solicitudSocio");
    if (dataLocalStorage) {
      const parsed = JSON.parse(dataLocalStorage);
      const solicitudStorage = {
        ...parsed,
        solicitudId: parsed.solicitudId || `SOL-${Date.now().toString().slice(-8)}`,
        fechaEnvio: parsed.fechaEnvio || new Date().toLocaleDateString("es-ES"),
        estado: "pendiente",
      };
      dispatch({ type: "CARGAR_SOLICITUDES", payload: [solicitudStorage, ...solicitudesEjemplo] });
    } else {
      dispatch({ type: "CARGAR_SOLICITUDES", payload: solicitudesEjemplo });
    }
  }, []);

  // Filtramos las solicitudes según la tab activa y el texto del buscador.
  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincideEstado = filtroEstado === "todos" || solicitud.estado === filtroEstado;
    const coincideBusqueda =
      busqueda === "" ||
      solicitud.solicitudId.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.propietario.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  // Abre el modal de detalle con la solicitud que el moderador seleccionó.
  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

  // Aprueba la solicitud y registra la decisión en el estado.
  const handleAprobar = (solicitudId) => {
    dispatch({ type: "ACTUALIZAR_ESTADO", payload: { id: solicitudId, estado: "aprobada" } });
    alert(`Solicitud ${solicitudId} aprobada`);
  };

  // En vez de rechazar directo, abre el modal para pedir el motivo primero.
  const handleRechazar = (solicitudId) => {
    setSolicitudArechazar(solicitudId);
    setShowModalRechazo(true);
  };

  // Una vez que el moderador escribe el motivo y confirma,
  // rechazamos la solicitud y guardamos el motivo.
  const handleConfirmarRechazo = (motivo) => {
    dispatch({
      type: "ACTUALIZAR_ESTADO",
      payload: { id: solicitudArechazar, estado: "rechazada", motivoRechazo: motivo },
    });
    setSolicitudArechazar(null);
    setShowModalRechazo(false);
    alert(`Solicitud ${solicitudArechazar} rechazada`);
  };

  // Agrega un comentario interno a la solicitud con autor y fecha automáticos.
  const handleAgregarComentario = (solicitudId, texto) => {
    dispatch({
      type: "AGREGAR_COMENTARIO",
      payload: { id: solicitudId, texto, autor: "Moderador" },
    });
  };

  // Mapea el eventKey de las tabs al valor real del filtro.
  const handleTabSelect = (eventKey) => {
    const mapa = { Todos: "todos", Pendiente: "pendiente", Aprobadas: "aprobada", Rechazadas: "rechazada" };
    dispatch({ type: "SET_FILTRO", payload: mapa[eventKey] ?? "todos" });
  };

  // Mientras cargan las solicitudes mostramos un spinner.
  if (loading) {
    return (
      <div className="solicitud-socio-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="solicitud-socio-main-container">
      <div className="solicitud-socio-header">
        <div className="solicitud-socio-title-group">
          <h1 className="solicitud-socio-title">
            <FiClock className="header-icon" />
            Solicitudes de Socios
          </h1>
          <p className="solicitud-socio-subtitle">
            Gestión de las solicitudes para convertirse en socio
          </p>
        </div>
      </div>

      {/* Tabs de filtro y buscador */}
      <SolicitudFiltros
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        solicitudes={solicitudes}
        onTabSelect={handleTabSelect}
        onBusqueda={(valor) => dispatch({ type: "SET_BUSQUEDA", payload: valor })}
      />

      {/* Si no hay resultados mostramos un mensaje, si hay los listamos */}
      {solicitudesFiltradas.length === 0 ? (
        <div className="no-solicitudes">
          <FiSearch className="no-solicitudes-icon" />
          <p>No se encontraron solicitudes</p>
        </div>
      ) : (
        <div className="solicitudes-list">
          {solicitudesFiltradas.map((solicitud) => (
            <SolicitudCard
              key={solicitud.solicitudId}
              solicitud={solicitud}
              onVerDetalle={handleVerDetalle}
              onAprobar={handleAprobar}
              onRechazar={handleRechazar}
            />
          ))}
        </div>
      )}

      {/* Modal de detalle — usa solicitudActualizada para mostrar
          siempre los comentarios y cambios más recientes */}
      <SolicitudModal
        show={showModal}
        solicitud={solicitudActualizada}
        onCerrar={() => setShowModal(false)}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
        onAgregarComentario={handleAgregarComentario}
      />

      {/* Modal que aparece cuando el moderador quiere rechazar —
          pide el motivo antes de confirmar */}
      <ModalRechazo
        show={showModalRechazo}
        onCerrar={() => setShowModalRechazo(false)}
        onConfirmar={handleConfirmarRechazo}
      />
    </div>
  );
}