import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  FaMapMarkerAlt, FaRegEdit, FaShieldAlt, FaStore,
  FaBookmark, FaFlag, FaHistory, FaUsers, FaBan
} from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";
import { getSpots } from "@/mocks/spots.helpers";

// ─── TRANSFORMACIONES ────────────────────────────────────────────────────────

const transformarSpotParaCard = (spot) => ({
  id: spot.id,
  title: spot.nombre,
  tags: [spot.categoria],
  rating: spot.rating.toString(),
  likes: spot.totalResenas.toString(),
  img: spot.imagen,
});

const spotsDatos = getSpots().map(transformarSpotParaCard);

const resenasEjemplo = [
  { title: "Estación Aguas", rating: 5, likes: 850, date: "Hace 1 mes", placeId: 1, text: "Es una estación muy bien ubicada para moverse por el centro. A veces es concurrida, pero el acceso es rápido." },
  { title: "Monserrate", rating: 5, likes: 2340, date: "Hace 2 semanas", placeId: 2, text: "Un lugar imperdible en Bogotá. La vista es increíble y el recorrido vale totalmente la pena." },
  { title: "Parque El Jazmín", rating: 4, likes: 420, date: "Hace 3 semanas", placeId: 3, text: "Buen parque para caminar y hacer deporte. Es tranquilo y bien cuidado." },
  { title: "Parque Timiza", rating: 5, likes: 1800, date: "Hace 1 semana", placeId: 4, text: "Excelente parque para hacer ejercicio y pasar el día. Muy amplio y con buenas zonas verdes." },
  { title: "Estación Minuto de Dios", rating: 4, likes: 950, date: "Hace 1 mes", placeId: 5, text: "Funcional y bien ubicada, aunque en horas pico suele llenarse bastante." },
];

const guardadosEjemplo = spotsDatos.slice(0, 6);

// ─── REPORTES MOCK (para MOD/ADMIN) ─────────────────────────────────────────

const reportesMock = [
  { id: 1, tipo: "Spot", contenido: "La Candelaria - Foto inapropiada", usuario: "@user_34", fecha: "Hace 10 min", estado: "pendiente" },
  { id: 2, tipo: "Reseña", contenido: "Monserrate - Lenguaje ofensivo", usuario: "@viajero99", fecha: "Hace 1 hora", estado: "pendiente" },
  { id: 3, tipo: "Spot", contenido: "Parque Timiza - Información falsa", usuario: "@carlos_m", fecha: "Hace 3 horas", estado: "pendiente" },
  { id: 4, tipo: "Reseña", contenido: "Aguas - Spam publicitario", usuario: "@spam_bot", fecha: "Hace 5 horas", estado: "revisado" },
];

const historialMock = [
  { id: 1, accion: "Spot eliminado", detalle: "Contenido duplicado - Chapinero", fecha: "Ayer", tipo: "eliminado" },
  { id: 2, accion: "Reseña ocultada", detalle: "Lenguaje inapropiado", fecha: "Hace 2 días", tipo: "ocultado" },
  { id: 3, accion: "Usuario advertido", detalle: "@troll_user - 2da advertencia", fecha: "Hace 3 días", tipo: "advertencia" },
  { id: 4, accion: "Spot restaurado", detalle: "Apelación aceptada - Usaquén", fecha: "Hace 1 semana", tipo: "restaurado" },
];

const usuariosMock = [
  { id: 1, nombre: "Ana García", username: "@ana_g", rol: "MIEMBRO", spots: 4, reportes: 0, estado: "activo" },
  { id: 2, nombre: "Carlos M.", username: "@carlos_m", rol: "SOCIO", spots: 12, reportes: 1, estado: "activo" },
  { id: 3, nombre: "Spam Bot", username: "@spam_bot", rol: "MIEMBRO", spots: 0, reportes: 5, estado: "advertido" },
  { id: 4, nombre: "Laura Torres", username: "@laurat", rol: "MOD", spots: 8, reportes: 0, estado: "activo" },
  { id: 5, nombre: "Troll User", username: "@troll_u", rol: "MIEMBRO", spots: 1, reportes: 8, estado: "suspendido" },
];

