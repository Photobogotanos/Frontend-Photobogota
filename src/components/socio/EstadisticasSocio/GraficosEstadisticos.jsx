import { lazy, Suspense } from "react";

const GraficosRecharts = lazy(() => import("./GraficosRecharts"));

const GraficosEstadisticos = ({ periodo, datos }) => {
  const seriesVisitas = (datos?.seriesVisitas || []).map((punto) => ({
    name: punto.etiqueta,
    visitas: punto.valor,
  }));

  const datosResenas = (datos?.distribucionResenas || []).map((dist) => ({
    name: `${dist.estrellas} ${dist.estrellas === 1 ? "Estrella" : "Estrellas"}`,
    value: dist.cantidad,
  }));

  const datosLugares = (datos?.lugaresPopulares || [])
    .slice(0, 5)
    .map((lugar) => ({ name: lugar.nombre, visitas: lugar.visitas }));

  const datosUsos = (datos?.seriesUsosPromociones || []).map((punto) => ({
    name: punto.etiqueta,
    usos: punto.valor,
  }));

  return (
    <Suspense fallback={<div className="text-center text-muted py-4">Cargando gráficos...</div>}>
      <GraficosRecharts
        periodo={periodo}
        hayPromociones={Boolean(datos?.hayPromociones)}
        datosVisitas={seriesVisitas}
        datosResenas={datosResenas}
        datosLugares={datosLugares}
        datosUsos={datosUsos}
      />
    </Suspense>
  );
};

export default GraficosEstadisticos;