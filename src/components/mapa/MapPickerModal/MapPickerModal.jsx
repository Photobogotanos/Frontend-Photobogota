import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { FaCheck, FaTimes } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// Icono personalizado del pin
const pinIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Componente interno: permite hacer clic en el mapa y arrastrar el marcador
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={pinIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    />
  ) : null;
}

// Fuerza a Leaflet a recalcular el tamaño cuando el modal se abre
function MapResizer({ show }) {
  const map = useMap();
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }
  }, [show, map]);
  return null;
}

export default function MapPickerModal({
  show,
  onHide,
  onConfirm,
  initialPosition = [4.6529, -74.075], // Centro de Bogotá
}) {
  const [position, setPosition] = useState(initialPosition);

  // Cuando se abre el modal, usamos la posición actual si existe
  useEffect(() => {
    if (show && initialPosition) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
      setPosition(initialPosition);
    }
  }, [show, initialPosition]);

  const handleConfirm = () => {
    if (position) {
      onConfirm(position[0], position[1]);
      onHide();
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      className="map-picker-modal"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title style={{ fontSize: "1.15rem", fontWeight: 600 }}>
          Elige la ubicación en el mapa
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-0">
        <div style={{ height: "420px", width: "100%", position: "relative" }}>
          <MapContainer
            center={position}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            <LocationMarker position={position} setPosition={setPosition} />
            <MapResizer show={show} />
          </MapContainer>
        </div>

        <div className="p-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <small className="text-muted">
            Haz clic en el mapa o arrastra el pin ·{" "}
            {position
              ? `${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
              : "—"}
          </small>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="spot-btn-preview"
              onClick={onHide}
              style={{ padding: "8px 18px" }}
            >
              <FaTimes className="me-1" /> Cancelar
            </button>
            <button
              type="button"
              className="spot-btn-publish"
              onClick={handleConfirm}
              style={{ padding: "8px 18px" }}
            >
              <FaCheck className="me-1" /> Confirmar
            </button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
