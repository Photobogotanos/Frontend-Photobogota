import { useState } from "react";
import Select from "react-select";
import "./FiltrosMapa.css";

const categoriasOptions = [
  { value: "todas", label: "Todas las categorías" },
  { value: "Atractivo turístico", label: "Atractivo turístico" },
  { value: "Parque", label: "Parque" },
  { value: "Estación TransMilenio", label: "Estación TransMilenio" },
  { value: "Naturaleza", label: "Naturaleza" },
  { value: "Histórico", label: "Histórico" },
  { value: "Urbano", label: "Urbano" },
  { value: "Gastronomía", label: "Gastronomía" },
];

const localidadOptions = [
  { value: "todas", label: "Todas las localidades" },
  { value: "Usaquén", label: "Usaquén" },
  { value: "Chapinero", label: "Chapinero" },
  { value: "Santa Fe", label: "Santa Fe" },
  { value: "La Candelaria", label: "La Candelaria" },
  { value: "Kennedy", label: "Kennedy" },
  { value: "Engativá", label: "Engativá" },
  { value: "Suba", label: "Suba" },
  { value: "Teusaquillo", label: "Teusaquillo" },
  { value: "Barrios Unidos", label: "Barrios Unidos" },
  { value: "Fontibón", label: "Fontibón" },
];

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