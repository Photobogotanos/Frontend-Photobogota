import { useReducer } from "react";
import { Container } from "react-bootstrap";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import PerfilHeader from "./PerfilHeader";
import PerfilStats from "./PerfilStats";
import PerfilTabs from "./PerfilTabs";
import "./MiPerfil.css";

// ─── REDUCER ────────────────────────────────────────────────────────────────
// Un reducer es como un "centro de control" del estado.
// Recibe la acción que ocurrió y devuelve el nuevo estado.
const perfilReducer = (state, action) => {
  switch (action.type) {
    case "SET_TAB":
      return { ...state, tab: action.payload };
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
    case "UPDATE_PERFIL_DATA":
      return { ...state, perfilData: action.payload };
    default:
      return state;
  }
};

// ESTADO INICIAL
const initialState = {
  tab: "publicaciones",
  tienePublicaciones: true,
  tieneResenas: true,
  tieneGuardados: false,
  mostrarEditarPerfil: false,
  mostrarFotoPerfil: false,
  perfilData: {
    nombreCompleto: "Juan Sebastian Romero",
    nombreUsuario: "sxbxxs.r",
    descripcion:
      "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
    foto: "public/images/user-pfp/default-avatar.jpg",
  },
};

export default function MiPerfil() {
  const [state, dispatch] = useReducer(perfilReducer, initialState);

  const handlePerfilActualizado = (datosActualizados) => {
    dispatch({ type: "UPDATE_PERFIL_DATA", payload: datosActualizados });
  };

  return (
    <Container fluid className="perfil-container">

      {/* 1. Foto, nombre, badges, botón editar */}
      <PerfilHeader
        perfilData={state.perfilData}
        dispatch={dispatch}
      />

      <div className="line-divider" />

      {/* 2. Contadores: publicaciones, reseñas, guardados */}
      <PerfilStats
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
      />

      <div className="line-divider" />

      {/* 3. Pestañas y su contenido */}
      <PerfilTabs
        tab={state.tab}
        dispatch={dispatch}
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
      />

      {/* MODALES — se renderizan fuera del flujo normal */}
      <EditarPerfilModal
        show={state.mostrarEditarPerfil}
        onHide={() => dispatch({ type: "SET_MOSTRAR_EDITAR_PERFIL", payload: false })}
        perfilData={state.perfilData}
        onPerfilActualizado={handlePerfilActualizado}
      />

      <FotoPerfilModal
        show={state.mostrarFotoPerfil}
        onHide={() => dispatch({ type: "SET_MOSTRAR_FOTO_PERFIL", payload: false })}
        foto={state.perfilData.foto}
        nombre={state.perfilData.nombreCompleto}
      />

    </Container>
  );
}