// ─── COMPONENTES AUXILIARES ──────────────────────────────────────────────────

const SinContenido = ({ icono, titulo, descripcion, textBoton, rutaBoton }) => {
  const navigate = useNavigate();
  return (
    <div className="no-contenido">
      <div className="empty-icon">{icono}</div>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
      <button className="btn-explorar" onClick={() => navigate(rutaBoton)}>
        {textBoton}
      </button>
    </div>
  );
};

// Tarjeta de reporte individual
const ReporteCard = ({ reporte }) => (
  <div className="reporte-card" style={{
    background: reporte.estado === "pendiente" ? "#fff8e1" : "#f1f8e9",
    border: `1px solid ${reporte.estado === "pendiente" ? "#ffe082" : "#a5d6a7"}`,
    borderRadius: 10, padding: "14px 18px", display: "flex",
    alignItems: "center", gap: 14, marginBottom: 10
  }}>
    <span style={{
      background: reporte.tipo === "Spot" ? "#e3f2fd" : "#fce4ec",
      color: reporte.tipo === "Spot" ? "#1565c0" : "#c62828",
      borderRadius: 6, padding: "3px 10px", fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap"
    }}>{reporte.tipo}</span>
    <div style={{ flex: 1 }}>
      <p style={{ margin: 0, fontWeight: 600, fontSize: "0.95rem" }}>{reporte.contenido}</p>
      <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>por {reporte.usuario} · {reporte.fecha}</p>
    </div>
    {reporte.estado === "pendiente" && (
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ background: "#ef5350", color: "white", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>
          Eliminar
        </button>
        <button style={{ background: "#66bb6a", color: "white", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer", fontWeight: 600 }}>
          Ignorar
        </button>
      </div>
    )}
    {reporte.estado === "revisado" && (
      <span style={{ color: "#388e3c", fontWeight: 700, fontSize: "0.85rem" }}>✔ Revisado</span>
    )}
  </div>
);

// Fila de historial de moderación
const HistorialRow = ({ item }) => {
  const colores = { eliminado: "#ef5350", ocultado: "#ffa726", advertencia: "#ab47bc", restaurado: "#66bb6a" };
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
      <span style={{ width: 12, height: 12, borderRadius: "50%", background: colores[item.tipo] || "#ccc", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.9rem" }}>{item.accion}</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>{item.detalle}</p>
      </div>
      <span style={{ fontSize: "0.78rem", color: "#aaa", whiteSpace: "nowrap" }}>{item.fecha}</span>
    </div>
  );
};

// Fila de usuario para panel admin
const UsuarioRow = ({ usuario }) => {
  const estadoColor = { activo: "#388e3c", advertido: "#f57c00", suspendido: "#c62828" };
  const rolColor = { MIEMBRO: "#555", SOCIO: "#e65100", MOD: "#1565c0", ADMIN: "#5d4000" };
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "center", padding: "12px 0", borderBottom: "1px solid #eee" }}>
      <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#555" }}>
        {usuario.nombre[0]}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: "0.92rem" }}>{usuario.nombre}</p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#888" }}>{usuario.username} · <span style={{ color: rolColor[usuario.rol] }}>{usuario.rol}</span></p>
      </div>
      <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#888" }}>
        <p style={{ margin: 0 }}>{usuario.spots} spots · {usuario.reportes} reportes</p>
        <p style={{ margin: 0, fontWeight: 700, color: estadoColor[usuario.estado] || "#555" }}>{usuario.estado}</p>
      </div>
      {usuario.estado !== "suspendido" ? (
        <button style={{ background: "#ef5350", color: "white", border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: "0.8rem" }}>
          <FaBan />
        </button>
      ) : (
        <button style={{ background: "#66bb6a", color: "white", border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", fontSize: "0.8rem" }}>
          ✔
        </button>
      )}
    </div>
  );
};

