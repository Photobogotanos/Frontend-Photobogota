export default function HeaderPromo({ editando }) {
  return (
    <div className="promo-header">
      <span className="promo-header-subtitle">
        {editando ? "Editar promoción" : "Nueva promoción"}
      </span>
      <h2 className="promo-header-title">
        {editando ? "Editar promoción" : "Crear promoción"}
      </h2>
      <span className="promo-header-line" />
    </div>
  );
}