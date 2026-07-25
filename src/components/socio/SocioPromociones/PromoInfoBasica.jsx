import { FaStore } from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

function TextAreaField({ label, htmlFor, required, icon, value, onChange, rows, placeholder }) {
  return (
    <div className="mb-3">
      <label className="promo-label" htmlFor={htmlFor}>
        {icon && <span className="me-2">{icon}</span>}
        {label}
        {required && <RequiredMark />}
      </label>
      <textarea
        id={htmlFor}
        className="promo-textarea"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function PromoInfoBasica({
    tituloPromo,
    descripcionPromo,
    localPromo,
}){
  const usarUbicacionActual = () => {
    if (!navigator.geolocation) return alert("Geolocalización no disponible");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => onDireccionChange(
        `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
      ),
      () => alert("No se pudo obtener tu ubicación") 
    );
  };

  return(
    <>
      {/* Nombre */ }
      <Row className="g-3 mb-2 mt-1">
        <Col xs={12}>
          <label className="promo-label" htmlFor="titulo-promo">
            Titulo de la promoción <RequiredMark/>
          </label>
          <input
            id="nombre-lugar"
            type="text"
            className="promo-input"
            placeholder="Ej: Mirador de Monserrate"
            value={tituloPromo}
            onChange={(e) => onNombreChange(e.target.value)}
          />
        </Col>
      </Row> 

      {/* Ubicación */}
      <Row className="g-3 mb-2">
        <Col xs={12}>
          <label className="promo-label" htmlFor="ubicacion-lugar">
            <FaStore className="me-2" />
            Local para aplicar promoción  <RequiredMark />
          </label>
          <div className="d-flex gap-2">
            <input
              id="ubicacion-lugar"
              type="text"
              className="promo-input"
              placeholder="Dirección o referencia"
              value={localPromo}
              onChange={(e) => onDireccionChange(e.target.value)}
            />
              <FaStore />
          </div>
        </Col>
      </Row>

      <Row>
        <TextAreaField
          rows={2}
          placeholder="Describe tu promoción"
          value={descripcionPromo}
          onChange={(e) => onDescripcionChange(e.target.value)}
          label="Descripción de la promoción"
          required
        />
      </Row>
    </>
  )
}