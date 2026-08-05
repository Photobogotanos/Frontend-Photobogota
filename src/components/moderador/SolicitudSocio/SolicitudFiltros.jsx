import { Container, Tab, Tabs } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FiSearch } from "react-icons/fi";

// Este componente maneja las tabs de filtro y el buscador.
// No tiene estado propio — todo se lo pasa el padre via props.
export default function SolicitudFiltros({ filtroEstado, busqueda, solicitudes, onTabSelect, onBusqueda }) {

  // Calculamos los contadores aquí para mostrarlos en cada tab.
  // "Aprobadas" agrupa ENVIO_CREDENCIALES + APROBADO: para el moderador
  // ambas significan que la solicitud ya fue aprobada, solo cambia si el
  // módulo de credenciales ya terminó de procesarla.
  const pendientesCount = solicitudes.filter((s) => s.estado === "PENDIENTE").length;
  const correccionCount = solicitudes.filter((s) => s.estado === "EN_CORRECCION").length;
  const aprobadasCount = solicitudes.filter((s) => s.estado === "ENVIO_CREDENCIALES" || s.estado === "APROBADO").length;
  const rechazadasCount = solicitudes.filter((s) => s.estado === "RECHAZADO").length;

  return (
    <>
      <Container className="nav-container mt-4">
        <Tabs
          activeKey={
            filtroEstado === "PENDIENTE" ? "Pendiente" :
            filtroEstado === "EN_CORRECCION" ? "Correccion" :
            filtroEstado === "APROBADO" ? "Aprobadas" :
            filtroEstado === "RECHAZADO" ? "Rechazadas" : "Todos"
          }
          onSelect={onTabSelect}
          id="custom-tabs"
          className="mb-4 fondo-tab rounded-pill p-1 shadow"
          variant="pills"
          fill
        >
          <Tab eventKey="Todos"      title={`Todas (${solicitudes.length})`} />
          <Tab eventKey="Pendiente"  title={`Pendientes (${pendientesCount})`} />
          <Tab eventKey="Correccion" title={`En corrección (${correccionCount})`} />
          <Tab eventKey="Aprobadas"  title={`Aprobadas (${aprobadasCount})`} />
          <Tab eventKey="Rechazadas" title={`Rechazadas (${rechazadasCount})`} />
        </Tabs>
      </Container>

      {/* El buscador filtra por código, razón social o propietario en tiempo real */}
      <div className="solicitud-socio-filters">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <Form.Control
            className="search-input"
            type="text"
            placeholder="Buscar por código, razón social o propietario"
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
