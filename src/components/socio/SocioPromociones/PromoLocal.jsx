import { useEffect, useState } from "react";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function PromoLocal({ state, dispatch }) {
  const [locales, setLocales] = useState([]);

  useEffect(() => {
    // Aquí llamas a tu API para traer los locales del socio logueado
    // Ejemplo:
    // getLocalesBySocio().then(setLocales);
  }, []);

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
      <select
        className="form-control"
        value={state.localId || ""}
        onChange={(e) => dispatch({ type: "SET_LOCAL_ID", payload: e.target.value })}
      >
        <option value="">Selecciona un local...</option>
        {locales.map((local) => (
          <option key={local.id} value={local.id}>
            {local.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}