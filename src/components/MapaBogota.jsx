import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapaBogota.css";
import camaraIcon from "../assets/images/icons/camara.jpg";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Ícono personalizado usando la imagen importada
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

// Componente para restringir el mapa a Bogotá
function MapBounds() {
  const map = useMapEvents({
    drag: () => {
      const bounds = L.latLngBounds(
        L.latLng(4.3, -74.4),   // suroeste de Bogotá ampliado
        L.latLng(5.0, -73.7)    // noreste
      );
      if (!bounds.contains(map.getCenter())) {
        map.panTo([4.65, -74.08], { animate: true });
      }
    }
  });

  // Establecer límites máximos
  map.setMaxBounds([
    [4.2, -74.6],
    [5.1, -73.6]
  ]);
  map.setMinZoom(10);
  map.setMaxZoom(18);

  return null;
}

const puntos = [
  { id: 1, nombre: "Punto Usaquén", coord: [4.6921, -74.0300] },
  { id: 2, nombre: "Punto Chapinero", coord: [4.6486, -74.0570] },
  { id: 3, nombre: "Punto Kennedy", coord: [4.6296, -74.1469] },
  { id: 4, nombre: "Punto Engativá", coord: [4.6781, -74.1156] },
  { id: 5, nombre: "Centro Internacional", coord: [4.6120, -74.0658] },
];

const MapaBogota = () => {
  return (
    <div className="mapa-wrapper">
      <MapContainer
        center={[4.6529, -74.0750]}
        zoom={12}
        scrollWheelZoom={true}
        className="mapa-bogota"
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapBounds />

        {puntos.map((p) => (
          <Marker key={p.id} position={p.coord} icon={createCustomIcon()}>
            <Popup>
              <strong>{p.nombre}</strong><br />
              Localidad de Bogotá
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapaBogota;