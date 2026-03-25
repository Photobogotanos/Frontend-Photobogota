import { LazyMotion, m, domAnimation } from "framer-motion";
import { FaLock } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getSpots } from "@/mocks/spots.helpers";

// Configuración de iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const spotsMapa = getSpots();

export default function GuiaMapaSection({ onMarkerClick }) {
    return (
        <LazyMotion features={domAnimation}>
            <div className="guia-container pb-5">

                {/* ── Texto de guía ── */}
                <div className="guia-text">
                    <m.h3
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Descubre Bogotá con nuestro mapa interactivo
                    </m.h3>

                    <m.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
                            Mapa Interactivo (Versión Demostrativa)
                        </h4>
                        <p>
                            Explora Bogotá con nuestro mapa lleno de spots marcados por la comunidad.{" "}
                            <strong>Haz clic en los marcadores para ver más información.</strong>
                        </p>

                        <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
                            Funcionalidades completas
                        </h4>
                        <p>
                            Al registrarte podrás: añadir nuevos spots, guardar tus favoritos,
                            ver fotos detalladas, leer reseñas completas y acceder a información exclusiva.
                        </p>

                        <h4 style={{ fontWeight: "800", margin: "2.5rem 0 1rem" }}>
                            Todo lo que necesitas saber
                        </h4>
                        <p>Fotos reales, tips de luz, horarios ideales y cómo llegar. Sin sorpresas.</p>

                        <div className="demo-note mt-4 p-3 rounded">
                            <FaLock className="me-2" />
                            <strong>Nota:</strong> Esta es una versión demostrativa. Regístrate para acceder
                            a todas las funcionalidades.
                        </div>
                    </m.div>
                </div>

                {/* ── Mapa ── */}
                <m.div
                    initial={{ x: 50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="mapa-demo-container"
                >
                    <div className="mapa-demo-overlay">
                        <div className="mapa-demo-content">
                            <h5>Mapa Interactivo de PhotoBogotá</h5>
                            <p className="text-muted mb-3">
                                Haz clic en los marcadores para ver información básica
                            </p>

                            <div className="mapa-demo-wrapper">
                                <MapContainer
                                    center={[4.6529, -74.075]}
                                    zoom={13}
                                    scrollWheelZoom={true}
                                    className="mapa-demo"
                                    zoomControl={false}
                                    maxBounds={[[4.2, -74.6], [5.1, -73.6]]}
                                    minZoom={11}
                                    maxZoom={16}
                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                                    />

                                    {/* Un marcador por cada spot del mock */}
                                    {spotsMapa.map((spot) => (
                                        <Marker
                                            key={spot.id}
                                            position={spot.coord}
                                            eventHandlers={{ click: onMarkerClick }}
                                        >
                                            <Popup>
                                                <div className="popup-demo">
                                                    <strong>{spot.nombre}</strong>
                                                    <p className="mb-1"><small>{spot.categoria}</small></p>
                                                    <p className="mb-2">{spot.direccion}</p>
                                                    <div className="demo-lock-info">
                                                        <FaLock size={12} className="me-1" />
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
                                        <div className="legend-lock"><FaLock size={10} /></div>
                                        <span>Contenido exclusivo para usuarios</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </m.div>

            </div>
        </LazyMotion>
    );
}