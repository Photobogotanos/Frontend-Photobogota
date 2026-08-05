import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import Swal from "sweetalert2";
import MapPickerModal from "@/components/mapa/MapPickerModal/MapPickerModal";
import UbicacionLugar from "./UbicacionLugar";

export default function SpotInformacionBasica({
  nombreLugar,
  direccion,
  latitud,
  longitud,
  onNombreChange,
  onDireccionChange,
  onLatitudChange,
  onLongitudChange,
}) {
  const [metodo, setMetodo] = useState("direccion");
  const [buscando, setBuscando] = useState(false);
  const [showMapPicker, setShowMapPicker] = useState(false);

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
      ({ coords }) => {
        onLatitudChange(coords.latitude);
        onLongitudChange(coords.longitude);

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
  const handleConfirmPin = (lat, lng) => {
    onLatitudChange(lat);
    onLongitudChange(lng);

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
        <UbicacionLugar
          metodo={metodo}
          setMetodo={setMetodo}
          direccion={direccion}
          onDireccionChange={onDireccionChange}
          buscando={buscando}
          ejecutarMetodo={ejecutarMetodo}
          latitud={latitud}
          longitud={longitud}
          onAbrirMapa={() => setShowMapPicker(true)}
        />
      </Row>

      {/* Modal del mapa con pin */}
      {showMapPicker && (
        <MapPickerModal
          onHide={() => setShowMapPicker(false)}
          onConfirm={handleConfirmPin}
          initialPosition={initialMapPosition}
        />
      )}
    </>
  );
}
