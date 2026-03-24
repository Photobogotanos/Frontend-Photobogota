import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

const categorias = [
  { value: "naturaleza", label: "Naturaleza" },
  { value: "urbano", label: "Urbano" },
  { value: "historico", label: "Histórico" },
  { value: "gastronomia", label: "Gastronomía" },
];

const localidades = [
  { value: "chapinero", label: "Chapinero" },
  { value: "usaquen", label: "Usaquén" },
  { value: "suba", label: "Suba" },
  { value: "kennedy", label: "Kennedy" },
];

export default function SpotCategorizacion({ categoria, localidad, onCategoriaChange, onLocalidadChange }) {
  return (
    <Row className="g-3 mb-3">
      <Col xs={12} md={6}>
        <label className="spot-label" htmlFor="categoria-spot">
          Categoría <RequiredMark />
        </label>
        <Select
          inputId="categoria-spot"
          options={categorias}
          classNamePrefix="spot-select"
          value={categoria}
          onChange={onCategoriaChange}
          placeholder="Seleccionar..."
        />
      </Col>
      <Col xs={12} md={6}>
        <label className="spot-label" htmlFor="localidad-spot">
          Localidad <RequiredMark />
        </label>
        <Select
          inputId="localidad-spot"
          options={localidades}
          classNamePrefix="spot-select"
          value={localidad}
          onChange={onLocalidadChange}
          placeholder="Seleccionar..."
        />
      </Col>
    </Row>
  );
}
