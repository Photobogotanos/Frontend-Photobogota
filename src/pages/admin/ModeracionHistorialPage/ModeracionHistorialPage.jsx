import { useCallback, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import { FaSearch, FaTimes, FaCalendarAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarHistorialModeracion,
  ACCIONES_MODERACION,
  TIPOS_CONTENIDO_MODERADO,
  obtenerAccionModeracionInfo,
  obtenerTipoContenidoInfo,
} from "@/services/moderacion.service";
import "./ModeracionHistorialPage.css";

const formatearFecha = (fecha) => {
  if (!fecha) return "—";
  const d = new Date(fecha);
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ModeracionHistorialPage = () => {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalElementos, setTotalElementos] = useState(0);
  const [filtros, setFiltros] = useState({
    accion: "",
    usuario: "",
    tipoContenido: "",
    desde: "",
    hasta: "",
  });

  const cargar = useCallback(async (paginaActual = 0, filtrosActuales = filtros) => {
    setCargando(true);
    const params = {
      accion: filtrosActuales.accion || undefined,
      usuario: filtrosActuales.usuario || undefined,
      tipoContenido: filtrosActuales.tipoContenido || undefined,
      desde: filtrosActuales.desde ? `${filtrosActuales.desde}T00:00:00` : undefined,
      hasta: filtrosActuales.hasta ? `${filtrosActuales.hasta}T23:59:59` : undefined,
      page: paginaActual,
      size: 10,
    };
    const resultado = await listarHistorialModeracion(params);
    setCargando(false);
    if (resultado.exitoso) {
      setRegistros(resultado.datos?.content || []);
      setTotalPaginas(resultado.datos?.totalPages || 0);
      setTotalElementos(resultado.datos?.totalElements || 0);
      setPagina(resultado.datos?.number || 0);
    } else {
      toast.error(resultado.mensaje);
    }
  }, [filtros]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargar(0, filtros);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const aplicarFiltros = (e) => {
    e.preventDefault();
    cargar(0, filtros);
  };

  const limpiarFiltros = () => {
    const vacios = { accion: "", usuario: "", tipoContenido: "", desde: "", hasta: "" };
    setFiltros(vacios);
    cargar(0, vacios);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 0 || nuevaPagina >= totalPaginas) return;
    cargar(nuevaPagina, filtros);
  };

  const cambiarFiltro = (campo, valor) =>
    setFiltros((prev) => ({ ...prev, [campo]: valor }));

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i);

  return (
    <div className="moderacion-historial-page">
      <Container fluid>
        <Card className="shadow-sm">
          <Card.Header>
            <h4 className="mb-0">Historial de moderación</h4>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={aplicarFiltros} className="mb-3">
              <Row className="g-2 align-items-end">
                <Col md={3} lg={2}>
                  <Form.Label className="small text-muted mb-1">Acción</Form.Label>
                  <Form.Select
                    value={filtros.accion}
                    onChange={(e) => cambiarFiltro("accion", e.target.value)}
                  >
                    <option value="">Todas</option>
                    {ACCIONES_MODERACION.map((a) => (
                      <option key={a.valor} value={a.valor}>
                        {a.etiqueta}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3} lg={2}>
                  <Form.Label className="small text-muted mb-1">Tipo de contenido</Form.Label>
                  <Form.Select
                    value={filtros.tipoContenido}
                    onChange={(e) => cambiarFiltro("tipoContenido", e.target.value)}
                  >
                    <option value="">Todos</option>
                    {TIPOS_CONTENIDO_MODERADO.map((t) => (
                      <option key={t.valor} value={t.valor}>
                        {t.etiqueta}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3} lg={2}>
                  <Form.Label className="small text-muted mb-1">Usuario</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="@usuario"
                    value={filtros.usuario}
                    onChange={(e) => cambiarFiltro("usuario", e.target.value)}
                  />
                </Col>
                <Col md={3} lg={2}>
                  <Form.Label className="small text-muted mb-1">
                    <FaCalendarAlt className="me-1" />
                    Desde
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.desde}
                    onChange={(e) => cambiarFiltro("desde", e.target.value)}
                  />
                </Col>
                <Col md={3} lg={2}>
                  <Form.Label className="small text-muted mb-1">
                    <FaCalendarAlt className="me-1" />
                    Hasta
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={filtros.hasta}
                    onChange={(e) => cambiarFiltro("hasta", e.target.value)}
                  />
                </Col>
                <Col md={3} lg={2}>
                  <div className="d-flex gap-1">
                    <Button type="submit" variant="primary" className="flex-fill">
                      <FaSearch className="me-1" /> Filtrar
                    </Button>
                    <Button variant="outline-secondary" onClick={limpiarFiltros}>
                      <FaTimes />
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>

            {cargando ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                <Table hover responsive className="moderacion-historial-tabla">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Usuario</th>
                      <th>Acción</th>
                      <th>Tipo</th>
                      <th>Contenido</th>
                      <th>Palabras detectadas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registros.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-muted py-4">
                          No hay registros para los filtros seleccionados.
                        </td>
                      </tr>
                    )}
                    {registros.map((r) => {
                      const accion = obtenerAccionModeracionInfo(r.accion);
                      const tipo = obtenerTipoContenidoInfo(r.tipoContenido);
                      return (
                        <tr key={r.id}>
                          <td className="text-nowrap">{formatearFecha(r.fecha)}</td>
                          <td className="fw-semibold">@{r.nombreUsuario}</td>
                          <td>
                            <Badge bg={accion.variant}>{accion.etiqueta}</Badge>
                            {r.estadoApelacion && (
                              <div className="small text-muted mt-1">
                                Apelación: {r.estadoApelacion}
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg={tipo.variant}>{tipo.etiqueta}</Badge>
                          </td>
                          <td className="contenido-original" title={r.contenidoOriginal}>
                            {r.contenidoOriginal || <span className="text-muted">—</span>}
                          </td>
                          <td>
                            <div className="palabras-detectadas">
                              {(r.palabrasDetectadas || []).map((p, i) => (
                                <Badge key={i} pill bg="danger" className="me-1 mb-1">
                                  {p}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>

                <div className="d-flex flex-wrap justify-content-between align-items-center">
                  <span className="text-muted small">
                    {totalElementos} registro{totalElementos !== 1 ? "s" : ""}
                  </span>
                  {totalPaginas > 1 && (
                    <Pagination size="sm">
                      <Pagination.Prev
                        disabled={pagina === 0}
                        onClick={() => cambiarPagina(pagina - 1)}
                      />
                      {paginas.map((p) => (
                        <Pagination.Item
                          key={p}
                          active={p === pagina}
                          onClick={() => cambiarPagina(p)}
                        >
                          {p + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={pagina >= totalPaginas - 1}
                        onClick={() => cambiarPagina(pagina + 1)}
                      />
                    </Pagination>
                  )}
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default ModeracionHistorialPage;
