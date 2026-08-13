import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.css";
import "react-leaflet-cluster/dist/assets/MarkerCluster.Default.css";
import "leaflet.heat";
import "./MapaBogota.css";
import camaraIcon from "@/assets/images/icons/camara.webp";
import localIcon from "@/assets/images/icons/local.webp";
import cuponIcon from "@/assets/images/icons/cupon.webp";
import {
  FaPlus,
  FaMinus,
  FaLocationArrow,
  FaExpand,
  FaCompress,
  FaFire,
  FaMapMarkerAlt,
} from "react-icons/fa";
import SpotPreviewModal from "@/components/spots/SpotPreviewModal/SpotPreviewModal";
import { obtenerSpots } from "@/services/spot.service";
import { toast } from "react-hot-toast";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const createCustomIcon = (esLocal, tienePromocion = false) => {
  const iconUrl = esLocal
    ? tienePromocion
      ? cuponIcon
      : localIcon
    : camaraIcon;
  return new L.Icon({
    iconUrl,
    iconRetinaUrl: iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    shadowSize: [41, 41],
  });
};

const createUserLocationIcon = () => new L.Icon.Default();

const createClusterCustomIcon = (cluster) => {
  const count = cluster.getChildCount();
  let size = "small";
  if (count >= 25) size = "large";
  else if (count >= 10) size = "medium";

  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `marker-cluster marker-cluster-${size} pb-cluster`,
    iconSize: L.point(40, 40, true),
  });
};

function BotonUbicacion() {
  const map = useMap();
  const [buscando, setBuscando] = useState(false);

  useMapEvents({
    locationfound(e) {
      setBuscando(false);
      map.setView(e.latlng, 16);
      L.marker(e.latlng, { icon: createUserLocationIcon() })
        .addTo(map)
        .bindPopup("Estás aquí")
        .openPopup();
    },
    locationerror(e) {
      setBuscando(false);
      if (e.code === 1) {
        toast.error(
          "Activa el permiso de ubicación en el navegador para usar esta función.",
        );
      } else {
        toast.error(
          "No se pudo obtener tu ubicación. Verifica que el GPS esté activado.",
        );
      }
    },
  });

  const buscarUbicacion = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización.");
      return;
    }
    setBuscando(true);
    map.locate({
      setView: true,
      maxZoom: 16,
      enableHighAccuracy: true,
      timeout: 10000,
    });
  };

  return (
    <button
      type="button"
      className={`btn-ubicacion ${buscando ? "buscando" : ""}`}
      onClick={buscarUbicacion}
      disabled={buscando}
      aria-label="Ir a mi ubicación"
    >
      <FaLocationArrow />
    </button>
  );
}

function ControlesZoom() {
  const map = useMap();
  return (
    <div className="zoom-buttons">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Acercar zoom"
      >
        <FaPlus />
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Alejar zoom"
      >
        <FaMinus />
      </button>
    </div>
  );
}

function BotonFullscreen({ wrapperRef }) {
  const [isFs, setIsFs] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFs(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = async () => {
    const el = wrapperRef?.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      toast.error("No se pudo activar pantalla completa.");
    }
  };

  return (
    <button
      type="button"
      className="btn-fullscreen"
      onClick={toggle}
      aria-label={isFs ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      {isFs ? <FaCompress /> : <FaExpand />}
    </button>
  );
}

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

function FitBoundsToSpots({ spots }) {
  const map = useMap();

  useEffect(() => {
    if (!spots?.length) return;

    if (spots.length === 1) {
      map.setView(spots[0].coord, 15, { animate: true });
      return;
    }

    const bounds = L.latLngBounds(spots.map((s) => s.coord));
    if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [48, 48],
        maxZoom: 15,
        animate: true,
      });
    }
  }, [spots, map]);

  return null;
}

/**
 * Capa de calor con leaflet.heat.
 * Intensidad basada en totalResenas (fallback 1).
 */
function HeatmapLayer({ spots, visible }) {
  const map = useMap();

  const heatPoints = useMemo(() => {
    if (!spots?.length) return [];

    const maxResenas = Math.max(
      1,
      ...spots.map((s) => Number(s.totalResenas) || 1),
    );

    return spots.map((s) => {
      const [lat, lng] = s.coord;
      // Intensidad alta de base para que se note con pocos puntos
      const intensidad = Math.min(
        1,
        0.65 + ((Number(s.totalResenas) || 1) / maxResenas) * 0.35,
      );
      return [lat, lng, intensidad];
    });
  }, [spots]);

  useEffect(() => {
    if (!visible || !heatPoints.length) return undefined;

    // radius/blur altos = manchas visibles a nivel ciudad (zoom 11–14)
    // minOpacity evita que se "apaguen" al alejar
    const layer = L.heatLayer(heatPoints, {
      radius: 55,
      blur: 40,
      maxZoom: 14,
      max: 1,
      minOpacity: 0.45,
      gradient: {
        0.15: "#806fbe",
        0.35: "#22c55e",
        0.55: "#eab308",
        0.75: "#f97316",
        1.0: "#ef4444",
      },
    });

    layer.addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, heatPoints, visible]);

  return null;
}