const TABS_POR_ROL = {
  // MIEMBRO: contenido personal del perfil
  MIEMBRO: [
    { id: "publicaciones", label: "Mis Spots", icon: <FaMapMarkerAlt /> },
    { id: "resenas", label: "Mis Reseñas", icon: <FaRegEdit /> },
    { id: "guardados", label: "Guardados", icon: <FaBookmark /> },
  ],
  // SOCIO: spots propios + acceso rápido a locales (gestión profunda → menú lateral /locales)
  SOCIO: [
    { id: "publicaciones", label: "Mis Spots", icon: <FaMapMarkerAlt /> },
    { id: "mis-locales", label: "Mis Locales", icon: <FaStore /> },
  ],
  // MOD: historial de acciones propias del moderador en su perfil
  // (Dashboard y Gestionar Reportes completos → menú lateral)
  MOD: [
    { id: "reportes", label: "Reportes", icon: <FaFlag /> },
    { id: "historial", label: "Historial", icon: <FaHistory /> },
  ],
  // ADMIN: resumen rápido + gestión de usuarios inline en el perfil
  // (Dashboard, Generar Reportes, Configurar Parámetros → menú lateral)
  ADMIN: [
    { id: "usuarios", label: "Usuarios", icon: <FaUsers /> },
    { id: "moderacion", label: "Moderación", icon: <FaShieldAlt /> },
  ],
};

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

