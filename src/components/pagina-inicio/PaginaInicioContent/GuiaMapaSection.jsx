import { LazyMotion, m, domAnimation } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSpots } from "@/mocks/spots.helpers";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function GuiaMapaSection({ onMarkerClick }) {
  const spotsMapa = getSpots();

  const spotsFormateados = [];
  for (const spot of spotsMapa) {
    const lat = parseFloat(spot.latitud);
    const lng = parseFloat(spot.longitud);
    if (isNaN(lat) || isNaN(lng)) continue;
    spotsFormateados.push({
      ...spot,
      coord: [lat, lng],
    });
  }

  return (
    <LazyMotion features={domAnimation}>
      <section id="mapa-section" className="guia-container pb-5" aria-labelledby="guia-title">
        <div className="guia-text">
          <m.h2
            id="guia-title"
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="guia-heading"
          >
            Descubre Bogotá con nuestro mapa interactivo
          </m.h2>

          <m.div
            initial={{ x: -40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12, duration: 0.55 }}
          >
            <h3 className="guia-sub">Mapa Interactivo (Versión Demostrativa)</h3>
            <p>
              Explora Bogotá con nuestro mapa lleno de spots marcados por la comunidad.{" "}
              <strong>Haz clic en los marcadores para ver más información.</strong>
            </p>

            <h3 className="guia-sub">Funcionalidades completas</h3>
            <p>
              Al registrarte podrás: añadir nuevos spots, guardar tus favoritos, ver fotos
              detalladas, leer reseñas completas y acceder a información exclusiva.
            </p>

            <h3 className="guia-sub">Todo lo que necesitas saber</h3>
            <p>Fotos reales, tips de luz, horarios ideales y cómo llegar. Sin sorpresas.</p>

            <div className="demo-note">
              <FaLock className="demo-note-icon" aria-hidden="true" />
              <div>
                <strong>Nota:</strong> Esta es una versión demostrativa. Regístrate para
                acceder a todas las funcionalidades.
              </div>
            </div>
          </m.div>
        </div>

        <m.div
          initial={{ x: 40, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mapa-demo-container"
        >
          <div className="mapa-demo-overlay">
            <div className="mapa-demo-content">
              <h3 className="mapa-demo-title">Mapa Interactivo de PhotoBogotá</h3>
              <p className="mapa-demo-desc">
                Haz clic en los marcadores para ver información básica
              </p>

              <div className="mapa-demo-wrapper">
                <MapContainer
                  center={[4.6529, -74.075]}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="mapa-demo"
                  zoomControl={false}
                  maxBounds={[
                    [4.2, -74.6],
                    [5.1, -73.6],
                  ]}
                  minZoom={11}
                  maxZoom={16}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                  />

                  {spotsFormateados.map((spot) => (
                    <Marker
                      key={spot.id}
                      position={spot.coord}
                      eventHandlers={{
                        click: () => onMarkerClick?.(spot),
                      }}
                    >
                      <Popup>
                        <div className="popup-demo">
                          <strong>{spot.nombre}</strong>
                          <p className="mb-1">
                            <small>{spot.categoria}</small>
                          </p>
                          <p className="mb-2">{spot.direccion}</p>
                          <div className="demo-lock-info">
                            <FaLock size={12} className="me-1" aria-hidden="true" />
                            <small>Inicia sesión para ver fotos y reseñas</small>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                <div className="mapa-demo-legend">
                  <div className="legend-item">
                    <div className="legend-marker" />
                    <span>Lugar fotográfico</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-lock">
                      <FaLock size={10} aria-hidden="true" />
                    </div>
                    <span>Contenido exclusivo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </section>
    </LazyMotion>
  );
}
