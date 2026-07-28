import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Select from "react-select";

const tipoOptions = [
  { value: "descuento", label: "Descuento %" },
  { value: "regalos", label: "Regalos y obsequios"},
  { value: "pack", label: "Combo" },
  { value: "demostracion", label: "Demostraciones" },
  { value: "gratis", label: "Servicio gratis" },
  { value: "otro", label: "Otro" },
  {}
];

export default function PromoInfoBasica({ state, dispatch }) {
  return (
    <div className="promo-section mb-4">
      <Row className="g-3">
        <Col md={8}>
          <label className="promo-label">
            Título <RequiredMark />
          </label>
          <input
            type="text"
            className="spot-input"
            value={state.titulo}
            onChange={(e) => dispatch({ type: "SET_TITULO", payload: e.target.value })}
            placeholder="Ej: 50% de descuento en sesión de fotos"
            maxLength={100}
          />
        </Col>
        <Col md={4}>
          <label className="spot-label promo-label">Tipo de promoción</label>
          <Select
            className="input-without-focus rounded-pill"
            value={tipoOptions.find((opt) => opt.value === state.tipo) || null}
            onChange={(selected) => {
              if (selected) {
                dispatch({ type: "SET_TIPO", payload: selected.value });
              }
            }}
            placeholder="Seleccionar..."
            classNamePrefix="spot-select"
            options={tipoOptions}
          />
        </Col>
        <Col xs={12}>
          <label className="promo-label">
            Descripción <RequiredMark />
          </label>
          <textarea
            className="spot-textarea"
            rows={4}
            value={state.descripcion}
            onChange={(e) =>
              dispatch({ type: "SET_DESCRIPCION", payload: e.target.value })
            }
            placeholder="Describe los beneficios, condiciones, etc."
          />
        </Col>
      </Row>
    </div>
  );
}
