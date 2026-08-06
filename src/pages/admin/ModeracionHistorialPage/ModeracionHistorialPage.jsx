import { useCallback, useEffect, useState } from "react";
import PageContainer from "@/components/common/PageContainer/PageContainer";
import PageHeader from "@/components/common/PageHeader/PageHeader";
import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Spinner from "react-bootstrap/Spinner";
import Pagination from "react-bootstrap/Pagination";
import Select from "react-select";
import { FaSearch, FaTimes, FaCalendarAlt, FaHistory, FaInbox } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  listarHistorialModeracion,
  ACCIONES_MODERACION,
  TIPOS_CONTENIDO_MODERADO,
  obtenerAccionModeracionInfo,
  obtenerTipoContenidoInfo,
} from "@/services/moderacion.service";
import "../moderacion-admin.css";
import "./ModeracionHistorialPage.css";

const OPCIONES_ACCION = [
  { value: "", label: "Todas las acciones" },
  ...ACCIONES_MODERACION.map((a) => ({ value: a.valor, label: a.etiqueta })),
];

const OPCIONES_TIPO = [
  { value: "", label: "Todos los tipos" },
  ...TIPOS_CONTENIDO_MODERADO.map((t) => ({ value: t.valor, label: t.etiqueta })),
];

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
    <PageContainer className="moderacion-historial-page">
      <div className="moderacion-page">
        <PageHeader
          subtitle="Administración"
          icon={<FaHistory />}
          title="Historial de moderación"
          description="Consulta el registro de acciones de moderación: detecciones, notificaciones, sanciones y baneos aplicados en la plataforma."
        />

        <div className="moderacion-card">
          <form onSubmit={aplicarFiltros} className="moderacion-filtros">
            <div>
              <label className="moderacion-label" htmlFor="filtro-accion">
                Acción
              </label>
              <Select
                inputId="filtro-accion"
                classNamePrefix="spot-select"
                options={OPCIONES_ACCION}
                value={OPCIONES_ACCION.find((o) => o.value === filtros.accion)}
                onChange={(opcion) => cambiarFiltro("accion", opcion ? opcion.value : "")}
                placeholder="Todas las acciones"
                isClearable
              />
            </div>

            <div>
              <label className="moderacion-label" htmlFor="filtro-tipo">
                Tipo de contenido
              </label>
              <Select
                inputId="filtro-tipo"
                classNamePrefix="spot-select"
                options={OPCIONES_TIPO}
                value={OPCIONES_TIPO.find((o) => o.value === filtros.tipoContenido)}
                onChange={(opcion) =>
                  cambiarFiltro("tipoContenido", opcion ? opcion.value : "")
                }
                placeholder="Todos los tipos"
                isClearable
              />
            </div>

            <div>
              <label className="moderacion-label" htmlFor="filtro-usuario">
                Usuario
              </label>
              <input
                type="text"
                id="filtro-usuario"
                className="form-control moderacion-input"
                placeholder="@usuario"
                value={filtros.usuario}
                onChange={(e) => cambiarFiltro("usuario", e.target.value)}
              />
            </div>

            <div>
              <label className="moderacion-label" htmlFor="filtro-desde">
                <FaCalendarAlt className="me-1" />
                Desde
              </label>
              <input
                type="date"
                id="filtro-desde"
                className="form-control moderacion-input"
                value={filtros.desde}
                onChange={(e) => cambiarFiltro("desde", e.target.value)}
              />
            </div>

            <div>
              <label className="moderacion-label" htmlFor="filtro-hasta">
                <FaCalendarAlt className="me-1" />
                Hasta
              </label>
              <input
                type="date"
                id="filtro-hasta"
                className="form-control moderacion-input"
                value={filtros.hasta}
                onChange={(e) => cambiarFiltro("hasta", e.target.value)}
              />
            </div>

            <div className="moderacion-filtro-botones">
              <button type="submit" className="btn-mod">
                <FaSearch /> Filtrar
              </button>
              <button
                type="button"
                className="btn-mod-outline"
                onClick={limpiarFiltros}
                aria-label="Limpiar filtros"
              >
                <FaTimes />
              </button>
            </div>
          </form>

          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : registros.length === 0 ? (
            <div className="moderacion-vacio">
              <FaInbox />
              <p className="mb-0">No hay registros para los filtros seleccionados.</p>
            </div>
          ) : (
            <>
              <Table hover responsive className="moderacion-table">
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

              <div className="moderacion-footer">
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
        </div>
      </div>
    </PageContainer>
  );
};

export default ModeracionHistorialPage;
