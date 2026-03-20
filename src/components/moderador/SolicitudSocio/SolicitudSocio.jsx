import { useState, useEffect, useReducer} from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import "./SolicitudSocio.css";
import {
  FiSearch,
  FiCheck,
  FiX,
  FiEye,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiTag,
  FiFileText,
  FiDownload
}
from "react-icons/fi";


// Datos de ejemplo para simular solicitudes
const solicitudesEjemplo = [
  {
    solicitudId: "SOL-0001",
    fechaEnvio: "14/03/2026",
    razonSocial: "Café Arte La Tertulia",
    propietario: "Carlos García",
    email: "carlos@tertulia.com",
    telefono: "3012345678",
    categoria: "Cafetería",
    direccion: "Carrera 7 # 71-21, Bogotá",
    descripcion: "Café de especialidad con exposiciones de arte",
    estado: "pendiente",
    documentos: [
      { nombre: "cedula_demo.pdf", url: "/docs/cedula_demo.pdf" },
      { nombre: "rut_demo.pdf", url: "/docs/rut_demo.pdf" }
    ]
  },
  {
    solicitudId: "SOL-0002",
    fechaEnvio: "13/03/2026",
    razonSocial: "Fotografía Studio Light",
    propietario: "Maria Lopez",
    email: "maria@studiolight.co",
    telefono: "3123456789",
    categoria: "Estudio Fotográfico",
    direccion: "Calle 93 # 15-32, Bogotá",
    descripcion: "Estudio profesional de fotografía y video",
    estado: "pendiente",
  },
  {
    solicitudId: "SOL-0003",
    fechaEnvio: "12/03/2026",
    razonSocial: "El Rincón del Libro",
    propietario: "Pedro Martínez",
    email: "pedro@rinconlibro.com",
    telefono: "3156789012",
    categoria: "Librería",
    direccion: "Carrera 5 # 23-45, Bogotá",
    descripcion: "Librería especializada en literatura colombiana",
    estado: "aprobada",
  },
  {
    solicitudId: "SOL-0004",
    fechaEnvio: "11/03/2026",
    razonSocial: "Sabores Culinarios",
    propietario: "Ana Rodríguez",
    email: "ana@sabores.com",
    telefono: "3201234567",
    categoria: "Restaurante",
    direccion: "Calle 38 # 8-15, Bogotá",
    descripcion: "Restaurante de cocina tradicional colombiana",
    estado: "rechazada",
  },
];

const initialState ={
  solicitudes: [],
  filtroEstado: "todos",
  busqueda: "",
  loading: true,
}

