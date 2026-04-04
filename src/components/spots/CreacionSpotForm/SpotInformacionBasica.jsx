import { FaMapMarkerAlt } from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function SpotInformacionBasica({
  nombreLugar,
  direccion,
  onNombreChange,
  onDireccionChange,
  onLatitudChange,
  onLongitudChange,
}) {
  const usarUbicacionActual = () => {
    if (!navigator.geolocation) return alert("Geolocalización no disponible");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        onDireccionChange(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
        onLatitudChange(coords.latitude);
        onLongitudChange(coords.longitude);
      },
      () => alert("No se pudo obtener tu ubicación")
    );
  };

  return (
    <>
      <Row className="g-3 mb-2 mt-1">
        <Col xs={12}>
          <label className="spot-label" htmlFor="nombre-lugar">
            Nombre del lugar <RequiredMark />
          </label>
          <input
            id="nombre-lugar"
            type="text"
            className="spot-input"
            placeholder="Ej: Mirador de Monserrate"
            value={nombreLugar}
            onChange={(e) => onNombreChange(e.target.value)}
          />
        </Col>
      </Row>

      <Row className="g-3 mb-2">
        <Col xs={12}>
          <label className="spot-label" htmlFor="ubicacion-lugar">
            <FaMapMarkerAlt className="me-2" />
            Ubicación <RequiredMark />
          </label>
          <div className="d-flex gap-2">
            <input
              id="ubicacion-lugar"
              type="text"
              className="spot-input"
              placeholder="Dirección o referencia"
              value={direccion}
              onChange={(e) => onDireccionChange(e.target.value)}
            />
            <button
              type="button"
              className="spot-location-btn"
              onClick={usarUbicacionActual}
              aria-label="Obtener ubicación actual"
            >
              <FaMapMarkerAlt />
            </button>
          </div>
        </Col>
      </Row>
    </>
  );
}