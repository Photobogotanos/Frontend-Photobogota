import { useState, lazy, Suspense } from "react";
import "./EstadisticasSocio.css";
import EstadisticasHeader from "./EstadisticasHeader";
import EstadisticasRapidas from "./EstadisticasRapidas";
import LugaresPopulares from "./LugaresPopulares";

// Importación lazy para código splitting de rechart
const GraficosEstadisticos = lazy(() => import("./GraficosEstadisticos"));

const EstadisticasSocio = () => {
  const [periodo, setPeriodo] = useState("mes");

  return (
    <div className="estadisticas-socio-container">
      <EstadisticasHeader periodo={periodo} setPeriodo={setPeriodo} />
      <EstadisticasRapidas periodo={periodo} />
      <Suspense fallback={<div className="text-center py-5">Cargando gráficos...</div>}>
        <GraficosEstadisticos periodo={periodo} />
      </Suspense>
      <LugaresPopulares />
    </div>
  );
};

export default EstadisticasSocio;
