import { useState, useEffect, useReducer } from "react";
import { FiClock, FiSearch } from "react-icons/fi";
import "./SolicitudSocio.css";
import SolicitudCard from "./SolicitudCard";
import SolicitudFiltros from "./SolicitudFiltros";
import SolicitudModal from "./SolicitudModal";
import ModalRechazo from "./ModalRechazo";

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

const initialState = {
  solicitudes: [],
  filtroEstado: "todos",
  busqueda: "",
  loading: true,
};

function solicitudReducer(state, action) {
  switch (action.type) {
    case "CARGAR_SOLICITUDES":
      return { ...state, solicitudes: action.payload, loading: false };
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
                    texto: action.payload.texto,
                    autor: action.payload.autor,
                    fecha: new Date().toLocaleString("es-ES"),
                  },
                ],
              }
            : s
        ),
      };
    case "SET_FILTRO":
      return { ...state, filtroEstado: action.payload };
    case "SET_BUSQUEDA":
      return { ...state, busqueda: action.payload };
    default:
      return state;
  }
}

export default function SolicitudSocio() {
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [state, dispatch] = useReducer(solicitudReducer, initialState);
  const { solicitudes, filtroEstado, busqueda, loading } = state;
  const solicitudActualizada = solicitudes.find(
  (s) => s.solicitudId === solicitudSeleccionada?.solicitudId
) || solicitudSeleccionada;
  const [showModalRechazo, setShowModalRechazo] = useState(false);
const [solicitudArechazar, setSolicitudArechazar] = useState(null);

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

  const solicitudesFiltradas = solicitudes.filter((solicitud) => {
    const coincideEstado = filtroEstado === "todos" || solicitud.estado === filtroEstado;
    const coincideBusqueda =
      busqueda === "" ||
      solicitud.solicitudId.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.razonSocial.toLowerCase().includes(busqueda.toLowerCase()) ||
      solicitud.propietario.toLowerCase().includes(busqueda.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

  const handleAprobar = (solicitudId) => {
    dispatch({ type: "ACTUALIZAR_ESTADO", payload: { id: solicitudId, estado: "aprobada" } });
    alert(`Solicitud ${solicitudId} aprobada`);
  };

  const handleRechazar = (solicitudId) => {
    setSolicitudArechazar(solicitudId);
    setShowModalRechazo(true);
  };

  const handleAgregarComentario = (solicitudId, texto) => {
  dispatch({
    type: "AGREGAR_COMENTARIO",
    payload: {
      id: solicitudId,
      texto,
      autor: "Moderador",
    },
    });
  };

  const handleConfirmarRechazo = (motivo) => {
  dispatch({
    type: "ACTUALIZAR_ESTADO",
    payload: { id: solicitudArechazar, estado: "rechazada", motivoRechazo: motivo },
  });
  setSolicitudArechazar(null);
  setShowModalRechazo(false);
  alert(`Solicitud ${solicitudArechazar} rechazada`);
};

  const handleTabSelect = (eventKey) => {
    const mapa = { Todos: "todos", Pendiente: "pendiente", Aprobadas: "aprobada", Rechazadas: "rechazada" };
    dispatch({ type: "SET_FILTRO", payload: mapa[eventKey] ?? "todos" });
  };

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

      <SolicitudFiltros
        filtroEstado={filtroEstado}
        busqueda={busqueda}
        solicitudes={solicitudes}
        onTabSelect={handleTabSelect}
        onBusqueda={(valor) => dispatch({ type: "SET_BUSQUEDA", payload: valor })}
      />

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

      <SolicitudModal
        show={showModal}
        solicitud={solicitudActualizada}
        onCerrar={() => setShowModal(false)}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
        onAgregarComentario={handleAgregarComentario}
      />
      <ModalRechazo
        show={showModalRechazo}
        onCerrar={() => setShowModalRechazo(false)}
        onConfirmar={handleConfirmarRechazo}
      />
    </div>
  );
}