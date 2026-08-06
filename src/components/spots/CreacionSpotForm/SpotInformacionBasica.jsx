import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaSearchLocation,
  FaMapPin,
  FaSpinner,
  FaExpandAlt,
} from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Swal from "sweetalert2";
import MapPickerModal from "@/components/mapa/MapPickerModal/MapPickerModal";

// Icono del pin usado en la vista previa (mismo estilo que el modal de selección)
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

export default function SpotInformacionBasica({
  nombreLugar,
  direccion,
  latitud,
  longitud,
  onNombreChange,
  onDireccionChange,
  onLatitudChange,
  onLongitudChange,
  esSocio
}) {
  const [metodo, setMetodo] = useState("direccion");
  const [buscando, setBuscando] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

  const metodoActual = METODOS.find((m) => m.value === metodo);

  // ─────────────────────────────────────────────
  // Geocodificación inversa (coordenadas -> dirección)
  // ─────────────────────────────────────────────
  const acortarDireccion = (data) => {
    const a = data?.address;
    if (!a) return data?.display_name || "";

    const partes = [];

    if (a.road) {
      partes.push(
        `${a.house_number ? `${a.house_number} ` : ""}${a.road}`.trim(),
      );
    }

    if (a.neighbourhood) partes.push(a.neighbourhood);
    else if (a.suburb) partes.push(a.suburb);
    else if (a.city_district) partes.push(a.city_district);

    if (a.city || a.town || a.village || a.municipality)
      partes.push(a.city || a.town || a.village || a.municipality);

    return partes.join(", ");
  };

  const obtenerDireccionDesdeCoordenadas = async (lat, lng) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`;
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Photobogota/1.0 (photobogota123@gmail.com)",
        },
      });
      if (!response.ok) throw new Error("Error en la respuesta del servidor");
      const data = await response.json();
      return acortarDireccion(data);
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "";
    }
  };

  // ─────────────────────────────────────────────
  // 1. Geocodificar dirección escrita
  // ─────────────────────────────────────────────
  const obtenerCoordenadasDesdeDireccion = async () => {
    if (!direccion?.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Dirección vacía",
        text: "Escribe una dirección o referencia primero.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    setBuscando(true);

    try {
      const query = encodeURIComponent(`${direccion.trim()}, Bogotá, Colombia`);
      const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=co&addressdetails=1`;

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Photobogota/1.0 (photobogota123@gmail.com)",
        },
      });

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();

      if (!data || data.length === 0) {
        Swal.fire({
          icon: "error",
          title: "No se encontró la dirección",
          text: "Prueba con más detalles (calle, número, barrio o localidad).",
          confirmButtonColor: "#806fbe",
        });
        return;
      }

      const { lat, lon, display_name } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);

      onLatitudChange(latNum);
      onLongitudChange(lonNum);

      Swal.fire({
        icon: "success",
        title: "¡Coordenadas encontradas!",
        html: `
          <p style="margin:0 0 8px; font-size:0.9rem">${display_name}</p>
          <small>Lat: ${latNum.toFixed(6)} · Lng: ${lonNum.toFixed(6)}</small>
        `,
        timer: 2800,
        showConfirmButton: false,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error geocoding:", error);
      Swal.fire({
        icon: "error",
        title: "Error al buscar",
        text: "No se pudo conectar con el servicio de mapas. Intenta de nuevo.",
        confirmButtonColor: "#806fbe",
      });
    } finally {
      setBuscando(false);
    }
  };

  // ─────────────────────────────────────────────
  // 2. GPS del dispositivo
  // ─────────────────────────────────────────────
  const usarUbicacionActual = () => {
    if (!navigator.geolocation) {
      Swal.fire({
        icon: "error",
        title: "Geolocalización no disponible",
        text: "Tu navegador no soporta geolocalización.",
        confirmButtonColor: "#806fbe",
      });
      return;
    }

    setBuscando(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        onLatitudChange(coords.latitude);
        onLongitudChange(coords.longitude);

        const direccionObtenida = await obtenerDireccionDesdeCoordenadas(
          coords.latitude,
          coords.longitude,
        );
        if (direccionObtenida) onDireccionChange(direccionObtenida);

        Swal.fire({
          icon: "success",
          title: "Ubicación obtenida",
          html: `
            <small>Lat: ${coords.latitude.toFixed(6)} · Lng: ${coords.longitude.toFixed(6)}</small>
            <br/><small style="color:#666">Precisión: ±${Math.round(coords.accuracy)} m</small>
          `,
          timer: 2500,
          showConfirmButton: false,
        });
        setBuscando(false);
      },
      (error) => {
        setBuscando(false);

        let titulo = "No se pudo obtener tu ubicación";
        let texto = "Intenta de nuevo o elige otra opción.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            titulo = "Permiso denegado";
            texto =
              "Activa los permisos de ubicación en tu navegador o dispositivo.";
            break;
          case error.POSITION_UNAVAILABLE:
            titulo = "Ubicación no disponible";
            texto =
              "No se pudo determinar tu posición. Revisa el GPS o la conexión.";
            break;
          case error.TIMEOUT:
            titulo = "Tiempo agotado";
            texto =
              "La búsqueda tardó demasiado. Intenta de nuevo o usa el mapa.";
            break;
        }

        Swal.fire({
          icon: "error",
          title: titulo,
          text: texto,
          confirmButtonColor: "#806fbe",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  // ─────────────────────────────────────────────
  // 3. Confirmar pin del mapa
  // ─────────────────────────────────────────────
  const handleConfirmPin = async (lat, lng) => {
    onLatitudChange(lat);
    onLongitudChange(lng);

    const direccionObtenida = await obtenerDireccionDesdeCoordenadas(lat, lng);
    if (direccionObtenida) onDireccionChange(direccionObtenida);

    Swal.fire({
      icon: "success",
      title: "Ubicación seleccionada",
      html: `<small>Lat: ${lat.toFixed(6)} · Lng: ${lng.toFixed(6)}</small>`,
      timer: 2200,
      showConfirmButton: false,
    });
  };

  // Ejecutar la acción según el método seleccionado
  const ejecutarMetodo = () => {
    if (metodo === "direccion") obtenerCoordenadasDesdeDireccion();
    else if (metodo === "gps") usarUbicacionActual();
    else if (metodo === "mapa") setShowMapPicker(true);
  };

  const initialMapPosition =
    latitud && longitud ? [latitud, longitud] : [4.6529, -74.075];

  return (
    <>
      <Row className="g-3 mb-2 mt-1">
        <Col xs={12}>
          <label className="spot-label" htmlFor="nombre-lugar">
            {esSocio ? "Nombre de la publicación" : "Nombre del establecimiento"} <RequiredMark />
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
                  obtenerCoordenadasDesdeDireccion();
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
              {buscando ? (
                <FaSpinner className="fa-spin" />
              ) : (
                metodoActual?.icon
              )}
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
                onClick={() => setShowMapPicker(true)}
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
      </Row>

      {/* Modal del mapa con pin */}
      <MapPickerModal
        show={showMapPicker}
        onHide={() => setShowMapPicker(false)}
        onConfirm={handleConfirmPin}
        initialPosition={initialMapPosition}
      />
    </>
  );
}
