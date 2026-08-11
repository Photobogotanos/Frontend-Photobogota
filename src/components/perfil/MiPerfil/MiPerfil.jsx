import { useReducer, useEffect, useRef } from "react";
import { Container } from "react-bootstrap";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import PreferenciasNotificaciones from "../../notificaciones/PreferenciasNotificaciones/PreferenciasNotificaciones";
import PerfilHeader from "./PerfilHeader";
import PerfilStats from "./PerfilStats";
import PerfilTabs from "./PerfilTabs";
import "./MiPerfil.css";
import { useAuth } from "../../../context/AuthContext";
import { obtenerPerfil, obtenerPuntos } from "../../../services/usuario.service";
import { STORAGE_KEY_MIEMBRO } from "../../../utils/sessionHelper";
import { toast } from "react-hot-toast";

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
    case "SET_PERFIL_DATA": {
      const puntosData = state.puntosData;
      return {
        ...state,
        perfilData: {
          ...action.payload,
          puntosTotales:
            puntosData.puntosTotales > 0
              ? puntosData.puntosTotales
              : (action.payload.puntosTotales ?? 0),
          puntosParaSiguienteNivel:
            puntosData.puntosParaSiguienteNivel > 0
              ? puntosData.puntosParaSiguienteNivel
              : (action.payload.puntosParaSiguienteNivel ?? 0),
          puntosHoy:
            puntosData.puntosHoy > 0
              ? puntosData.puntosHoy
              : (action.payload.puntosHoy ?? 0),
          limiteDiario:
            puntosData.limiteDiario > 0
              ? puntosData.limiteDiario
              : (action.payload.limiteDiario ?? 100),
        },
      };
    }
    case "SET_PUNTOS_DATA":
      return { ...state, puntosData: action.payload, puntosCargados: true };
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
    puntosData: {
      puntosTotales: 0,
      nivel: 1,
      puntosParaSiguienteNivel: 0,
      puntosHoy: 0,
      limiteDiario: 100,
      progresoPercent: 0,
    },
    puntosCargados: false,
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
      puntosTotales: 0,
      puntosParaSiguienteNivel: 0,
      puntosHoy: 0,
      limiteDiario: 100,
    },
  };
};

export default function MiPerfil() {
  const [state, dispatch] = useReducer(perfilReducer, null, crearEstadoInicial);
  const { usuario, recargarUsuario } = useAuth();

  // Cargar datos del backend; si falla (500 u otro), no romper la UI
  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      // Resolver nombreUsuario: contexto (post /auth/me) → contexto (post login) → localStorage
      let nombreUsuario =
        usuario?.nombreUsuario ||
        usuario?.nombre ||
        usuario?.username?.replace(/^@/, "");

      if (!nombreUsuario) {
        try {
          const miembroStorage = localStorage.getItem(STORAGE_KEY_MIEMBRO);
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
        if (!activo) return;

        const resultado = await obtenerPerfil(nombreUsuario);

        if (!activo || !resultado) return;

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
              puntosTotales: data.puntosTotales ?? 0,
              puntosParaSiguienteNivel: data.puntosParaSiguienteNivel ?? 0,
              puntosHoy: data.puntosHoy ?? 0,
              limiteDiario: data.limiteDiario ?? 100,
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
        if (!activo) return;
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
        if (activo) dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    cargarPerfil();
    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario]);

  // oxlint-disable-next-line react-doctor/no-set-state-after-await-in-effect -- todos los setters tras await están bajo el flag activo + cleanup
  useEffect(() => {
    let activo = true;

    const cargarPuntos = async () => {
      if (!activo) return;
      const resultado = await obtenerPuntos();
      if (!activo || !resultado?.exitoso || !resultado.datos) return;

      const datos = resultado.datos;
      const puntosData = {
        puntosTotales: datos.puntosTotales ?? 0,
        nivel: datos.nivel ?? 1,
        puntosParaSiguienteNivel: datos.puntosParaSiguienteNivel ?? 0,
        puntosHoy: datos.puntosHoy ?? 0,
        limiteDiario: datos.limiteDiario ?? 100,
        progresoPercent: datos.progresoPercent ?? null,
      };

      dispatch({ type: "SET_PUNTOS_DATA", payload: puntosData });

      const nivelAnterior = sessionStorage.getItem("nivelAnterior");
      const nivelActual = String(puntosData.nivel);

      if (nivelAnterior && Number(nivelAnterior) < Number(puntosData.nivel)) {
        toast.success(`¡Subiste de nivel! Ahora eres nivel ${puntosData.nivel}`, {
          duration: 4000,
          icon: "🎉",
        });
      }

      sessionStorage.setItem("nivelAnterior", nivelActual);
    };

    cargarPuntos();
    return () => {
      activo = false;
    };
  }, [usuario, dispatch]);

  const notificacionesRef = useRef(null);

  useEffect(() => {
    if (state.mostrarNotificaciones && notificacionesRef.current) {
      notificacionesRef.current.showModal();
    }
  }, [state.mostrarNotificaciones]);

  const cerrarNotificaciones = () => {
    dispatch({ type: "SET_MOSTRAR_NOTIFICACIONES", payload: false });
  };

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

  const esPerfilPropio = true;

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
        esPerfilPropio={esPerfilPropio}
        puntosTotales={state.puntosData.puntosTotales}
        puntosParaSiguienteNivel={state.puntosData.puntosParaSiguienteNivel}
        puntosHoy={state.puntosData.puntosHoy}
        limiteDiario={state.puntosData.limiteDiario}
        progresoPercent={state.puntosData.progresoPercent}
        puntosCargados={state.puntosCargados}
      />

      <div className="line-divider" />

      <PerfilStats
        rol={state.perfilData.rol}
        stats={stats}
        esPerfilPropio={esPerfilPropio}
        puntosTotales={state.puntosData.puntosTotales}
      />

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

      {/* Modal de preferencias de notificaciones */}
      {state.mostrarNotificaciones && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, react-doctor/no-noninteractive-element-interactions
        <dialog
          ref={notificacionesRef}
          className="perfil-notif-dialog"
          aria-labelledby="perfil-notif-title"
          onClose={cerrarNotificaciones}
          onCancel={(e) => {
            e.preventDefault();
            cerrarNotificaciones();
          }}
          onClick={(e) => {
            if (e.target === notificacionesRef.current) {
              cerrarNotificaciones();
            }
          }}
        >
          <div className="perfil-notif-panel">
            <button
              type="button"
              className="perfil-notif-close"
              onClick={cerrarNotificaciones}
              aria-label="Cerrar"
            >
              ×
            </button>
            <h3 id="perfil-notif-title" className="perfil-notif-title">
              Preferencias de Notificaciones
            </h3>
            <p className="perfil-notif-sub">
              Configura cómo quieres recibir los avisos.
            </p>
            <PreferenciasNotificaciones
              enModal
              onCerrar={cerrarNotificaciones}
              onGuardado={cerrarNotificaciones}
            />
          </div>
        </dialog>
      )}
    </Container>
  );
}
