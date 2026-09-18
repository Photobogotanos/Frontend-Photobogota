import React, { useState, Suspense, useEffect } from "react";
import { Spinner, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import "./EstadisticasSocio.css";
import EstadisticasHeader from "./EstadisticasHeader";
import EstadisticasRapidas from "./EstadisticasRapidas";
import LugaresPopulares from "./LugaresPopulares";
import { obtenerEstadisticasSocio } from "@/services/estadisticas.service";

// Importación lazy para código splitting de rechart
const GraficosEstadisticos = React.lazy(() => import('./GraficosEstadisticos'));

const EstadisticasSocio = () => {
  const [periodo, setPeriodo] = useState("mes");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [periodoCargado, setPeriodoCargado] = useState(null);

  useEffect(() => {
    let activo = true;

    obtenerEstadisticasSocio(periodo)
      .then((res) => {
        if (!activo) return;
        setDatos(res.exitoso ? res.datos : null);
        setError(res.exitoso ? null : res.mensaje);
        setPeriodoCargado(periodo);
      })
      .catch(() => {
        if (!activo) return;
        setError("Ocurrió un error inesperado al cargar las estadísticas.");
        setPeriodoCargado(periodo);
      });

    return () => {
      activo = false;
    };
  }, [periodo]);

  const cargando = periodoCargado !== periodo;

  return (
    <div className="estadisticas-socio-container">
      <EstadisticasHeader periodo={periodo} setPeriodo={setPeriodo} />

      {cargando && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status" style={{ color: "#806fbe" }} />
          <p className="text-muted mt-3 mb-0">Calculando tus estadísticas...</p>
        </div>
      )}

      {!cargando && error && (
        <Alert variant="warning" className="d-flex align-items-center gap-2">
          <FaExclamationTriangle />
          <span>{error}</span>
        </Alert>
      )}

      {!cargando && !error && datos && (
        <>
          <EstadisticasRapidas kpis={datos.kpis} />
          <Suspense fallback={<div className="text-center py-5">Cargando gráficos...</div>}>
            <GraficosEstadisticos periodo={periodo} datos={datos} />
          </Suspense>
          <LugaresPopulares lugares={datos.lugaresPopulares || []} />
        </>
      )}
    </div>
  );
};

export default EstadisticasSocio;