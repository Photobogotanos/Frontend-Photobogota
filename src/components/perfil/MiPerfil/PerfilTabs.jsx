import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRegEdit,
  FaStore,
  FaBookmark,
  FaBullhorn,
} from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import SpotCard from "../../spots/SpotCard/SpotCard";
import ReviewCard from "../ReviewCard/ReviewCard";
import {
  obtenerSpotsUsuario,
  obtenerResenasUsuario,
  obtenerSpotsGuardados,
} from "@/services/usuario.service";

// ─── TRANSFORMACIONES ────────────────────────────────────────────────────────

const transformarSpotParaCard = (spot) => ({
  id: spot?.id,
  title: spot?.nombre || "Sin nombre",
  tags: spot?.categoria ? [spot.categoria] : [],
  rating: (spot?.rating ?? 0).toString(),
  likes: (spot?.totalResenas ?? 0).toString(),
  img: spot?.imagen,
});

// ─── TABS POR ROL ────────────────────────────────────────────────────────────
// MIEMBRO: publicaciones, reseñas, guardados
// SOCIO:   locales, promociones
// MOD / ADMIN: reseñas, guardados (no suben publicaciones)

const TABS_POR_ROL = {
  MIEMBRO: [
    { id: "publicaciones", label: "Mis Spots", icon: <FaMapMarkerAlt /> },
    { id: "resenas", label: "Mis Reseñas", icon: <FaRegEdit /> },
    { id: "guardados", label: "Guardados", icon: <FaBookmark /> },
  ],
  SOCIO: [
    { id: "locales", label: "Mis Locales", icon: <FaStore /> },
    { id: "promociones", label: "Promociones", icon: <FaBullhorn /> },
  ],
  MOD: [
    { id: "resenas", label: "Mis Reseñas", icon: <FaRegEdit /> },
    { id: "guardados", label: "Guardados", icon: <FaBookmark /> },
  ],
  ADMIN: [
    { id: "resenas", label: "Mis Reseñas", icon: <FaRegEdit /> },
    { id: "guardados", label: "Guardados", icon: <FaBookmark /> },
  ],
};

const PRIMERA_TAB_POR_ROL = {
  MIEMBRO: "publicaciones",
  SOCIO: "locales",
  MOD: "resenas",
  ADMIN: "resenas",
};

// ─── COMPONENTES AUXILIARES ──────────────────────────────────────────────────

const SinContenido = ({ icono, titulo, descripcion, textBoton, rutaBoton }) => {
  const navigate = useNavigate();
  return (
    <div className="no-contenido">
      <div className="empty-icon">{icono}</div>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
      {textBoton && rutaBoton && (
        <button className="btn-explorar" onClick={() => navigate(rutaBoton)}>
          {textBoton}
        </button>
      )}
    </div>
  );
};

const LoadingBlock = () => (
  <div className="text-center py-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  </div>
);

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────

