import { useState, useEffect, useCallback } from "react";
import Form from "react-bootstrap/Form";
import {
  FiUserX,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import {
  listarSolicitudesEliminacionAdmin,
  obtenerMetricasEliminacionAdmin,
  procesarEliminacionAdmin,
  rechazarEliminacionAdmin,
  ESTADOS_ELIMINACION,
} from "@/services/admin.service";
import SolicitudEliminacionCard from "./SolicitudEliminacionCard";
import ModalGestionEliminacion from "./ModalGestionEliminacion";
import MetricasEliminacion from "./MetricasEliminacion";
import "./DashboardEliminaciones.css";

export default function DashboardEliminaciones() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [pagina, setPagina] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);

  const [metricas, setMetricas] = useState(null);
  const [cargandoMetricas, setCargandoMetricas] = useState(true);

  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [procesando, setProcesando] = useState(false);

  const cargarSolicitudes = useCallback(async () => {
    setLoading(true);

    try {
      const resultado = await listarSolicitudesEliminacionAdmin({
        estado: estadoFiltro || undefined,
        page: pagina,
        size: 10,
      });

      if (resultado.exitoso) {
        setSolicitudes(resultado.datos.content || []);
        setTotalPaginas(resultado.datos.totalPages || 0);
      } else {
        toast.error(resultado.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar solicitudes de eliminación:", error);
      toast.error("No se pudieron cargar las solicitudes de eliminación.");
    } finally {
      setLoading(false);
    }
  }, [estadoFiltro, pagina]);

  const cargarMetricas = useCallback(async () => {
    setCargandoMetricas(true);

    try {
      const resultado = await obtenerMetricasEliminacionAdmin();
      if (resultado.exitoso) {
        setMetricas(resultado.datos);
      }
    } catch (error) {
      console.error("Error al cargar métricas de eliminación:", error);
      toast.error("No se pudieron cargar las métricas.");
    } finally {
      setCargandoMetricas(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargarSolicitudes();
  }, [cargarSolicitudes]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    cargarMetricas();
  }, [cargarMetricas]);

  const handleCambiarFiltro = (valor) => {
    setEstadoFiltro(valor);
    setPagina(0);
  };

  const handleVerDetalle = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setShowModal(true);
  };

  const handleCerrarModal = () => {
    setShowModal(false);
    setSolicitudSeleccionada(null);
  };

  const handleProcesar = async (id, observacion) => {
    setProcesando(true);
    const resultado = await procesarEliminacionAdmin(id, { observacion });
    setProcesando(false);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      handleCerrarModal();
      cargarSolicitudes();
      cargarMetricas();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleRechazar = async (id, observacion) => {
    setProcesando(true);
    const resultado = await rechazarEliminacionAdmin(id, { observacion });
    setProcesando(false);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      handleCerrarModal();
      cargarSolicitudes();
      cargarMetricas();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  return (
    <div className="dashboard-eliminaciones-main-container mt-4">
      <div className="dashboard-eliminaciones-header">
        <span className="dashboard-eliminaciones-top-text">
          Panel de administración
        </span>
        <div className="dashboard-eliminaciones-title-group">
          <h2 className="dashboard-eliminaciones-title">
            <FiUserX className="header-icon" />
            Solicitudes de eliminación de cuenta
          </h2>
          <p className="dashboard-eliminaciones-subtitle">
            Verifica la identidad, resuelve dependencias y procesa las
            eliminaciones de cuenta de la plataforma.
          </p>
        </div>
        <span className="elim-header-line" />
      </div>

      <MetricasEliminacion metricas={metricas} cargando={cargandoMetricas} />

      <div className="elim-filtros">
        <div className="elim-filtro-campo">
          <label htmlFor="estado-filtro">Estado</label>
          <Form.Select
            id="estado-filtro"
            size="sm"
            value={estadoFiltro}
            onChange={(e) => handleCambiarFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {ESTADOS_ELIMINACION.map((e) => (
              <option key={e.valor} value={e.valor}>
                {e.etiqueta}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {loading ? (
        <div className="dashboard-eliminaciones-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando solicitudes...</p>
        </div>
      ) : solicitudes.length === 0 ? (
        <div className="no-eliminaciones">
          <FiSearch className="no-eliminaciones-icon" />
          <p>No se encontraron solicitudes con este filtro</p>
        </div>
      ) : (
        <div className="eliminaciones-list">
          {solicitudes.map((solicitud) => (
            <SolicitudEliminacionCard
              key={solicitud.id}
              solicitud={solicitud}
              onVerDetalle={handleVerDetalle}
            />
          ))}
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="elim-paginacion">
          <button
            className="page-btn"
            disabled={pagina === 0}
            onClick={() => setPagina((p) => p - 1)}
            aria-label="Página anterior"
          >
            <FiChevronLeft />
          </button>
          <span className="page-info">
            {pagina + 1} de {totalPaginas}
          </span>
          <button
            className="page-btn"
            disabled={pagina >= totalPaginas - 1}
            onClick={() => setPagina((p) => p + 1)}
            aria-label="Página siguiente"
          >
            <FiChevronRight />
          </button>
        </div>
      )}

      <ModalGestionEliminacion
        show={showModal}
        solicitud={solicitudSeleccionada}
        procesando={procesando}
        onCerrar={handleCerrarModal}
        onProcesar={handleProcesar}
        onRechazar={handleRechazar}
      />
    </div>
  );
}
