import { useState, useEffect } from "react";
import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import { getCategoriasActivas } from "@/api/categoriaApi";
import { getLocalidadesActivas } from "@/api/localidadApi";

export default function SpotCategorizacion({ categoria, localidad, onCategoriaChange, onLocalidadChange }) {
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [localidadOptions, setLocalidadOptions] = useState([]);

  useEffect(() => {
    getCategoriasActivas().then(setCategoriaOptions);
    getLocalidadesActivas().then(setLocalidadOptions);
  }, []);

  return (
    <Row className="g-3 mb-3">
      <Col xs={12} md={6}>
        <label className="spot-label" htmlFor="categoria-spot">
          Categoría <RequiredMark />
        </label>
        <Select
          inputId="categoria-spot"
          options={categoriaOptions}
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
          options={localidadOptions}
          classNamePrefix="spot-select"
          value={localidad}
          onChange={onLocalidadChange}
          placeholder="Seleccionar..."
        />
      </Col>
    </Row>
  );
}
