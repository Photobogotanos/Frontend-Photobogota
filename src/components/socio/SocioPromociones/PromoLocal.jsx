import { useEffect, useState } from "react";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Select from "react-select";

export default function PromoLocal({ state, dispatch }) {
  const [locales, setLocales] = useState([]);

  useEffect(() => {
  // TODO: reemplazar por getLocalesBySocio() cuando el endpoint esté listo
  // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
  setLocales([
    { id: 1, nombre: "Local de prueba" },
  ]);
}, []);

  const opcionesLocales = locales.map((local) => ({
    value: local.id,
    label: local.nombre,
  }));

  if (locales.length === 0) {
    return (
      <div className="promo-section mb-4 alert alert-warning">
        <strong>No tienes locales creados.</strong>
        <p className="mb-0">Debes crear al menos un local antes de poder publicar una promoción.</p>
      </div>
    );
  }

  return (
    <div className="promo-section mb-4">
      <h5 className="section-title">Local asociado</h5>
      <label className="promo-label" htmlFor="local-select">
        Selecciona el local <RequiredMark />
      </label>
      <Select
        id="local-select"
        inputId="local-select"
        classNamePrefix="spot-select"
        options={opcionesLocales}
        value={opcionesLocales.find((o) => o.value === state.localId) || null}
        onChange={(opcion) =>
          dispatch({ type: "SET_LOCAL_ID", payload: opcion ? opcion.value : "" })
        }
        isClearable
        placeholder="Selecciona un local..."
      />
    </div>
  );
}