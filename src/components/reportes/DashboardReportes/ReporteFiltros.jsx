import Select from "react-select";
import {
  ESTADOS_REPORTE,
  GRAVEDADES_REPORTE,
  CATEGORIAS_REPORTE,
  TIPOS_OBJETIVO_REPORTE,
} from "@/services/reporte.service";

const OPCIONES_ESTADO = [
  { value: "", label: "Todos los estados" },
  ...ESTADOS_REPORTE.map((e) => ({ value: e.valor, label: e.etiqueta })),
];

const OPCIONES_GRAVEDAD = [
  { value: "", label: "Todas las gravedades" },
  ...GRAVEDADES_REPORTE.map((g) => ({ value: g.valor, label: g.etiqueta })),
];

const OPCIONES_CATEGORIA = [
  { value: "", label: "Todas las categorías" },
  ...CATEGORIAS_REPORTE.map((c) => ({ value: c.valor, label: c.etiqueta })),
];

const OPCIONES_OBJETIVO = [
  { value: "", label: "Todos los objetivos" },
  ...TIPOS_OBJETIVO_REPORTE.map((t) => ({ value: t.valor, label: t.etiqueta })),
];

const OPCIONES_ESCALADO = [
  { value: "", label: "Todos" },
  { value: "true", label: "Solo escalados" },
  { value: "false", label: "No escalados" },
];

const OPCIONES_ORDEN = [
  { value: "recientes", label: "Más recientes" },
  { value: "antiguos", label: "Más antiguos" },
  { value: "prioridad", label: "Prioridad (gravedad)" },
];

export default function ReporteFiltros({ filtros, onCambiarFiltro }) {
  return (
    <div className="reporte-filtros">
      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-estado">
          Estado
        </label>
        <Select
          inputId="filtro-estado"
          classNamePrefix="spot-select"
          options={OPCIONES_ESTADO}
          value={OPCIONES_ESTADO.find((o) => o.value === filtros.estado)}
          onChange={(opcion) => onCambiarFiltro("estado", opcion ? opcion.value : "")}
          placeholder="Todos los estados"
          isClearable
        />
      </div>

      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-gravedad">
          Gravedad
        </label>
        <Select
          inputId="filtro-gravedad"
          classNamePrefix="spot-select"
          options={OPCIONES_GRAVEDAD}
          value={OPCIONES_GRAVEDAD.find((o) => o.value === filtros.gravedad)}
          onChange={(opcion) => onCambiarFiltro("gravedad", opcion ? opcion.value : "")}
          placeholder="Todas las gravedades"
          isClearable
        />
      </div>

      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-categoria">
          Categoría
        </label>
        <Select
          inputId="filtro-categoria"
          classNamePrefix="spot-select"
          options={OPCIONES_CATEGORIA}
          value={OPCIONES_CATEGORIA.find((o) => o.value === filtros.categoria)}
          onChange={(opcion) => onCambiarFiltro("categoria", opcion ? opcion.value : "")}
          placeholder="Todas las categorías"
          isClearable
        />
      </div>

      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-objetivo">
          Objetivo
        </label>
        <Select
          inputId="filtro-objetivo"
          classNamePrefix="spot-select"
          options={OPCIONES_OBJETIVO}
          value={OPCIONES_OBJETIVO.find((o) => o.value === filtros.tipoObjetivo)}
          onChange={(opcion) => onCambiarFiltro("tipoObjetivo", opcion ? opcion.value : "")}
          placeholder="Todos los objetivos"
          isClearable
        />
      </div>

      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-escalado">
          Escalados
        </label>
        <Select
          inputId="filtro-escalado"
          classNamePrefix="spot-select"
          options={OPCIONES_ESCALADO}
          value={OPCIONES_ESCALADO.find((o) => o.value === filtros.escalado)}
          onChange={(opcion) => onCambiarFiltro("escalado", opcion ? opcion.value : "")}
          placeholder="Todos"
          isClearable
        />
      </div>

      <div className="reporte-filtro-campo">
        <label className="reporte-filtro-label" htmlFor="filtro-orden">
          Ordenar por
        </label>
        <Select
          inputId="filtro-orden"
          classNamePrefix="spot-select"
          options={OPCIONES_ORDEN}
          value={OPCIONES_ORDEN.find((o) => o.value === filtros.orden)}
          onChange={(opcion) => onCambiarFiltro("orden", opcion ? opcion.value : "")}
          placeholder="Ordenar por"
        />
      </div>
    </div>
  );
}
