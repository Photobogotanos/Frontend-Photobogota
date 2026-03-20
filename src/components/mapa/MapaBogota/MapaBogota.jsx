import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaBogota.css";
import camaraIcon from "@/assets/images/icons/camara.jpg";
import { FaPlus, FaMinus, FaLocationArrow } from "react-icons/fa";
import SpotPreviewModal from "@/components/spots/SpotPreviewModal/SpotPreviewModal";
import { getSpots } from "@/mocks/spots.helpers";

// === CONFIGURACIÓN ICONO DEFAULT ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// === ÍCONO PERSONALIZADO ===
const createCustomIcon = () => {
  return new L.Icon({
    iconUrl: camaraIcon,
    iconRetinaUrl: camaraIcon,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

// === BOTÓN DE UBICACIÓN ===
function BotonUbicacion() {
  const map = useMap();

  const handleClick = () => {
    map.locate({ setView: true, maxZoom: 16 });
  };

  useMapEvents({
    locationfound(e) {
      L.marker(e.latlng).addTo(map).bindPopup("Estás aquí").openPopup();
    },
  });

  return (
    <button className="btn-ubicacion" onClick={handleClick}>
      <FaLocationArrow />
    </button>
  );
}

// === BOTONES DE ZOOM MODERNOS ===
function ControlesZoom() {
  const map = useMap();

  return (
    <div className="zoom-buttons">
      <button onClick={() => map.zoomIn()}>
        <FaPlus />
      </button>
      <button onClick={() => map.zoomOut()}>
        <FaMinus />
      </button>
    </div>
  );
}

// === RESTRICCIÓN DEL MAPA A BOGOTÁ ===
function MapBounds() {
  const map = useMapEvents({
    drag: () => {
      const bounds = L.latLngBounds(L.latLng(4.3, -74.4), L.latLng(5.0, -73.7));
      if (!bounds.contains(map.getCenter())) {
        map.panTo([4.65, -74.08], { animate: true });
      }
    },
  });

  map.setMaxBounds([
    [4.2, -74.6],
    [5.1, -73.6],
  ]);

  map.setMinZoom(10);
  map.setMaxZoom(18);

  return null;
}

const MapaBogota = () => {
  const [showModal, setShowModal] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    setSpots(getSpots());
  }, []);

  const handleMarkerClick = (lugar) => {
    setLugarSeleccionado(lugar);
    setShowModal(true);
  };

  return (
    <>
      <div className="mapa-wrapper">
        <MapContainer
          center={[4.6529, -74.075]}
          zoom={12}
          scrollWheelZoom={false}
          className="mapa-bogota"
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          <MapBounds />
          <BotonUbicacion />
          <ControlesZoom />

          {spots.map((lugar) => (
            <Marker
              key={lugar.id}
              position={lugar.coord}
              icon={createCustomIcon()}
              eventHandlers={{
                click: () => handleMarkerClick(lugar),
              }}
            >
              <Popup>
                <strong>{lugar.nombre}</strong>
                <br />
                {lugar.direccion}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <SpotPreviewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        lugar={lugarSeleccionado}
      />
    </>
  );
};

export default MapaBogota;