function solicitudReducer(state, action) {
  switch (action.type) {
    case "CARGAR_SOLICITUDES":
      return { ...state, solicitudes: action.payload, loading: false };
    case "ACTUALIZAR_ESTADO":                              // 👈 este falta
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.solicitudId === action.payload.id
            ? { ...s, estado: action.payload.estado }
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
    const coincideEstado =
      filtroEstado === "todos" || solicitud.estado === filtroEstado;
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
    dispatch({ type: "ACTUALIZAR_ESTADO", payload: { id: solicitudId, estado: "rechazada" } });
    alert(`Solicitud ${solicitudId} rechazada`);
  };
  
  const getBadgeVariant = (estado) => {
    switch (estado) {
      case "pendiente":
        return "warning";
      case "aprobada":
        return "success";
      case "rechazada":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case "todos":
        return "Todos";
      case "pendiente":
        return "Pendiente";
      case "aprobada":
        return "Aprobada";
      case "rechazada":
        return "Rechazada";
      default:
        return estado;
    }
  };

  const pendientesCount  = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadasCount   = solicitudes.filter((s) => s.estado === "aprobada").length;
  const rechazadasCount  = solicitudes.filter((s) => s.estado === "rechazada").length;

 const handleTabSelect = (eventKey) => {
    const mapa = {
      Todos: "todos",
      Pendiente: "pendiente",
      Aprobadas: "aprobada",
      Rechazadas: "rechazada",
    };
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
    <div className="solicitud-socio-main-container"> {/* Contenedor principal opcional */}
      <div className="solicitud-socio-header">
        <div className="solicitud-socio-title-group">
          <h1 className="solicitud-socio-title">
            <FiClock className="header-icon" />
            Solicitudes de Socios
          </h1>
          <p className="solicitud-socio-subtitle">
            Gestion de las solicitudes para convertirse en socio
          </p>
        </div>
      </div>

      <Container className="nav-container p-0">
        <Tabs 
          activeKey={filtroEstado === "pendiente" ? "Pendiente" : filtroEstado === "aprobada" ? "Aprobadas" : filtroEstado === "rechazada" ? "Rechazadas" : filtroEstado === "todos" ? "Todos" : ""}
          onSelect={handleTabSelect}
          id="custom-tabs"
          className="mb-4 fondo-tab rounded-pill p-1 shadow"
          variant="pills" 
          fill
        >
          <Tab eventKey="Todos" title={`Todas (${solicitudes.length})`} />
          <Tab eventKey="Pendiente" title={`Pendientes (${pendientesCount})`} />
          <Tab eventKey="Aprobadas" title={`Aprobadas (${aprobadasCount})`} />
          <Tab eventKey="Rechazadas" title={`Rechazadas (${rechazadasCount})`} />
        </Tabs>
      </Container>

      {/* Filtros y búsqueda */}
      <div className="solicitud-socio-filters">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Buscar por ID, razón social o propietario..."
            value={busqueda}
            onChange={(e) => dispatch({ type: "SET_BUSQUEDA", payload: e.target.value })}
            className="search-input"
          />
        </div>
      </div>

      {/* Lista de solicitudes */}
      {solicitudesFiltradas.length === 0 ? (
        <div className="no-solicitudes">
          <FiSearch className="no-solicitudes-icon" />
          <p>No se encontraron solicitudes</p>
        </div>
      ) : (
        <div className="solicitudes-list">
          {solicitudesFiltradas.map((solicitud) => (
            <div key={solicitud.solicitudId} className="solicitud-card">
              <div className="solicitud-card-header">
                <div className="solicitud-id">
                  <span className="id-label">ID:</span>
                  <span className="id-value">{solicitud.solicitudId}</span>
                </div>
                <Badge bg={getBadgeVariant(solicitud.estado)}>
                  {getEstadoLabel(solicitud.estado)}
                </Badge>
              </div>

              <div className="solicitud-card-body">
                <h3 className="razon-social">{solicitud.razonSocial}</h3>
                <p className="categoria">
                  <FiTag className="info-icon" />
                  {solicitud.categoria}
                </p>
                <div className="info-row">
                  <FiUser className="info-icon" />
                  <span>{solicitud.propietario}</span>
                </div>
                <div className="info-row">
                  <FiCalendar className="info-icon" />
                  <span>{solicitud.fechaEnvio}</span>
                </div>
              </div>

              <div className="solicitud-card-actions">
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleVerDetalle(solicitud)}
                  className="btn-view"
                >
                  <FiEye /> Ver Detalle
                </Button>
                {solicitud.estado === "pendiente" && (
                  <Stack direction="horizontal" gap={2}>
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => handleAprobar(solicitud.solicitudId)}
                      className="btn-approve"
                    >
                      <FiCheck /> Aprobar
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleRechazar(solicitud.solicitudId)}
                      className="btn-reject"
                    >
                      <FiX /> Rechazar
                    </Button>
                  </Stack>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="solicitud-modal"
      >
        <Modal.Header closeButton> 
          <Modal.Title className="modal-title-top">
            Detalle de Solicitud - {solicitudSeleccionada?.solicitudId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
      <div className="detalle-section ">
        <h4>Documentación Adjunta</h4>
        <div className="d-flex flex-wrap gap-2 mt-2">
        {solicitudSeleccionada?.documentos?.map((doc, index) => (
        <div 
        key={index}
        className="d-inline-flex align-items-center px-3 py-2"
        style={{
          border: '1px solid #e0e0e0',
          borderRadius: '50px',
          backgroundColor: '#fff',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        >
        <FiFileText className="me-2 text-muted" />
        <span 
          style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}
          onClick={() => window.open(doc.url, '_blank')} // Abre el PDF
        >
          {doc.nombre || 'cedula.pdf'}
        </span>
        <a 
          href={doc.url} 
          download={doc.nombre}
          className="ms-3 text-dark d-flex align-items-center"
          style={{ textDecoration: 'none' }}
        >
          <FiDownload style={{ fontSize: '1.1rem' }} />
        </a>
        </div>
        ))}
          </div>
            </div>
          {solicitudSeleccionada && (
            <div className="solicitud-detalle">
              <div className="detalle-section mt-3">
                <h4>Información del Negocio</h4>
                <div className="detalle-grid">
                  <div className="detalle-item">
                    <label>
                      <FiTag className="label-icon" /> Categoría:
                    </label>
                    <span>{solicitudSeleccionada.categoria}</span>
                  </div>
                  <div className="detalle-item">
                    <label>
                      <FiMapPin className="label-icon" /> Dirección:
                    </label>
                    <span>{solicitudSeleccionada.direccion}</span>
                  </div>
                </div>
                <div className="detalle-item full-width">
                  <label>Descripción:</label>
                  <p>{solicitudSeleccionada.descripcion}</p>
                </div>
              </div>

              <div className="detalle-section ">
                <h4>Información del Propietario</h4>
                <div className="detalle-grid">
                  <div className="detalle-item">
                    <label>
                      <FiUser className="label-icon" /> Nombre:
                    </label>
                    <span>{solicitudSeleccionada.propietario}</span>
                  </div>
                  <div className="detalle-item">
                    <label>
                      <FiMail className="label-icon" /> Correo:
                    </label>
                    <span>{solicitudSeleccionada.email}</span>
                  </div>
                  <div className="detalle-item">
                    <label>
                      <FiPhone className="label-icon" /> Teléfono:
                    </label>
                    <span>{solicitudSeleccionada.telefono}</span>
                  </div>
                  <div className="detalle-item">
                    <label>
                      <FiCalendar className="label-icon" /> Fecha de envío:
                    </label>
                    <span>{solicitudSeleccionada.fechaEnvio}</span>
                  </div>
                </div>
              </div>

              <div className="detalle-section">
                <h4>Estado</h4>
                <Badge bg={getBadgeVariant(solicitudSeleccionada.estado)} className="status">
                  {getEstadoLabel(solicitudSeleccionada.estado)}
                </Badge>
              </div>
            </div>
          )}  
        </Modal.Body>
        <Modal.Footer>
          {solicitudSeleccionada?.estado === "pendiente" && (
            <>
              <Button
                variant="success"
                onClick={() => {
                  handleAprobar(solicitudSeleccionada.solicitudId);
                  setShowModal(false);
                }}
              >
                <FiCheck /> Aprobar Solicitud
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleRechazar(solicitudSeleccionada.solicitudId);
                  setShowModal(false);
                }}
              >
                <FiX /> Rechazar Solicitud
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
