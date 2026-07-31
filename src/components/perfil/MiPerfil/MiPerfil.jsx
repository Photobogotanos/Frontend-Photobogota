import { useReducer, useEffect } from "react";
import { Container } from "react-bootstrap";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import PreferenciasNotificacionesModal from "@/components/notificaciones/PreferenciasNotificaciones/PreferenciasNotificacionesModal";
import PerfilHeader from "./PerfilHeader";
import PerfilStats from "./PerfilStats";
import PerfilTabs from "./PerfilTabs";
import "./MiPerfil.css";
import { useAuth } from "../../../context/AuthContext";
import { obtenerPerfil } from "../../../services/usuario.service";

// Tabs por rol (alineado con PerfilTabs)
const PRIMERA_TAB_POR_ROL = {
  MIEMBRO: "publicaciones",
  SOCIO: "locales",
  MOD: "resenas",
  ADMIN: "resenas",
};

// ─── REDUCER ────────────────────────────────────────────────────────────────
const perfilReducer = (state, action) => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_PERFIL_DATA":
      return { ...state, perfilData: action.payload };
    case "SET_USANDO_MOCK":
      return { ...state, usandoMock: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_MOSTRAR_EDITAR_PERFIL":
      return { ...state, mostrarEditarPerfil: action.payload };
    case "SET_MOSTRAR_FOTO_PERFIL":
      return { ...state, mostrarFotoPerfil: action.payload };
    case "SET_MOSTRAR_NOTIFICACIONES":
      return { ...state, mostrarNotificaciones: action.payload };
    case "RECONCILIAR_CONTEOS": {
      // Si el backend reportó 0 en un contador pero sí cargamos datos reales
      // para esa lista, preferimos el conteo real (evita stats en 0 falsos).
      const { totalSpots, totalResenas, totalGuardados } = action.payload;
      return {
        ...state,
        perfilData: {
          ...state.perfilData,
          totalSpots:
            state.perfilData.totalSpots > 0
              ? state.perfilData.totalSpots
              : (totalSpots ?? state.perfilData.totalSpots),
          totalResenas:
            state.perfilData.totalResenas > 0
              ? state.perfilData.totalResenas
              : (totalResenas ?? state.perfilData.totalResenas),
          totalGuardados:
            state.perfilData.totalGuardados > 0
              ? state.perfilData.totalGuardados
              : (totalGuardados ?? state.perfilData.totalGuardados),
        },
      };
    }
    case "UPDATE_PERFIL_DATA": {
      const nuevoRol = (
        action.payload.rol ||
        state.perfilData.rol ||
        "MIEMBRO"
      ).toUpperCase();
      const rolAnterior = (state.perfilData.rol || "MIEMBRO").toUpperCase();
      const nuevaTab =
        nuevoRol !== rolAnterior
          ? (PRIMERA_TAB_POR_ROL[nuevoRol] ?? "publicaciones")
          : state.tab;
      return {
        ...state,
        perfilData: { ...state.perfilData, ...action.payload, rol: nuevoRol },
        tab: nuevaTab,
      };
    }
    default:
      return state;
  }
};

// ESTADO INICIAL
const crearEstadoInicial = () => {
  return {
    tab: "publicaciones",
    mostrarEditarPerfil: false,
    mostrarFotoPerfil: false,
    mostrarNotificaciones: false,
    loading: true,
    usandoMock: false,
    error: null,
    perfilData: {
      nombresCompletos: "",
      nombreUsuario: "",
      email: "",
      biografia: "",
      telefono: "",
      fotoPerfil: null,
      rol: "MIEMBRO",
      nivel: null,
      totalSpots: 0,
      totalResenas: 0,
      totalGuardados: 0,
    },
  };
};

