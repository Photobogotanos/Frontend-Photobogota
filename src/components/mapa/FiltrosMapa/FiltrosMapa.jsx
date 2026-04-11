import { useState, useEffect } from "react";
import Select from "react-select";
import "./FiltrosMapa.css";
import { getCategoriasActivas } from "../../../api/categoriaApi";
import { getLocalidadesActivas } from "../../../api/localidadApi";


const FiltrosMapa = ({ onFiltrar }) => {
  const [categoria, setCategoria] = useState(null);
  const [localidad, setLocalidad] = useState(null);
  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [localidadOptions, setLocalidadOptions] = useState([]);

  useEffect(() => {
    getCategoriasActivas().then(setCategoriasOptions);
    getLocalidadesActivas().then(setLocalidadOptions);
  }, []);

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