const PerfilTabs = ({ tab, dispatch, tienePublicaciones, tieneResenas, tieneGuardados, rol = "MIEMBRO" }) => {
  // El rol ya llega en mayúsculas acortado desde la API o el modo demo: MIEMBRO, SOCIO, MOD, ADMIN
  const rolNormalizado = (rol || "MIEMBRO").toUpperCase();
  const tabs = TABS_POR_ROL[rolNormalizado] || TABS_POR_ROL.MIEMBRO;

  // Si la tab activa no existe en el rol actual, auto-seleccionar la primera
  const tabValida = tabs.find(t => t.id === tab) ? tab : tabs[0].id;

  // Usar useEffect para evitar setState durante el render
  useEffect(() => {
    if (tabValida !== tab) {
      dispatch({ type: "SET_TAB", payload: tabValida });
    }
  }, [tabValida, tab, dispatch]);

  const esSocio = rolNormalizado === "SOCIO";
  const esMod = rolNormalizado === "MOD";
  const esAdmin = rolNormalizado === "ADMIN";
  const esMiembro = rolNormalizado === "MIEMBRO";

  return (
    <>
      {/* ── BOTONES DE NAVEGACIÓN ── */}
      <div className="perfil-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={tabValida === t.id ? "tab-activa" : ""}
            onClick={() => dispatch({ type: "SET_TAB", payload: t.id })}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO ── */}
      <div className="perfil-tab-content">

        {/* ══════════════ MIEMBRO + SOCIO ══════════════ */}

        {/* MIS SPOTS */}
        {tabValida === "publicaciones" && (esMiembro || esSocio) && (
          tienePublicaciones ? (
            <div className="publicaciones-grid">
              {spotsDatos.map((spot) => (
                <SpotCard
                  key={spot.id}
                  id={spot.id}
                  img={spot.img}
                  title={spot.title}
                  rating={spot.rating}
                  likes={spot.totalResenas}
                  tags={[spot.categoria]}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<FaMapMarkerAlt size={48} />}
              titulo="No tienes publicaciones"
              descripcion="Comparte tus lugares favoritos para que otros los descubran"
              textBoton="¡Crea tu primera publicación!"
              rutaBoton="/crear-publicacion"
            />
          )
        )}

        {/* MIS RESEÑAS (solo MIEMBRO) */}
        {tabValida === "resenas" && esMiembro && (
          tieneResenas ? (
            <div className="reviews-grid">
              {resenasEjemplo.map((resena) => (
                <ReviewCard
                  key={resena.placeId}
                  title={resena.title}
                  rating={resena.rating}
                  text={resena.text}
                  likes={resena.likes}
                  date={resena.date}
                  placeId={resena.placeId}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<FaRegEdit size={48} />}
              titulo="No tienes reseñas"
              descripcion="Comparte tu experiencia sobre los lugares que visitas"
              textBoton="Escribir primera reseña"
              rutaBoton="/mapa"
            />
          )
        )}

        {/* GUARDADOS (solo MIEMBRO) */}
        {tabValida === "guardados" && esMiembro && (
          tieneGuardados ? (
            <div className="guardados-grid">
              {guardadosEjemplo.map((spot) => (
                <SpotCard
                  key={spot.id}
                  img="public/images/publicaciones/default-post.jpg"
                  title={spot.title}
                  tags={spot.tags}
                  rating={spot.rating}
                  likes={spot.likes}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<GrMapLocation size={48} />}
              titulo="No hay lugares guardados"
              descripcion="Guarda tus lugares favoritos para visitarlos después"
              textBoton="Explorar lugares"
              rutaBoton="/mapa"
            />
          )
        )}

        {/* ══════════════ SOCIO ══════════════ */}

        {/* MIS LOCALES — acceso rápido; gestión completa en /locales (menú lateral) */}
        {tabValida === "mis-locales" && esSocio && (
          <div className="no-contenido" style={{ border: "2px dashed #ffb74d", background: "#fff8e1" }}>
            <div className="empty-icon" style={{ color: "#e65100" }}><FaStore size={48} /></div>
            <h4 style={{ color: "#e65100" }}>Tus Locales</h4>
            <p>Administra los locales que tienes verificados en la plataforma.</p>
            <button className="btn-explorar" style={{ background: "#e65100" }}>
              Gestionar mis locales
            </button>
          </div>
        )}

        {/* ══════════════ MOD ══════════════ */}

        {/* REPORTES */}
        {tabValida === "reportes" && esMod && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaFlag style={{ color: "#1565c0" }} />
              <h5 style={{ margin: 0, color: "#1565c0" }}>
                Reportes pendientes ({reportesMock.filter(r => r.estado === "pendiente").length})
              </h5>
            </div>
            {reportesMock.map(r => <ReporteCard key={r.id} reporte={r} />)}
          </div>
        )}

        {/* HISTORIAL MOD */}
        {tabValida === "historial" && esMod && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaHistory style={{ color: "#1565c0" }} />
              <h5 style={{ margin: 0, color: "#1565c0" }}>Tu historial de moderación</h5>
            </div>
            {historialMock.map(item => <HistorialRow key={item.id} item={item} />)}
          </div>
        )}

        {/* ══════════════ ADMIN ══════════════ */}

        {/* USUARIOS ADMIN */}
        {tabValida === "usuarios" && esAdmin && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaUsers style={{ color: "#5d4000" }} />
              <h5 style={{ margin: 0, color: "#5d4000" }}>Gestión de usuarios</h5>
            </div>
            {usuariosMock.map(u => <UsuarioRow key={u.id} usuario={u} />)}
          </div>
        )}

        {/* MODERACIÓN ADMIN (ve todos los reportes + historial) */}
        {tabValida === "moderacion" && esAdmin && (
          <div style={{ padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <FaShieldAlt style={{ color: "#5d4000" }} />
              <h5 style={{ margin: 0, color: "#5d4000" }}>Cola de moderación global</h5>
            </div>
            {reportesMock.map(r => <ReporteCard key={r.id} reporte={r} />)}
            <div style={{ marginTop: 20 }}>
              <h6 style={{ color: "#888", marginBottom: 10 }}>Historial reciente</h6>
              {historialMock.map(item => <HistorialRow key={item.id} item={item} />)}
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PerfilTabs;