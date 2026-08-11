
export default function HeaderSpot({ esSocio }) {
  return (
    <div className="spot-header">
      <span className="spot-header-subtitle">{esSocio ? "Nueva publicación" : "Nuevo establecimiento"}</span>
      <h2 className="spot-header-title">{esSocio ? "Crear spot" : "Crear local"}</h2>
      <span className="spot-header-line" />
    </div>
  );
};