export default function MiPerfil() {
  const [state, dispatch] = useReducer(perfilReducer, null, crearEstadoInicial);
  const { usuario, recargarUsuario } = useAuth();

  // Cargar datos del backend; si falla (500 u otro), no romper la UI
  useEffect(() => {
    const cargarPerfil = async () => {
      // Resolver nombreUsuario: contexto (post /auth/me) → contexto (post login) → localStorage
      let nombreUsuario =
        usuario?.nombreUsuario ||
        usuario?.nombre ||
        usuario?.username?.replace(/^@/, "");

      if (!nombreUsuario) {
        try {
          const miembroStorage = localStorage.getItem("miembro");
          if (miembroStorage) {
            const miembro = JSON.parse(miembroStorage);
            nombreUsuario =
              miembro?.nombreUsuario ||
              miembro?.nombre ||
              miembro?.username?.replace(/^@/, "");
          }
        } catch (e) {
          console.warn("Error leyendo localStorage:", e);
        }
      }

      nombreUsuario = nombreUsuario || "demo_user";

      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        const resultado = await obtenerPerfil(nombreUsuario);

        if (resultado?.exitoso && resultado.datos) {
          const data = resultado.datos;
          const rol = (data.rol || "MIEMBRO").toUpperCase();
          dispatch({
            type: "SET_PERFIL_DATA",
            payload: {
              nombresCompletos: data.nombresCompletos || "",
              nombreUsuario: data.nombreUsuario || nombreUsuario,
              email: data.email || "",
              biografia: data.biografia || "",
              telefono: data.telefono || "",
              fotoPerfil: data.fotoPerfil || null,
              rol,
              nivel: data.nivel ?? null,
              totalSpots: data.totalSpots ?? 0,
              totalResenas: data.totalResenas ?? 0,
              totalGuardados: data.totalGuardados ?? 0,
            },
          });
          dispatch({
            type: "SET_TAB",
            payload: PRIMERA_TAB_POR_ROL[rol] ?? "publicaciones",
          });
          dispatch({
            type: "SET_USANDO_MOCK",
            payload: resultado.esMock || false,
          });

          if (resultado.esMock) {
            dispatch({
              type: "SET_ERROR",
              payload:
                "Servidor no disponible. Mostrando datos de demostración.",
            });
          }
        } else {
          // Error de negocio / 500 manejado en el service: mostrar perfil mínimo
          dispatch({
            type: "SET_ERROR",
            payload:
              resultado?.mensaje ||
              "No se pudo cargar el perfil. Intenta más tarde.",
          });
          dispatch({ type: "SET_USANDO_MOCK", payload: false });
          // Mantener datos por defecto para no romper la UI
          dispatch({
            type: "SET_PERFIL_DATA",
            payload: {
              ...state.perfilData,
              nombreUsuario,
              nombresCompletos: usuario?.nombresCompletos || "Usuario",
              fotoPerfil: usuario?.fotoPerfil || null,
              rol: (usuario?.rol || "MIEMBRO").toUpperCase(),
            },
          });
        }
      } catch {
        // Cualquier 500 / red: no cargar datos rotos
        dispatch({
          type: "SET_ERROR",
          payload:
            "Error al cargar el perfil. El servidor no respondió correctamente.",
        });
        dispatch({ type: "SET_USANDO_MOCK", payload: false });
        dispatch({
          type: "SET_PERFIL_DATA",
          payload: {
            ...crearEstadoInicial().perfilData,
            nombreUsuario,
            nombresCompletos: usuario?.nombresCompletos || "Usuario",
            fotoPerfil: usuario?.fotoPerfil || null,
            rol: (usuario?.rol || "MIEMBRO").toUpperCase(),
          },
        });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    cargarPerfil();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  const handlePerfilActualizado = (datosActualizados) => {
    dispatch({ type: "UPDATE_PERFIL_DATA", payload: datosActualizados });
    if (!state.usandoMock) {
      recargarUsuario?.();
    }
  };

  if (state.loading) {
    return (
      <Container fluid className="perfil-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando perfil...</p>
        </div>
      </Container>
    );
  }

  const stats = {
    totalSpots: state.perfilData.totalSpots,
    totalResenas: state.perfilData.totalResenas,
    totalGuardados: state.perfilData.totalGuardados,
  };

  return (
    <Container fluid className="perfil-container">
      {state.error && (
        <div className="perfil-error-banner" role="alert">
          {state.error}
        </div>
      )}

      <PerfilHeader
        perfilData={state.perfilData}
        dispatch={dispatch}
        rol={state.perfilData.rol}
        nivel={state.perfilData.nivel}
        usandoMock={state.usandoMock}
      />

      <div className="line-divider" />

      <PerfilStats rol={state.perfilData.rol} stats={stats} />

      <div className="line-divider" />

      <PerfilTabs
        tab={state.tab}
        dispatch={dispatch}
        rol={state.perfilData.rol}
        nombreUsuario={state.perfilData.nombreUsuario}
        usandoMock={state.usandoMock}
        onDatosCargados={(conteos) =>
          dispatch({ type: "RECONCILIAR_CONTEOS", payload: conteos })
        }
      />

      <EditarPerfilModal
        show={state.mostrarEditarPerfil}
        onHide={() =>
          dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: false })
        }
        perfilData={state.perfilData}
        onPerfilActualizado={handlePerfilActualizado}
        usandoMock={state.usandoMock}
      />

      <FotoPerfilModal
        show={state.mostrarFotoPerfil}
        onHide={() =>
          dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: false })
        }
        foto={state.perfilData.fotoPerfil}
        nombre={state.perfilData.nombresCompletos}
      />

      <PreferenciasNotificacionesModal
        show={state.mostrarNotificaciones}
        onHide={() =>
          dispatch({ type: "SET_MOSTRAR_NOTIFICACIONES", payload: false })
        }
      />
    </Container>
  );
}
