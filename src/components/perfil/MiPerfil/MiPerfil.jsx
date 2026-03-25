import { useReducer, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import EditarPerfilModal from "../EditarPerfilModal/EditarPerfilModal";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import PerfilHeader from "./PerfilHeader";
import PerfilStats from "./PerfilStats";
import PerfilTabs from "./PerfilTabs";
import "./MiPerfil.css";

// Función para obtener el usuario del localStorage
const obtenerUsuarioStorage = () => {
  try {
    const usuario = localStorage.getItem("miembro");
    return usuario ? JSON.parse(usuario) : null;
  } catch (error) {
    console.error("Error al parsear usuario del localStorage:", error);
    return null;
  }
};

// Tabs por rol (espejo de TABS_POR_ROL en PerfilTabs para poder resetear la tab aquí)
const PRIMERA_TAB_POR_ROL = {
  MIEMBRO: "publicaciones",
  SOCIO:   "publicaciones",
  MOD:     "reportes",
  ADMIN:   "usuarios",
};

// ─── REDUCER ────────────────────────────────────────────────────────────────
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
    case "UPDATE_PERFIL_DATA": {
      const nuevoRol = (action.payload.rol || "MIEMBRO").toUpperCase();
      const rolAnterior = (state.perfilData.rol || "MIEMBRO").toUpperCase();
      // Si el rol cambió, resetear la tab a la primera válida del nuevo rol
      const nuevaTab = nuevoRol !== rolAnterior
        ? (PRIMERA_TAB_POR_ROL[nuevoRol] ?? "publicaciones")
        : state.tab;
      return {
        ...state,
        perfilData: { ...action.payload, rol: nuevoRol },
        tab: nuevaTab,
      };
    }
    default:
      return state;
  }
};

// ESTADO INICIAL
const obtenerEstadoInicial = () => {
  const usuarioStorage = obtenerUsuarioStorage();
  
  // Valores por defecto (en mayúsculas para que coincida con la API real)
  const defaults = {
    nombreCompleto: "Usuario",
    nombreUsuario: "usuario",
    descripcion: "Descubre y comparte los mejores spots locales. ¡Sube tus lugares favoritos y explora nuevos destinos cercanos!",
    foto: "/images/user-pfp/default-avatar.jpg",
    rol: "MIEMBRO", // Rol por defecto (en mayúsculas para la API real)
  };
  
  // Si hay usuario en storage, usar sus datos
  if (usuarioStorage) {
    // El username viene con @ del localStorage, lo quitamos para mostrar
    const usernameLimpio = usuarioStorage.username ? usuarioStorage.username.replace(/^@/, "") : "";
    
    return {
      nombreCompleto: usuarioStorage.nombre || defaults.nombreCompleto,
      nombreUsuario: usernameLimpio || defaults.nombreUsuario,
      descripcion: usuarioStorage.descripcion || defaults.descripcion,
      foto: usuarioStorage.foto || defaults.foto,
      rol: (usuarioStorage.rol || defaults.rol).toUpperCase(), // Normalizar a mayúsculas
    };
  }
  
  return defaults;
};

const crearEstadoInicial = () => {
  const perfilData = obtenerEstadoInicial();
  const rol = (perfilData.rol || "MIEMBRO").toUpperCase();
  return {
    tab: PRIMERA_TAB_POR_ROL[rol] ?? "publicaciones",
    tienePublicaciones: true,
    tieneResenas: true,
    tieneGuardados: false,
    mostrarEditarPerfil: false,
    mostrarFotoPerfil: false,
    perfilData: { ...perfilData, rol },
  };
};

export default function MiPerfil() {
  // Se pasa la función (no el objeto) para que useReducer la llame una sola vez
  const [state, dispatch] = useReducer(perfilReducer, null, crearEstadoInicial);

  const handlePerfilActualizado = (datosActualizados) => {
    dispatch({ type: "UPDATE_PERFIL_DATA", payload: datosActualizados });
  };

  return (
    <Container fluid className="perfil-container">

      {/* 1. Foto, nombre, badges, botón editar */}
      <PerfilHeader
        perfilData={state.perfilData}
        dispatch={dispatch}
        rol={state.perfilData.rol}
      />

      <div className="line-divider" />

      {/* 2. Contadores: publicaciones, reseñas, guardados */}
      <PerfilStats
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
        rol={state.perfilData.rol}
      />

      <div className="line-divider" />

      {/* 3. Pestañas y su contenido */}
      <PerfilTabs
        tab={state.tab}
        dispatch={dispatch}
        tienePublicaciones={state.tienePublicaciones}
        tieneResenas={state.tieneResenas}
        tieneGuardados={state.tieneGuardados}
        rol={state.perfilData.rol}
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