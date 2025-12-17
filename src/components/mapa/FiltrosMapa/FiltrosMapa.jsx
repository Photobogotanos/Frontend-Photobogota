import Select from "react-select";
import "./FiltrosMapa.css";

const FiltrosMapa = () => {
  const categoriasOptions = [
    { value: "todas", label: "Todas las categorías" },
    { value: "turismo", label: "Turismo" },
    { value: "historia", label: "Historia" },
    { value: "naturaleza", label: "Naturaleza" },
    { value: "gastronomia", label: "Gastronomía" },
  ];

  const tipoOptions = [
    { value: "cualquiera", label: "Cualquier tipo" },
    { value: "punto-interes", label: "Punto de Interés" },
    { value: "evento", label: "Evento" },
    { value: "ruta", label: "Ruta" },
    { value: "fotografia", label: "Spot Fotográfico" },
  ];

  const localidadOptions = [
    { value: "todas", label: "Todas las localidades" },
    { value: "usaquen", label: "Usaquén" },
    { value: "chapinero", label: "Chapinero" },
    { value: "kennedy", label: "Kennedy" },
    { value: "engativa", label: "Engativá" },
    { value: "centro", label: "Centro Internacional" },
  ];

  const distanciaOptions = [
    { value: "cualquiera", label: "Cualquier distancia" },
    { value: "1km", label: "Dentro de 1km" },
    { value: "5km", label: "Dentro de 5km" },
    { value: "10km", label: "Dentro de 10km" },
    { value: "20km", label: "Dentro de 20km" },
  ];

  return (
    <div className="filtros-container">
      <div className="filtros-izquierda">
        <Select
          options={categoriasOptions}
          defaultValue={categoriasOptions[0]}
          className="filtro-select"
          classNamePrefix="react-select"
        />
        <Select
          options={tipoOptions}
          defaultValue={tipoOptions[0]}
          className="filtro-select"
          classNamePrefix="react-select"
        />
        <Select
          options={localidadOptions}
          defaultValue={localidadOptions[0]}
          className="filtro-select"
          classNamePrefix="react-select"
        />
        <Select
          options={distanciaOptions}
          defaultValue={distanciaOptions[0]}
          className="filtro-select"
          classNamePrefix="react-select"
        />
      </div>

      <button className="filtro-limpiar">
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltrosMapa;
