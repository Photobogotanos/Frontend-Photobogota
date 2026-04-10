import { useState } from "react";
import Select from "react-select";
import "./FiltrosMapa.css";
import { localidadOptions } from "../../../mocks/localidades.mock";
import { categoriasOptions } from "../../../mocks/categoria.mock";


const FiltrosMapa = ({ onFiltrar }) => {
  const [categoria, setCategoria] = useState(null);
  const [localidad, setLocalidad] = useState(null);

  const aplicar = () => {
    onFiltrar({
      ...(categoria && categoria.value !== "todas" ? { categoria: categoria.value } : {}),
      ...(localidad && localidad.value !== "todas" ? { localidad: localidad.value } : {}),
    });
  };

  const limpiar = () => {
    setCategoria(null);
    setLocalidad(null);
    onFiltrar({});
  };

  return (
    <div className="filtros-container">
      <div className="filtros-izquierda">
        <Select
          options={categoriasOptions}
          value={categoria}
          onChange={setCategoria}
          placeholder="Todas las categorías"
          className="filtro-select"
          classNamePrefix="react-select"
          isClearable
        />
        <Select
          options={localidadOptions}
          value={localidad}
          onChange={setLocalidad}
          placeholder="Todas las localidades"
          className="filtro-select"
          classNamePrefix="react-select"
          isClearable
        />
      </div>

      <div className="filtros-acciones">
        <button className="filtro-aplicar" onClick={aplicar}>
          Aplicar filtros
        </button>
        <button className="filtro-limpiar" onClick={limpiar}>
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default FiltrosMapa;