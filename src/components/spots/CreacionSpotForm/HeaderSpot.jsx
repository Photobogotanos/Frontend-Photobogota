export default function HeaderSpot() {
  return (
    <div className="spot-header">
      <span className="spot-header-subtitle">{esSocio ? "Nuevo establecimiento" : "Nueva publicación"}</span>
      <h2 className="spot-header-title">Crear spot</h2>
      <span className="spot-header-line" />
    </div>
  );
}