const PerfilTabs = ({
  tab,
  dispatch,
  rol = "MIEMBRO",
  nombreUsuario = "demo_user",
  usandoMock = false,
  onDatosCargados,
}) => {
  const rolNormalizado = (rol || "MIEMBRO").toUpperCase();
  const tabs = TABS_POR_ROL[rolNormalizado] || TABS_POR_ROL.MIEMBRO;

  const esSocio = rolNormalizado === "SOCIO";
  const esMiembro = rolNormalizado === "MIEMBRO";
  const esStaff = rolNormalizado === "MOD" || rolNormalizado === "ADMIN";

  const tabValida = tabs.find((t) => t.id === tab)
    ? tab
    : tabs[0]?.id || PRIMERA_TAB_POR_ROL[rolNormalizado] || "publicaciones";

  useEffect(() => {
    if (tabValida !== tab) {
      dispatch({ type: "SET_TAB", payload: tabValida });
    }
  }, [tabValida, tab, dispatch]);

  const [spotsUsuario, setSpotsUsuario] = useState([]);
  const [resenasUsuario, setResenasUsuario] = useState([]);
  const [guardadosUsuario, setGuardadosUsuario] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const refetchGuardados = async () => {
    const resGuardados = await obtenerSpotsGuardados();
    if (resGuardados?.exitoso && Array.isArray(resGuardados.datos)) {
      setGuardadosUsuario(resGuardados.datos);
    } else {
      setGuardadosUsuario([]);
    }
  };

  useEffect(() => {
    let cancelado = false;

    const cargarDatos = async () => {
      setCargandoDatos(true);
      setErrorCarga(null);

      const conteos = { totalSpots: 0, totalResenas: 0, totalGuardados: 0 };

      try {
        // Spots / locales solo para miembro y socio
        if (esMiembro || esSocio) {
          try {
            const resSpots = await obtenerSpotsUsuario(nombreUsuario);
            if (
              !cancelado &&
              resSpots?.exitoso &&
              Array.isArray(resSpots.datos)
            ) {
              setSpotsUsuario(resSpots.datos);
              conteos.totalSpots = resSpots.datos.length;
            } else if (!cancelado) {
              setSpotsUsuario([]);
            }
          } catch {
            if (!cancelado) setSpotsUsuario([]);
          }
        }

        // Reseñas: miembro + staff
        if (esMiembro || esStaff) {
          try {
            const resResenas = await obtenerResenasUsuario(nombreUsuario);
            if (
              !cancelado &&
              resResenas?.exitoso &&
              Array.isArray(resResenas.datos)
            ) {
              setResenasUsuario(resResenas.datos);
              conteos.totalResenas = resResenas.datos.length;
            } else if (!cancelado) {
              setResenasUsuario([]);
            }
          } catch {
            if (!cancelado) setResenasUsuario([]);
          }
        }

        // Guardados: miembro + staff
        if (esMiembro || esStaff) {
          try {
            const resGuardados = await obtenerSpotsGuardados();
            if (
              !cancelado &&
              resGuardados?.exitoso &&
              Array.isArray(resGuardados.datos)
            ) {
              setGuardadosUsuario(resGuardados.datos);
              conteos.totalGuardados = resGuardados.datos.length;
            } else if (!cancelado) {
              setGuardadosUsuario([]);
            }
          } catch {
            if (!cancelado) setGuardadosUsuario([]);
          }
        }

        if (!cancelado) {
          onDatosCargados?.(conteos);
        }
      } catch {
        if (!cancelado) {
          setErrorCarga("No se pudo cargar el contenido. Intenta más tarde.");
        }
      } finally {
        if (!cancelado) setCargandoDatos(false);
      }
    };

    cargarDatos();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nombreUsuario, rolNormalizado, esMiembro, esSocio, esStaff]);

  const spotsFormateados = spotsUsuario
    .filter(Boolean)
    .map(transformarSpotParaCard);

  return (
    <>
      {/* ── BOTONES DE NAVEGACIÓN ── */}
      <div className="perfil-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tabValida === t.id ? "tab-activa" : ""}
            onClick={() => dispatch({ type: "SET_TAB", payload: t.id })}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── CONTENIDO ── */}
      <div className="perfil-tab-content">
        {errorCarga && <div className="perfil-error-banner">{errorCarga}</div>}

        {/* ══════════════ MIEMBRO: MIS SPOTS ══════════════ */}
        {tabValida === "publicaciones" &&
          esMiembro &&
          (cargandoDatos ? (
            <LoadingBlock />
          ) : spotsFormateados.length > 0 ? (
            <div className="publicaciones-grid">
              {spotsFormateados.map((spot) => (
                <SpotCard
                  key={spot.id}
                  id={spot.id}
                  img={spot.img}
                  title={spot.title}
                  rating={spot.rating}
                  likes={spot.likes}
                  tags={spot.tags}
                />
              ))}
            </div>
          ) : (
            <SinContenido
              icono={<FaMapMarkerAlt size={48} />}
              titulo="No tienes publicaciones"
              descripcion="Comparte tus lugares favoritos para que otros los descubran"
              textBoton="¡Crea tu primera publicación!"
              rutaBoton="/crear-spot"
            />
          ))}

        {/* ══════════════ MIEMBRO + STAFF: RESEÑAS ══════════════ */}
        {tabValida === "resenas" &&
          (esMiembro || esStaff) &&
          (cargandoDatos ? (
            <LoadingBlock />
          ) : resenasUsuario.length > 0 ? (
            <div className="reviews-grid">
              {resenasUsuario.map((resena) => (
                <ReviewCard
                  key={resena.id}
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
          ))}

        {/* ══════════════ MIEMBRO + STAFF: GUARDADOS ══════════════ */}
        {tabValida === "guardados" &&
          (esMiembro || esStaff) &&
          (cargandoDatos ? (
            <LoadingBlock />
          ) : guardadosUsuario.length > 0 ? (
            <div className="guardados-grid">
              {guardadosUsuario.map((spot) => {
                const spotCard = transformarSpotParaCard(spot);
                return (
                  <SpotCard
                    key={spot.id}
                    id={spot.id}
                    img={spotCard.img}
                    title={spotCard.title}
                    tags={spotCard.tags}
                    rating={spotCard.rating}
                    likes={spotCard.likes}
                    onToggleGuardado={refetchGuardados}
                  />
                );
              })}
            </div>
          ) : (
            <SinContenido
              icono={<GrMapLocation size={48} />}
              titulo="No hay lugares guardados"
              descripcion="Guarda tus lugares favoritos para visitarlos después"
              textBoton="Explorar lugares"
              rutaBoton="/mapa"
            />
          ))}

        {/* ══════════════ SOCIO: MIS LOCALES ══════════════ */}
        {tabValida === "locales" &&
          esSocio &&
          (cargandoDatos ? (
            <LoadingBlock />
          ) : spotsFormateados.length > 0 ? (
            <div className="publicaciones-grid">
              {spotsFormateados.map((spot) => (
                <SpotCard
                  key={spot.id}
                  id={spot.id}
                  img={spot.img}
                  title={spot.title}
                  rating={spot.rating}
                  likes={spot.likes}
                  tags={spot.tags}
                />
              ))}
            </div>
          ) : (
            <div className="no-contenido no-contenido-socio">
              <div className="empty-icon" style={{ color: "#e65100" }}>
                <FaStore size={48} />
              </div>
              <h4 style={{ color: "#e65100" }}>Tus Locales</h4>
              <p>
                Administra los locales que tienes verificados en la plataforma.
              </p>
              <button
                className="btn-explorar"
                style={{ background: "#e65100" }}
                type="button"
                onClick={() => {
                  /* navegación a /locales si existe en el router */
                  window.location.href = "/locales";
                }}
              >
                Gestionar mis locales
              </button>
            </div>
          ))}

        {/* ══════════════ SOCIO: PROMOCIONES ══════════════ */}
        {tabValida === "promociones" && esSocio && (
          <div className="no-contenido no-contenido-socio">
            <div className="empty-icon" style={{ color: "#e65100" }}>
              <FaBullhorn size={48} />
            </div>
            <h4 style={{ color: "#e65100" }}>Promociones</h4>
            <p>
              Crea y gestiona promociones para atraer más visitantes a tus
              locales.
            </p>
            <button
              className="btn-explorar"
              style={{ background: "#e65100" }}
              type="button"
              onClick={() => {
                window.location.href = "/locales";
              }}
            >
              Crear promoción
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default PerfilTabs;
