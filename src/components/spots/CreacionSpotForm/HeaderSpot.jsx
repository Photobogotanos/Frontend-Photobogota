export default function HeaderSpot({ esSocio }) {
  return (
    <div className="spot-header">
      <span className="spot-header-subtitle">{esSocio ? "Nuevo establecimiento" : "Nueva publicación"}</span>
      <h2 className="spot-header-title">{esSocio ? "Crear Local" : "Crear spot"}</h2>
      <span className="spot-header-line" />
    </div>
  );
}
