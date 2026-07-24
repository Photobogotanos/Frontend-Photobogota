import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import { MdDateRange } from "react-icons/md";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function PromoDisponibilidad({
  fechaInicio,
  fechaFin,
  limiteUsos,
  onFechaInicioChange,
  onFechaFinChange,
  onLimiteUsosChange,
}) {
  return (
    <Row className="g-3 mb-3">
      <Col xs={12} md={6}>
        <label className="promo-label" htmlFor="fecha-inicio">
          Fecha de inicio <RequiredMark />
        </label>
        <Flatpickr
          id="fecha-inicio"
          className="form-control"
          placeholder="Seleccionar fecha"
          value={fechaInicio}
          onChange={onFechaInicioChange}
          options={{
            dateFormat: "Y-m-d",
            locale: "es",
            minDate: "today",
          }}
        />
      </Col>
      <Col xs={12} md={6}>
        <label className="promo-label" htmlFor="fecha-fin">
          Fecha de fin <RequiredMark />
        </label>
        <Flatpickr
          id="fecha-fin"
          className="form-control"
          placeholder="Seleccionar fecha"
          value={fechaFin}
          onChange={onFechaFinChange}
          options={{
            dateFormat: "Y-m-d",
            locale: "es",
            minDate: "today",
          }}
        />
      </Col>
      <Col md={6}>
          <label className="promo-label mb-2">
            Límite de códigos / usos
          </label>
          <input
            type="number"
            min="5"
            max="1000"
            step="1"
            className="form-control"
            value={limiteUsos}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "" || (/^\d+$/.test(val) && +val >= 5 && +val <= 1000)) {
                onLimiteUsosChange(val);
              }
            }}
            placeholder="Ej: 50 (vacío = ilimitado)"
          />
          <small className="text-muted">
            Mínimo 5 • Máximo 1000 • Dejar vacío para ilimitado
          </small>
        </Col>
    </Row>
  );
}
