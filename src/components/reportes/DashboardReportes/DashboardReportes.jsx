import { useState, useEffect, useCallback } from "react";
import { FiFlag, FiSearch, FiCheckCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerDashboardReportes,
  cambiarEstadoReporte,
  escalarReporte,
  obtenerReportesPendientesValidacion,
  validarReporte,
} from "@/services/reporte.service";
import ReporteFiltros from "./ReporteFiltros";
import ReporteCard from "./ReporteCard";
import ModalCambiarEstado from "./ModalCambiarEstado";
import ModalEscalar from "./ModalEscalar";
import ModalValidar from "./ModalValidar";
import "./DashboardReportes.css";
import PageHeader from "../../common/PageHeader/PageHeader";

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
  const esSocio = usuario?.rol === "SOCIO";
  const esAdmin = usuario?.rol === "ADMIN";

  // Un SOCIO escala hacia moderación, un MOD hacia administración. ADMIN es
  // el tope de la cadena y no puede escalar más (HU 24).
  const puedeEscalar = esModerador || esSocio;
  const siguienteNivelEtiqueta = esSocio ? "un moderador" : "un administrador";

  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState(FILTROS_INICIALES);

  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [showCambiarEstado, setShowCambiarEstado] = useState(false);
  const [showEscalar, setShowEscalar] = useState(false);
  const [showValidar, setShowValidar] = useState(false);

  // Solo un MOD ve esta cola: reportes que un SOCIO/ADMIN marcaron como
  // solucionados y que esperan su aprobación (HU 15 pt 4-5, HU 16 pt 4-5).
  const [pendientesValidacion, setPendientesValidacion] = useState([]);

  const cargarReportes = useCallback(async () => {
    setLoading(true);

    try {
      const [resultado, resultadoPendientes] = await Promise.all([
        obtenerDashboardReportes(filtros),
        esModerador ? obtenerReportesPendientesValidacion() : Promise.resolve(null),
      ]);

      if (resultado.exitoso) {
        setReportes(resultado.datos);
      } else {
        toast.error(resultado.mensaje);
      }

      if (resultadoPendientes) {
        if (resultadoPendientes.exitoso) {
          setPendientesValidacion(resultadoPendientes.datos);
        } else {
          toast.error(resultadoPendientes.mensaje);
        }
      }
    } catch (error) {
      console.error("Error al cargar reportes:", error);
      toast.error("No se pudieron cargar los reportes.");
    } finally {
      setLoading(false);
    }
  }, [filtros, esModerador]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
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

  const handleAbrirValidar = (reporte) => {
    setReporteSeleccionado(reporte);
    setShowValidar(true);
  };

  const handleConfirmarCambiarEstado = async (id, body) => {
    const resultado = await cambiarEstadoReporte(id, body);
    if (resultado.exitoso) {
      toast.success(
        body.estado === "RESUELTO" && !esModerador
          ? "Marcado como solucionado, queda pendiente de validación de un moderador"
          : "Estado actualizado",
      );
      setShowCambiarEstado(false);
      cargarReportes();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleConfirmarEscalar = async (id, body) => {
    const resultado = await escalarReporte(id, body, siguienteNivelEtiqueta);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      setShowEscalar(false);
      cargarReportes();
    } else {
      toast.error(resultado.mensaje);
    }
  };

  const handleConfirmarValidar = async (id, body) => {
    const resultado = await validarReporte(id, body);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
      setShowValidar(false);
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
          {esModerador && "Panel de moderación"}
          {esAdmin && "Panel de administración"}
          {esSocio && "Panel de mi negocio"}
        </span>
        <div className="dashboard-reportes-title-group">
          <h2 className="dashboard-reportes-title">
            <FiFlag className="header-icon" />
            {esSocio ? "Reportes de mis locales" : "Dashboard de reportes"}
          </h2>
          <p className="dashboard-reportes-subtitle">
            {esModerador &&
              "Revisá, cambiá el estado o escalá a un administrador los reportes asignados a moderación. También validás lo que resuelven socios y administradores."}
            {esAdmin &&
              "Visibilidad sobre los reportes asignados a administración, incluyendo los escalados por moderación."}
            {esSocio &&
              "Atendé los reportes sobre tus establecimientos. Respondé en máximo 24h y resolvé en máximo 5 días, o escalalo a moderación si no podés resolverlo."}
          </p>
        </div>
        <span className="spot-header-line" />
      </div>

      {esModerador && pendientesValidacion.length > 0 && (
        <div className="reportes-pendientes-validacion">
          <h3 className="pendientes-validacion-title">
            <FiCheckCircle className="header-icon" />
            Pendientes de validar ({pendientesValidacion.length})
          </h3>
          <p className="text-muted">
            Reportes que un socio o un administrador marcaron como solucionados. Aprobalos para notificar al
            miembro afectado, o rechazalos si la solución no es suficiente.
          </p>
          <div className="reportes-list">
            {pendientesValidacion.map((reporte) => (
              <ReporteCard
                key={reporte.id}
                reporte={reporte}
                puedeEscalar={false}
                puedeValidar
                onCambiarEstado={handleAbrirCambiarEstado}
                onEscalar={handleAbrirEscalar}
                onValidar={handleAbrirValidar}
              />
            ))}
          </div>
        </div>
      )}

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
        {puedeEscalar && (
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
              puedeEscalar={puedeEscalar && reporte.estado !== "PENDIENTE_VALIDACION"}
              onCambiarEstado={handleAbrirCambiarEstado}
              onEscalar={handleAbrirEscalar}
            />
          ))}
        </div>
      )}

      <ModalCambiarEstado
        key={reporteSeleccionado?.id}
        show={showCambiarEstado}
        reporte={reporteSeleccionado}
        esModerador={esModerador}
        onCerrar={() => setShowCambiarEstado(false)}
        onConfirmar={handleConfirmarCambiarEstado}
      />

      <ModalEscalar
        show={showEscalar}
        reporte={reporteSeleccionado}
        siguienteNivelEtiqueta={siguienteNivelEtiqueta}
        onCerrar={() => setShowEscalar(false)}
        onConfirmar={handleConfirmarEscalar}
      />

      <ModalValidar
        show={showValidar}
        reporte={reporteSeleccionado}
        onCerrar={() => setShowValidar(false)}
        onConfirmar={handleConfirmarValidar}
      />
    </div>
  );
}
