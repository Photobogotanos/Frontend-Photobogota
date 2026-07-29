import { useEffect, useState } from "react";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Select from "react-select";

export default function PromoLocal({ state, dispatch }) {
  const [locales, setLocales] = useState([]);

  useEffect(() => {
    // getLocalesBySocio().then(setLocales);
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
      <label className="promo-label">Selecciona el local <RequiredMark /></label>
      <Select
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