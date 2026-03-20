import { Container, Tab, Tabs } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { FiSearch } from "react-icons/fi";

export default function SolicitudFiltros({ filtroEstado, busqueda, solicitudes, onTabSelect, onBusqueda }) {
  const pendientesCount = solicitudes.filter((s) => s.estado === "pendiente").length;
  const aprobadasCount  = solicitudes.filter((s) => s.estado === "aprobada").length;
  const rechazadasCount = solicitudes.filter((s) => s.estado === "rechazada").length;

  return (
    <>
      <Container className="nav-container p-0">
        <Tabs
          activeKey={
            filtroEstado === "pendiente" ? "Pendiente" :
            filtroEstado === "aprobada"  ? "Aprobadas" :
            filtroEstado === "rechazada" ? "Rechazadas" : "Todos"
          }
          onSelect={onTabSelect}
          id="custom-tabs"
          className="mb-4 fondo-tab rounded-pill p-1 shadow"
          variant="pills"
          fill
        >
          <Tab eventKey="Todos"      title={`Todas (${solicitudes.length})`} />
          <Tab eventKey="Pendiente"  title={`Pendientes (${pendientesCount})`} />
          <Tab eventKey="Aprobadas"  title={`Aprobadas (${aprobadasCount})`} />
          <Tab eventKey="Rechazadas" title={`Rechazadas (${rechazadasCount})`} />
        </Tabs>
      </Container>

      <div className="solicitud-socio-filters">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <Form.Control
            type="text"
            placeholder="Buscar por ID, razón social o propietario..."
            value={busqueda}
            onChange={(e) => onBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
    </>
  );
}