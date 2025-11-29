import "./FiltrosMapa.css";

const FiltrosMapa = () => {
  return (
    <div className="filtros-container">
      <div className="filtros-izquierda">
        <button className="filtro-btn">
          Todas las categorías
        </button>
        <button className="filtro-btn">
          Selecciona el tipo
        </button>
        <button className="filtro-btn">
          Selecciona una localidad
        </button>
        <button className="filtro-btn">
          Cualquier distancia
        </button>
      </div>

      <button className="filtro-limpiar">
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltrosMapa;