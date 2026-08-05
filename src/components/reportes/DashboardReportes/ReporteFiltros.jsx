import Form from "react-bootstrap/Form";
import {
  ESTADOS_REPORTE,
  GRAVEDADES_REPORTE,
  CATEGORIAS_REPORTE,
  TIPOS_OBJETIVO_REPORTE,
} from "@/services/reporte.service";

export default function ReporteFiltros({ filtros, onCambiarFiltro }) {
  return (
    <div className="reporte-filtros">
      <div className="reporte-filtro-campo">
        <label htmlFor="estado">Estado</label>
        <Form.Select
          size="sm"
          id="estado"
          value={filtros.estado}
          onChange={(e) => onCambiarFiltro("estado", e.target.value)}
        >
          <option value="">Todos</option>
          {ESTADOS_REPORTE.map((e) => (
            <option key={e.valor} value={e.valor}>
              {e.etiqueta}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="reporte-filtro-campo">
        <label htmlFor="gravedad">Gravedad</label>
        <Form.Select
          size="sm"
          id="gravedad"
          value={filtros.gravedad}
          onChange={(e) => onCambiarFiltro("gravedad", e.target.value)}
        >
          <option value="">Todas</option>
          {GRAVEDADES_REPORTE.map((g) => (
            <option key={g.valor} value={g.valor}>
              {g.etiqueta}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="reporte-filtro-campo">
        <label htmlFor="tipo">Tipo</label>
        <Form.Select
          size="sm"
          id="tipo"
          value={filtros.categoria}
          onChange={(e) => onCambiarFiltro("categoria", e.target.value)}
        >
          <option value="">Todas</option>
          {CATEGORIAS_REPORTE.map((c) => (
            <option key={c.valor} value={c.valor}>
              {c.etiqueta}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="reporte-filtro-campo">
        <label htmlFor="tipo-objetivo">Objetivo</label>
        <Form.Select
          size="sm"
          id="tipo-objetivo"
          value={filtros.tipoObjetivo}
          onChange={(e) => onCambiarFiltro("tipoObjetivo", e.target.value)}
        >
          <option value="">Todos</option>
          {TIPOS_OBJETIVO_REPORTE.map((t) => (
            <option key={t.valor} value={t.valor}>
              {t.etiqueta}
            </option>
          ))}
        </Form.Select>
      </div>

      <div className="reporte-filtro-campo">
        <label htmlFor="escalado">Escalados</label>
        <Form.Select
          size="sm"
          id="escalado"
          value={filtros.escalado}
          onChange={(e) => onCambiarFiltro("escalado", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="true">Solo escalados</option>
          <option value="false">No escalados</option>
        </Form.Select>
      </div>

      <div className="reporte-filtro-campo">
        <label htmlFor="orden">Ordenar por</label>
        <Form.Select
          size="sm"
          id="orden"
          value={filtros.orden}
          onChange={(e) => onCambiarFiltro("orden", e.target.value)}
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="prioridad">Prioridad (gravedad)</option>
        </Form.Select>
      </div>
    </div>
  );
}
