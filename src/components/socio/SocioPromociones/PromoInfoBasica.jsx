import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function PromoInfoBasica({ state, dispatch }) {
  return (
    <div className="promo-section mb-4">
      <h5 className="section-title">Información Básica</h5>
      <Row className="g-3">
        <Col md={8}>
          <label className="promo-label">Título <RequiredMark /></label>
          <input
            type="text"
            className="form-control"
            value={state.titulo}
            onChange={(e) => dispatch({ type: "SET_TITULO", payload: e.target.value })}
            placeholder="Ej: 50% de descuento en sesión de fotos"
            maxLength={100}
          />
        </Col>
        <Col md={4}>
          <label className="promo-label">Tipo de promoción</label>
          <select
            className="form-control"
            value={state.tipo}
            onChange={(e) => dispatch({ type: "SET_TIPO", payload: e.target.value })}
          >
            <option value="descuento">Descuento %</option>
            <option value="pack">Pack / Combo</option>
            <option value="gratis">Servicio gratis</option>
            <option value="otro">Otro</option>
          </select>
        </Col>
        <Col xs={12}>
          <label className="promo-label">Descripción <RequiredMark /></label>
          <textarea
            className="form-control"
            rows={4}
            value={state.descripcion}
            onChange={(e) => dispatch({ type: "SET_DESCRIPCION", payload: e.target.value })}
            placeholder="Describe los beneficios, condiciones, etc."
          />
        </Col>
      </Row>
    </div>
  );
}