import { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useGuardados } from "@/hooks/useGuardados";
import { useSpotData } from "@/hooks/useSpotData";
import { useResenas } from "@/hooks/useResenas";
import { toast } from "react-hot-toast";
import ReportarModal from "./ReportarModal";
import SpotInfo from "./SpotInfo";
import SpotReviewsSection from "./SpotReviewsSection";
import MapaVista from "./MapaVista";
import CanjearPromocionModal from "./CanjearPromocionModal";
import "./SpotContent.css";

const MapaContent = () => {
  const { id } = useParams();
  const { usuario, logueado, recargarUsuario } = useAuth();
  const { isGuardado, toggleGuardado } = useGuardados();
  const [filtrosVisibles, setFiltrosVisibles] = useState(true);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  const [guardandoSpot, setGuardandoSpot] = useState(false);

  // Modal de reporte
  const [modalReporteAbierto, setModalReporteAbierto] = useState(false);
  const [contextoReporte, setContextoReporte] = useState(null);

  // Modal de canje de promoción
  const [modalCanjeAbierto, setModalCanjeAbierto] = useState(false);
  const [sesionCanje, setSesionCanje] = useState(0);

  // Custom hooks
  const { spot, cargandoSpot, promocion, recargarPromocion } = useSpotData(id);
  const {
    calificaciones,
    cargandoCalificaciones,
    miCalificacion,
    enviandoCalificacion,
    editandoResena,
    setEditandoResena,
    sancionRecibida,
    setSancionRecibida,
    estadoResena,
    dispatchResena,
    handleSubmitCalificacion,
    handleCancelarEdicion,
    verEstadoDeSancion,
  } = useResenas(id, usuario);

  // Handlers
  const abrirReporteSpot = () => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte(null);
    setModalReporteAbierto(true);
  };

  const abrirReporteResena = (resenaId, nombreAutorResena) => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para reportar");
      return;
    }
    setContextoReporte({ resenaId, nombreAutorResena });
    setModalReporteAbierto(true);
  };

  const cerrarReporte = () => {
    setModalReporteAbierto(false);
    setContextoReporte(null);
  };

  const handleGuardarSpot = async () => {
    if (!logueado) {
      toast.error("Inicia sesión para guardar spots");
      return;
    }
    setGuardandoSpot(true);
    const resultado = await toggleGuardado(id);
    if (resultado.exitoso) {
      toast.success(resultado.mensaje);
    } else {
      toast.error(resultado.mensaje);
    }
    setGuardandoSpot(false);
  };

  const abrirCanje = () => {
    if (!logueado) {
      toast.error("Debes iniciar sesión para canjear promociones");
      return;
    }
    setSesionCanje((s) => s + 1);
    setModalCanjeAbierto(true);
  };

  // Loading state
  if (cargandoSpot) {
    return (
      <div className="lugar-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Spot found
  if (spot) {
    return (
      <div className="lugar-content-wrapper">
        <SpotInfo
          spot={spot}
          promocion={promocion}
          esGuardado={isGuardado(spot.id)}
          guardandoSpot={guardandoSpot}
          handleGuardarSpot={handleGuardarSpot}
          abrirReporteSpot={abrirReporteSpot}
          logueado={logueado}
          rolUsuario={usuario?.rol}
          onCanjear={abrirCanje}
        />

        <SpotReviewsSection
          spotId={id}
          usuario={usuario}
          logueado={logueado}
          calificaciones={calificaciones}
          cargandoCalificaciones={cargandoCalificaciones}
          miCalificacion={miCalificacion}
          enviandoCalificacion={enviandoCalificacion}
          editandoResena={editandoResena}
          setEditandoResena={setEditandoResena}
          sancionRecibida={sancionRecibida}
          setSancionRecibida={setSancionRecibida}
          estadoResena={estadoResena}
          dispatchResena={dispatchResena}
          handleSubmitCalificacion={handleSubmitCalificacion}
          handleCancelarEdicion={handleCancelarEdicion}
          verEstadoDeSancion={verEstadoDeSancion}
          abrirReporteResena={abrirReporteResena}
          recargarUsuario={recargarUsuario}
        />

        <ReportarModal
          show={modalReporteAbierto}
          onCerrar={cerrarReporte}
          spotId={spot.id}
          resenaId={contextoReporte?.resenaId ?? null}
          nombreAutorResena={contextoReporte?.nombreAutorResena ?? null}
        />

        <CanjearPromocionModal
          key={sesionCanje}
          show={modalCanjeAbierto}
          onCerrar={() => setModalCanjeAbierto(false)}
          promocion={promocion}
          spotNombre={spot.nombre}
          onCanjeado={recargarPromocion}
        />
      </div>
    );
  }

  return (
    <MapaVista
      filtrosVisibles={filtrosVisibles}
      onToggleFiltros={() => setFiltrosVisibles(!filtrosVisibles)}
      onFiltrar={setFiltrosActivos}
      filtros={filtrosActivos}
    />
  );
};

export default MapaContent;
