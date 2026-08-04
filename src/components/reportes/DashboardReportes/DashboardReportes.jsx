import { useState, useEffect, useCallback } from "react";
import { FiFlag, FiSearch } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerDashboardReportes,
  cambiarEstadoReporte,
  escalarReporte,
} from "@/services/reporte.service";
import ReporteFiltros from "./ReporteFiltros";
import ReporteCard from "./ReporteCard";
import ModalCambiarEstado from "./ModalCambiarEstado";
import ModalEscalar from "./ModalEscalar";
import "./DashboardReportes.css";

const FILTROS_INICIALES = {
  estado: "",
  gravedad: "",
  categoria: "",
  tipoObjetivo: "",
  escalado: "",
  orden: "recientes",
};

export default function DashboardReportes() {
  const { usuario } = useAuth();
  const esModerador = usuario?.rol === "MOD";

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [showCambiarEstado, setShowCambiarEstado] = useState(false);
  const [showEscalar, setShowEscalar] = useState(false);

  const cargarReportes = useCallback(async () => {
    setLoading(true);

    try {
      const resultado = await obtenerDashboardReportes(filtros);
      if (resultado.exitoso) {
        setReportes(resultado.datos);
      } else {
        toast.error(resultado.mensaje);
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarReportes();
  }, [cargarReportes]);

  const handleCambiarFiltro = (campo, valor) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAbrirCambiarEstado = (reporte) => {
    setReporteSeleccionado(reporte);
    setShowCambiarEstado(true);
  };

  const handleAbrirEscalar = (reporte) => {
    setReporteSeleccionado(reporte);
    setShowEscalar(true);
  };

  const handleConfirmarCambiarEstado = async (id, body) => {
    const resultado = await cambiarEstadoReporte(id, body);
    if (resultado.exitoso) {
      toast.success("Estado actualizado");
      setShowCambiarEstado(false);
      cargarReportes();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleConfirmarEscalar = async (id, body) => {
    const resultado = await escalarReporte(id, body);
    if (resultado.exitoso) {
      toast.success("Reporte escalado a un administrador");
      setShowEscalar(false);
      cargarReportes();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  if (loading && reportes.length === 0) {
    return (
      <div className="dashboard-reportes-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p>Cargando reportes...</p>
      </div>
    );
  }

  const contar = (predicado) => reportes.filter(predicado).length;
  const stats = {
    nuevos: contar((r) => r.estado === "NUEVO"),
    enRevision: contar((r) => r.estado === "EN_REVISION"),
    resueltos: contar((r) => r.estado === "RESUELTO"),
    rechazados: contar((r) => r.estado === "RECHAZADO"),
    criticos: contar((r) => r.gravedad === "CRITICA"),
    escalados: contar((r) => r.escalado),
  };

  return (
    <div className="dashboard-reportes-main-container mt-4">
      <div className="dashboard-reportes-header">
        <span className="dashboard-reportes-top-text">
          {esModerador ? "Panel de moderación" : "Panel de administración"}
        </span>
        <div className="dashboard-reportes-title-group">
          <h2 className="dashboard-reportes-title">
            <FiFlag className="header-icon" />
            Dashboard de reportes
          </h2>
          <p className="dashboard-reportes-subtitle">
            {esModerador
              ? "Revisá, cambiá el estado o escalá a un administrador los reportes asignados a moderación."
              : "Visibilidad total sobre los reportes de la comunidad, incluyendo los escalados por moderación."}
          </p>
        </div>
        <span className="spot-header-line" />
      </div>

      <div className="reporte-stats">
        <span className="reporte-stat-badge stat-nuevo">
          <span className="stat-numero">{stats.nuevos}</span> nuevos
        </span>
        <span className="reporte-stat-badge stat-en_revision">
          <span className="stat-numero">{stats.enRevision}</span> en revisión
        </span>
        <span className="reporte-stat-badge stat-resuelto">
          <span className="stat-numero">{stats.resueltos}</span> resueltos
        </span>
        <span className="reporte-stat-badge stat-rechazado">
          <span className="stat-numero">{stats.rechazados}</span> rechazados
        </span>
        <span className="reporte-stat-badge stat-critica">
          <span className="stat-numero">{stats.criticos}</span> críticos
        </span>
        {esModerador && (
          <span className="reporte-stat-badge stat-escalado">
            <span className="stat-numero">{stats.escalados}</span> escalados
          </span>
        )}
      </div>

      <ReporteFiltros filtros={filtros} onCambiarFiltro={handleCambiarFiltro} />

      {reportes.length === 0 ? (
        <div className="no-reportes">
          <FiSearch className="no-reportes-icon" />
          <p>No se encontraron reportes con estos filtros</p>
        </div>
      ) : (
        <div className="reportes-list">
          {reportes.map((reporte) => (
            <ReporteCard
              key={reporte.id}
              reporte={reporte}
              puedeEscalar={esModerador}
              onCambiarEstado={handleAbrirCambiarEstado}
              onEscalar={handleAbrirEscalar}
            />
          ))}
        </div>
      )}

      <ModalCambiarEstado
        show={showCambiarEstado}
        reporte={reporteSeleccionado}
        onCerrar={() => setShowCambiarEstado(false)}
        onConfirmar={handleConfirmarCambiarEstado}
      />

      <ModalEscalar
        show={showEscalar}
        reporte={reporteSeleccionado}
        onCerrar={() => setShowEscalar(false)}
        onConfirmar={handleConfirmarEscalar}
      />
    </div>
  );
}
