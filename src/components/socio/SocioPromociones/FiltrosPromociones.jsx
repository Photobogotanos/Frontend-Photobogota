const OPCIONES_FILTRO = [
  { valor: "todas", etiqueta: "Todas" },
  { valor: "ACTIVA", etiqueta: "Activas" },
  { valor: "PROXIMA", etiqueta: "Próximamente" },
  { valor: "EXPIRADA", etiqueta: "Expiradas" },
  { valor: "DESACTIVADA", etiqueta: "Desactivadas" },
];

export default function FiltrosPromociones({ filtroEstado, onChange, contarPorEstado }) {
  return (
    <div className="filtros-promociones">
      {OPCIONES_FILTRO.map(({ valor, etiqueta }) => (
        <button
          key={valor}
          type="button"
          className={`filtro-btn ${filtroEstado === valor ? "activo" : ""}`}
          onClick={() => onChange(valor)}
        >
          {etiqueta} ({contarPorEstado(valor)})
        </button>
      ))}
    </div>
  );
}