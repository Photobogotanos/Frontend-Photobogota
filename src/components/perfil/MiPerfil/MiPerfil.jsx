import { useReducer, useEffect } from "react";
import { Container } from "react-bootstrap";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import PerfilHeader from "./PerfilHeader";
import PerfilStats from "./PerfilStats";
import PerfilTabs from "./PerfilTabs";
import "./MiPerfil.css";
import { useAuth } from "../../../context/AuthContext";
import { getPerfilUsuario } from "../../../api/usuarioApi";
import defaultAvatar from "/images/user-pfp/default-avatar.jpg?url";

// ========== DATOS MOCK PARA FALLBACK ==========
const getMockPerfilData = (nombreUsuario = "usuario") => ({
  nombresCompletos: "Juan Sebastian Romero",
  nombreUsuario: nombreUsuario,
  email: "photobogota123@gmail.com",
  biografia: "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
  telefono: "3138529778",
  fotoPerfil: defaultAvatar,
  tipoUsuario: "MIEMBRO",
  nivel: 5,
});

// Tabs por rol
const PRIMERA_TAB_POR_ROL = {
  MIEMBRO: "publicaciones",
  SOCIO: "publicaciones",
  MOD: "reportes",
  ADMIN: "usuarios",
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
    case "TOGGLE_PUBLICACIONES":
      return { ...state, tienePublicaciones: !state.tienePublicaciones };
    case "TOGGLE_RESENAS":
      return { ...state, tieneResenas: !state.tieneResenas };
    case "TOGGLE_GUARDADOS":
      return { ...state, tieneGuardados: !state.tieneGuardados };
    case "SET_MOSTRAR_EDITAR_PERFIL":
      return { ...state, mostrarEditarPerfil: action.payload };
    case "SET_MOSTRAR_FOTO_PERFIL":
      return { ...state, mostrarFotoPerfil: action.payload };
    case "UPDATE_PERFIL_DATA": {
      const nuevoRol = (action.payload.rol || action.payload.tipoUsuario || "MIEMBRO").toUpperCase();
      const rolAnterior = (state.perfilData.rol || state.perfilData.tipoUsuario || "MIEMBRO").toUpperCase();
      const nuevaTab = nuevoRol !== rolAnterior
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
    tienePublicaciones: true,
    tieneResenas: true,
    tieneGuardados: false,
    mostrarEditarPerfil: false,
    mostrarFotoPerfil: false,
    loading: true,
    usandoMock: false,
    error: null,
    perfilData: {
      nombresCompletos: "",
      nombreUsuario: "",
      email: "",
      biografia: "",
      telefono: "",
      fotoPerfil: defaultAvatar,
      rol: "MIEMBRO",
      nivel: null,
    },
  };
};

export default function MiPerfil() {
  const [state, dispatch] = useReducer(perfilReducer, null, crearEstadoInicial);
  const { user, recargarUsuario } = useAuth();

  // Cargar datos del backend con fallback a mock
  useEffect(() => {
    const cargarPerfil = async () => {
      // Obtener nombre de usuario de diferentes fuentes
      let nombreUsuario = user?.nombreUsuario;
      
      if (!nombreUsuario) {
        try {
          const miembroStorage = localStorage.getItem("miembro");
          if (miembroStorage) {
            const miembro = JSON.parse(miembroStorage);
            nombreUsuario = miembro?.username?.replace(/^@/, "") || miembro?.nombreUsuario;
          }
        } catch (e) {
          console.warn("Error leyendo localStorage:", e);
        }
      }
      
      nombreUsuario = nombreUsuario || "demo_user";
      
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      try {
        // Intentar cargar del backend
        const response = await getPerfilUsuario(nombreUsuario);
        const data = response.data;

        dispatch({
          type: "SET_PERFIL_DATA",
          payload: {
            nombresCompletos: data.nombresCompletos || "",
            nombreUsuario: data.nombreUsuario || nombreUsuario,
            email: data.email || "",
            biografia: data.biografia || "",
            telefono: data.telefono || "",
            fotoPerfil: data.fotoPerfil || defaultAvatar,
            rol: data.tipoUsuario || "MIEMBRO",
            nivel: data.nivel || null,
          }
        });
        dispatch({ type: "SET_USANDO_MOCK", payload: false });

      } catch (error) {

        const isNetworkError = !error.response || error.code === 'ECONNABORTED' || error.message === 'Network Error';
        
        if (isNetworkError) {
          console.warn("Servidor no disponible, usando modo demo:", error.message);
        } else {
          console.warn("Error del backend:", error.response?.status, error.response?.data);
        }
        
        const mockData = getMockPerfilData(nombreUsuario);
        dispatch({
          type: "SET_PERFIL_DATA",
          payload: {
            nombresCompletos: mockData.nombresCompletos,
            nombreUsuario: mockData.nombreUsuario,
            email: mockData.email,
            biografia: mockData.biografia,
            telefono: mockData.telefono,
            fotoPerfil: mockData.fotoPerfil,
            rol: mockData.tipoUsuario,
            nivel: mockData.nivel,
          }
        });
        dispatch({ type: "SET_USANDO_MOCK", payload: true });
        dispatch({ type: "SET_ERROR", payload: isNetworkError ? "Servidor no disponible" : "Error al cargar perfil" });

      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    cargarPerfil();
  }, [user]);

  const handlePerfilActualizado = (datosActualizados) => {
    dispatch({ type: "UPDATE_PERFIL_DATA", payload: datosActualizados });
    if (!state.usandoMock) {
      recargarUsuario();
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

  return (
    <Container fluid className="perfil-container">

      <PerfilHeader
        perfilData={state.perfilData}
        dispatch={dispatch}
        rol={state.perfilData.rol}
        nivel={state.perfilData.nivel}
        usandoMock={state.usandoMock}
      />

      <div className="line-divider" />

      <PerfilStats
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
        rol={state.perfilData.rol}
      />

      <div className="line-divider" />

      <PerfilTabs
        tab={state.tab}
        dispatch={dispatch}
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
        rol={state.perfilData.rol}
        usandoMock={state.usandoMock}
      />

      <EditarPerfilModal
        show={state.mostrarEditarPerfil}
        onHide={() => dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: false })}
        perfilData={state.perfilData}
        onPerfilActualizado={handlePerfilActualizado}
        usandoMock={state.usandoMock}
      />

      <FotoPerfilModal
        show={state.mostrarFotoPerfil}
        onHide={() => dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: false })}
        foto={state.perfilData.fotoPerfil}
        nombre={state.perfilData.nombresCompletos}
      />

    </Container>
  );
}