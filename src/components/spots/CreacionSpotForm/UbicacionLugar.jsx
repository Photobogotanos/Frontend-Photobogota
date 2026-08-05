import {
  FaMapMarkerAlt,
  FaSearchLocation,
  FaMapPin,
  FaSpinner,
  FaExpandAlt,
} from "react-icons/fa";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

const previewPinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const METODOS = [
  {
    value: "direccion",
    label: "Buscar por dirección escrita",
    icon: <FaSearchLocation />,
    botonTexto: "Buscar coordenadas",
  },
  {
    value: "gps",
    label: "Usar mi ubicación actual (GPS)",
    icon: <FaMapMarkerAlt />,
    botonTexto: "Obtener mi ubicación",
  },
  {
    value: "mapa",
    label: "Elegir con un pin en el mapa",
    icon: <FaMapPin />,
    botonTexto: "Abrir mapa",
  },
];

const UbicacionLugar = ({
  metodo,
  setMetodo,
  direccion,
  onDireccionChange,
  buscando,
  ejecutarMetodo,
  latitud,
  longitud,
  onAbrirMapa,
}) => {
  const metodoActual = METODOS.find((m) => m.value === metodo);

  return (
    <Col xs={12}>
      <label className="spot-label" htmlFor="ubicacion-lugar">
        <FaMapMarkerAlt className="me-2" />
        Dirección / Ubicación <RequiredMark />
      </label>

      {/* Campo de dirección (solo visible cuando el método es "dirección escrita") */}
      {metodo === "direccion" && (
        <input
          id="ubicacion-lugar"
          type="text"
          className="spot-input mb-2"
          placeholder="Ej: Carrera 7 # 32-16, La Candelaria"
          value={direccion}
          onChange={(e) => onDireccionChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ejecutarMetodo();
            }
          }}
        />
      )}

      {/* Select del método */}
      <label className="spot-label" htmlFor="metodo-ubicacion">
        ¿Cómo quieres obtener las coordenadas?
      </label>
      <div className="d-flex gap-2 flex-wrap align-items-stretch">
        <div className="location-method-wrapper">
          <Select
            inputId="metodo-ubicacion"
            classNamePrefix="spot-select"
            options={METODOS}
            value={metodoActual}
            onChange={(opcion) => setMetodo(opcion.value)}
            isSearchable={false}
            formatOptionLabel={(opcion) => (
              <span className="location-method-option">
                <span className="location-method-option-icon">
                  {opcion.icon}
                </span>
                {opcion.label}
              </span>
            )}
          />
        </div>

        {/* Botón de acción según el método */}
        <button
          type="button"
          className="spot-location-btn"
          onClick={ejecutarMetodo}
          disabled={buscando}
          title={metodoActual?.botonTexto}
          aria-label={metodoActual?.botonTexto}
          style={{
            minWidth: "48px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {buscando ? <FaSpinner className="fa-spin" /> : metodoActual?.icon}
        </button>
      </div>

      <small
        className="text-muted d-block mt-1"
        style={{ fontSize: "0.75rem" }}
      >
        {metodo === "direccion" &&
          "Escribe la dirección y pulsa el botón para buscar las coordenadas."}
        {metodo === "gps" &&
          "Se usará la ubicación actual de tu dispositivo."}
        {metodo === "mapa" &&
          "Se abrirá un mapa para que coloques el pin exactamente donde quieras."}
      </small>

      {/* Feedback de coordenadas ya seleccionadas */}
      {latitud && longitud && (
        <small
          className="d-block mt-1"
          style={{
            fontSize: "0.75rem",
            color: "var(--color-primary)",
            fontWeight: 500,
          }}
        >
          ✓ Coordenadas: {Number(latitud).toFixed(5)},{" "}
          {Number(longitud).toFixed(5)}
        </small>
      )}

      {/* Vista previa del mapa con la ubicación obtenida */}
      {latitud && longitud ? (
        <div className="location-map-preview">
          <MapContainer
            key={`${latitud}-${longitud}`}
            center={[Number(latitud), Number(longitud)]}
            zoom={15}
            zoomControl={false}
            dragging={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}
            keyboard={false}
            attributionControl={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
            <Marker
              position={[Number(latitud), Number(longitud)]}
              icon={previewPinIcon}
            />
          </MapContainer>

          <button
            type="button"
            className="location-map-preview-overlay-btn"
            onClick={onAbrirMapa}
          >
            <FaExpandAlt /> Ver más grande
          </button>
        </div>
      ) : (
        <div className="location-map-preview-empty">
          <FaMapMarkerAlt />
          Aún no hay coordenadas seleccionadas
        </div>
      )}
    </Col>
  );
};

export default UbicacionLugar;
