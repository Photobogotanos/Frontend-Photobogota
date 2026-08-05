import { useEffect, useRef } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import flatpickr from "flatpickr";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { MdDateRange } from "react-icons/md";
import { Spanish } from "flatpickr/dist/l10n/es.js";

flatpickr.localize(Spanish);

export default function PromoDisponibilidad({ state, dispatch }) {
  const startRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    const startPicker = flatpickr(startRef.current, {
      dateFormat: "Y-m-d",
      minDate: "today",
      defaultDate: state.fechaInicio || null,
      onChange: ([date]) => {
        dispatch({
          type: "SET_FECHA_INICIO",
          payload: date ? date.toISOString().split("T")[0] : "",
        });
      },
    });

    const endPicker = flatpickr(endRef.current, {
      dateFormat: "Y-m-d",
      minDate: state.fechaInicio || "today",
      defaultDate: state.fechaFin || null,
      onChange: ([date]) => {
        dispatch({
          type: "SET_FECHA_FIN",
          payload: date ? date.toISOString().split("T")[0] : "",
        });
      },
    });

    return () => {
      startPicker.destroy();
      endPicker.destroy();
    };
  }, [dispatch, state.fechaFin, state.fechaInicio]);

  return (
    <div className="promo-section mb-4">
      <h5 className="section-title">Disponibilidad y Límite</h5>
      <Row className="g-3">
        <Col md={6}>
          <label className="creacion-formulario-label" htmlFor="fechaInicio">
            <MdDateRange /> Fecha de inicio <RequiredMark />
          </label>
          <input
            id="fechaInicio"
            ref={startRef}
            className="rounded-pill form-control input-without-focus"
            placeholder="Selecciona fecha"
            readOnly
          />
        </Col>
        <Col md={6}>
          <label className="creacion-formulario-label" htmlFor="fechaFin">
            Fecha de fin <RequiredMark />
          </label>
          <input
            id="fechaFin"
            ref={endRef}
            className="rounded-pill form-control input-without-focus"
            placeholder="Selecciona fecha"
            readOnly
          />
        </Col>
        <Col md={6}>
          <label className="promo-label" htmlFor="limiteUsos">
            Límite de códigos / usos
          </label>
          <input
            id="limiteUsos"
            type="number"
            min="1"
            max="1000"
            className="form-control"
            value={state.limiteUsos}
            onChange={(e) => {
              const val = e.target.value;
              if (
                val === "" ||
                (/^\d+$/.test(val) && +val >= 1 && +val <= 1000)
              ) {
                dispatch({ type: "SET_LIMITE_USOS", payload: val });
              }
            }}
            placeholder="Ej: 50 (vacío = ilimitado)"
          />
          <small className="text-muted">
            Mínimo 5 • Máximo 1000 • Vacío = ilimitado
          </small>
        </Col>
      </Row>
    </div>
  );
}
