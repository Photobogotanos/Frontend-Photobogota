import Select from "react-select";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

const categorias = [
  { value: "RESTAURANTE", label: "Restaurante" },
  { value: "CAFETERIA", label: "Cafetería" },
  { value: "PARQUE", label: "Parque" },
  { value: "MUSEO", label: "Museo" },
  { value: "MONUMENTO", label: "Monumento" },
  { value: "CENTRO_COMERCIAL", label: "Centro Comercial" },
  { value: "TEATRO", label: "Teatro" },
  { value: "OTRO", label: "Otro" }
];


const localidades = [
  { value: "USAQUEN", label: "Usaquén" },
  { value: "CHAPINERO", label: "Chapinero" },
  { value: "SANTA_FE", label: "Santa Fe" },
  { value: "SAN_CRISTOBAL", label: "San Cristóbal" },
  { value: "USME", label: "Usme" },
  { value: "TUNJUELITO", label: "Tunjuelito" },
  { value: "BOSA", label: "Bosa" },
  { value: "KENNEDY", label: "Kennedy" },
  { value: "FONTIBON", label: "Fontibón" },
  { value: "ENGATIVA", label: "Engativá" },
  { value: "SUBA", label: "Subá" },
  { value: "BARRIOS_UNIDOS", label: "Barrios Unidos" },
  { value: "TEUSAQUILLO", label: "Teusaquillo" },
  { value: "LOS_MARTIRES", label: "Los Mártires" },
  { value: "ANTONIO_NARINO", label: "Antonio Nariño" },
  { value: "PUENTE_ARANDA", label: "Puente Aranda" },
  { value: "LA_CANDELARIA", label: "La Candelaria" },
  { value: "RAFAEL_URIBE", label: "Rafael Uribe" },
  { value: "CIUDAD_BOLIVAR", label: "Ciudad Bolívar" },
  { value: "SUMAPAZ", label: "Sumapaz" }
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
