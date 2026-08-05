import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaRegEdit,
  FaStore,
  FaBookmark,
  FaBullhorn,
  FaInfoCircle,
} from "react-icons/fa";
import {
  obtenerSpotsUsuario,
  obtenerResenasUsuario,
  obtenerSpotsGuardados,
} from "@/services/usuario.service";
import TabPublicaciones from "./TabPublicaciones";
import TabResenas from "./TabResenas";
import TabGuardados from "./TabGuardados";
import TabLocales from "./TabLocales";
import TabPromociones from "./TabPromociones";
import TabComercial from "./TabComercial";

const transformarSpotParaCard = (spot) => ({
  id: spot?.id,
  title: spot?.nombre || "Sin nombre",
  tags: spot?.categoria ? [spot.categoria] : [],
  rating: (spot?.rating ?? 0).toString(),
  likes: (spot?.totalResenas ?? 0).toString(),
  img: spot?.imagen,
});

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

const PerfilTabs = ({
  tab,
  dispatch,
  rol = "MIEMBRO",
  nombreUsuario = "demo_user",
  onDatosCargados,
  esPerfilPropio = true,
}) => {
  const rolNormalizado = (rol || "MIEMBRO").toUpperCase();
  const tabsBase = TABS_POR_ROL[rolNormalizado] || TABS_POR_ROL.MIEMBRO;

  const tabs =
    esPerfilPropio === false
      ? tabsBase.reduce((acum, t) => {
          if (t.id === "guardados") return acum;
          acum.push({
            ...t,
            label:
              t.id === "publicaciones"
                ? "Spots"
                : t.id === "resenas"
                ? "Reseñas"
                : t.id === "locales"
                ? "Locales"
                : t.label,
          });
          return acum;
        }, [])
      : tabsBase;

  const tabsConComercial =
    esPerfilPropio === false && rolNormalizado === "SOCIO"
      ? [
          ...tabs,
          {
            id: "comercial",
            label: "Comercial",
            icon: <FaInfoCircle />,
          },
        ]
      : tabs;

  const esSocio = rolNormalizado === "SOCIO";
  const esMiembro = rolNormalizado === "MIEMBRO";
  const esStaff = rolNormalizado === "MOD" || rolNormalizado === "ADMIN";

  const tabValida = tabsConComercial.find((t) => t.id === tab)
    ? tab
    : tabsConComercial[0]?.id ||
      PRIMERA_TAB_POR_ROL[rolNormalizado] ||
      "publicaciones";

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

  // oxlint-disable-next-line react-doctor/no-set-state-after-await-in-effect -- todos los setters tras await están bajo el flag cancelado + cleanup
  useEffect(() => {
    let cancelado = false;

    const cargarDatos = async () => {
      setCargandoDatos(true);
      setErrorCarga(null);

      const conteos = { totalSpots: 0, totalResenas: 0, totalGuardados: 0 };

      try {
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

        if (esPerfilPropio && (esMiembro || esStaff)) {
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
      <div className="perfil-tabs">
        {tabsConComercial.map((t) => (
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

      <div className="perfil-tab-content">
        {errorCarga && <div className="perfil-error-banner">{errorCarga}</div>}

        {tabValida === "publicaciones" && esMiembro && (
          <TabPublicaciones
            cargandoDatos={cargandoDatos}
            spotsFormateados={spotsFormateados}
            esPerfilPropio={esPerfilPropio}
          />
        )}

        {tabValida === "resenas" && (esMiembro || esStaff) && (
          <TabResenas
            cargandoDatos={cargandoDatos}
            resenasUsuario={resenasUsuario}
            esPerfilPropio={esPerfilPropio}
          />
        )}

        {esPerfilPropio &&
          tabValida === "guardados" &&
          (esMiembro || esStaff) && (
            <TabGuardados
              cargandoDatos={cargandoDatos}
              guardadosUsuario={guardadosUsuario}
              refetchGuardados={refetchGuardados}
            />
          )}

        {tabValida === "locales" && esSocio && (
          <TabLocales
            cargandoDatos={cargandoDatos}
            spotsFormateados={spotsFormateados}
            esPerfilPropio={esPerfilPropio}
          />
        )}

        {tabValida === "promociones" && esSocio && (
          <TabPromociones esPerfilPropio={esPerfilPropio} />
        )}

        {!esPerfilPropio && tabValida === "comercial" && esSocio && (
          <TabComercial />
        )}
      </div>
    </>
  );
};

export default PerfilTabs;
