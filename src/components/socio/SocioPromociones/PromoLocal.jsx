import { useState } from "react";
import { useEffect } from "react";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Select from "react-select";
import { obtenerMisLocales } from "@/services/spot.service";

export default function PromoLocal({ state, dispatch, edicionLocalId }) {
  const [locales, setLocales] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    obtenerMisLocales()
      .then((localesData) => {
        if (!activo) return;
        if (Array.isArray(localesData)) {
          setLocales(localesData);
        } else if (localesData && Array.isArray(localesData.datos)) {
          setLocales(localesData.datos);
        }
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  // Al entrar en edición, si el local sigue vivo lo dejamos seleccionado.
  useEffect(() => {
    if (edicionLocalId && locales.length > 0 && !state.localId) {
      dispatch({ type: "SET_LOCAL_ID", payload: edicionLocalId });
    }
  }, [edicionLocalId, locales, state.localId, dispatch]);

  const opcionesLocales = locales.map((local) => ({
    value: local.id,
    label: local.nombre,
  }));

  if (cargando) {
    return (
      <div className="promo-section mb-4">
        <h5 className="section-title">Local asociado</h5>
        <p className="promo-local-cargando text-muted mb-0">
          Cargando tus locales...
        </p>
      </div>
    );
  }

  if (locales.length === 0) {
    return (
      <div className="promo-section mb-4 alert alert-warning">
        <strong>No tienes locales creados.</strong>
        <p className="mb-0">
          Debes crear al menos un local antes de poder publicar una promoción.
        </p>
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