const MapaBogota = ({ filtros = {} }) => {
  const [spots, setSpots] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lugarSeleccionado, setLugarSeleccionado] = useState(null);
  const [wrapperEl, setWrapperEl] = useState(null);
  const [modoCalor, setModoCalor] = useState(false);

  const filtrosSerializados = JSON.stringify(filtros);

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      setCargando(true);

      if (!activo) return;

      const resultado = await obtenerSpots(filtros);

      if (!activo || !resultado) return;

      if (resultado.exitoso) {
        const spotsValidos = resultado.datos.filter((spot) => {
          const lat = parseFloat(spot.latitud);
          const lng = parseFloat(spot.longitud);

          return (
            !isNaN(lat) &&
            !isNaN(lng) &&
            lat >= -90 &&
            lat <= 90 &&
            lng >= -180 &&
            lng <= 180
          );
        });

        const spotsFormateados = spotsValidos.map((spot) => ({
          id: spot.id,
          nombre: spot.nombre || "Sin nombre",
          direccion: spot.direccion || "",
          coord: [parseFloat(spot.latitud), parseFloat(spot.longitud)],
          categoria: spot.categoria,
          localidad: spot.localidad,
          descripcion: spot.descripcion,
          rating: spot.rating,
          totalResenas: spot.totalResenas,
          imagen: spot.imagen || spot.imagenes?.[0],
          recomendacion: spot.recomendacion,
          tipsFoto: spot.tipsFoto,
          creadorId: spot.creadorId,
          rol: spot.rol || spot.creador?.rol,
          tienePromocion: Boolean(spot.tienePromocion),
        }));

        setSpots(spotsFormateados);
        setUsandoMock(resultado.esMock || false);

        if (spotsValidos.length !== resultado.datos.length) {
          toast.error(
            `${resultado.datos.length - spotsValidos.length} spots no se pudieron mostrar por coordenadas inválidas`,
          );
        }
      } else {
        toast.error(resultado.mensaje ?? "Error al cargar el mapa.");
        setSpots([]);
        setUsandoMock(false);
      }

      setCargando(false);
    };

    cargar();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtrosSerializados]);

  const handleMarkerClick = (lugar) => {
    setLugarSeleccionado(lugar);
    setShowModal(true);
  };

  return (
    <>
      <div className="mapa-wrapper" ref={setWrapperEl}>
        {cargando && (
          <div className="mapa-cargando">
            <span>Cargando spots...</span>
          </div>
        )}

        <button
          type="button"
          className={`btn-heatmap ${modoCalor ? "activo" : ""}`}
          onClick={() => setModoCalor((v) => !v)}
          aria-pressed={modoCalor}
          aria-label={
            modoCalor ? "Mostrar marcadores" : "Mostrar mapa de calor"
          }
          title={modoCalor ? "Vista marcadores" : "Mapa de calor"}
        >
          {modoCalor ? <FaMapMarkerAlt /> : <FaFire />}
          <span className="btn-heatmap-label">
            {modoCalor ? "Marcadores" : "Calor"}
          </span>
        </button>

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
          <FitBoundsToSpots spots={spots} />
          <BotonUbicacion />
          <ControlesZoom />
          {wrapperEl && <BotonFullscreen wrapperRef={{ current: wrapperEl }} />}

          <HeatmapLayer spots={spots} visible={modoCalor} />

          {!modoCalor && (
            <MarkerClusterGroup
              chunkedLoading
              showCoverageOnHover={false}
              maxClusterRadius={55}
              spiderfyOnMaxZoom
              disableClusteringAtZoom={17}
              iconCreateFunction={createClusterCustomIcon}
            >
              {spots.map((lugar) => {
                if (!lugar.coord || lugar.coord.length !== 2) return null;
                const esLocal = lugar.rol?.toUpperCase() === "SOCIO";

                return (
                  <Marker
                    key={lugar.id}
                    position={lugar.coord}
                    icon={createCustomIcon(esLocal, lugar.tienePromocion)}
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
                );
              })}
            </MarkerClusterGroup>
          )}
        </MapContainer>
      </div>

      <SpotPreviewModal
        show={showModal}
        onHide={() => setShowModal(false)}
        lugar={lugarSeleccionado}
        usandoMock={usandoMock}
      />
    </>
  );
};

export default MapaBogota;
