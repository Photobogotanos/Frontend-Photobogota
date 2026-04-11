/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { obtenerSesion, estaLogueado, cerrarSesion as cerrarSesionHelper, actualizarSesion } from "@/utils/sessionHelper";
import { postLogout, getUsuarioAutenticado } from "@/api/usuarioApi";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

/**
 * Verificar si estamos en modo demo
 */
const isModoDemo = () => {
  return localStorage.getItem('modoDemo') === 'true' ||
    sessionStorage.getItem('modoDemo') === 'true';
};

/**
 * Proveedor de contexto de autenticación
 * Maneja el estado global del usuario logueado
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [logueado, setLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      // Si estamos en modo demo, no intentamos conectar al backend
      if (isModoDemo()) {
        const sesion = obtenerSesion();
        if (sesion) {
          setUsuario(sesion);
          setLogueado(true);
        }
        setCargando(false);
        return;
      }

      if (estaLogueado()) {
        try {
          // Intentamos obtener datos frescos del backend primero
          const response = await getUsuarioAutenticado();
          setUsuario(response.data);
          setLogueado(true);
          actualizarSesion(response.data);
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);

          // Si el error es 401 (No autorizado) o 403 (Prohibido)
          // significa que el token guardado ya no sirve.
          if (error.response?.status === 401 || error.response?.status === 403) {
            cerrarSesionHelper(); // Limpia cookies y storage
            setUsuario(null);
            setLogueado(false);
          } else {
            // Si es otro error (ej. server caído), usamos lo que tenemos en local
            const sesion = obtenerSesion();
            setUsuario(sesion);
            setLogueado(true);
          }
        }
      }
      setCargando(false);
    };

    verificarSesion();
  }, []);

  /**
   * Inicia sesión guardando el usuario en el contexto
   * @param {Object} datosUsuario - Datos del usuario desde el servicio de login
   */
  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario);
    setLogueado(true);
  };

  /**
   * Cierra la sesión del usuario
   * Llama al backend para invalidar la sesión y luego limpia el estado local
   */
  const cerrarSesion = async () => {
    try {
      // Verificar si estamos en modo demo
      const modoDemo = isModoDemo();

      if (!modoDemo) {
        // Solo llamar al backend si NO estamos en modo demo
        try {
          await postLogout();
          toast.success("Sesión cerrada correctamente");
        } catch (backendError) {
          // Si el backend falla pero no es modo demo, mostramos advertencia
          console.error("Error al cerrar sesión en el backend:", backendError);
          toast.error("Error al cerrar sesión en el servidor, pero se limpió la sesión local");
        }
      } else {
        console.log("Modo demo activo - Cerrando sesión localmente");
        toast.success("Sesión cerrada (Modo Demo)");
      }

      // Limpiar bandera de modo demo
      localStorage.removeItem('modoDemo');
      sessionStorage.removeItem('modoDemo');

    } catch (error) {
      console.error("Error inesperado al cerrar sesión:", error);
      toast.error("Error al cerrar sesión, pero se limpió la sesión local");
    } finally {
      // Siempre limpiar la sesión local
      cerrarSesionHelper();
      setUsuario(null);
      setLogueado(false);
    }
  };

  /**
   * Actualiza los datos del usuario en el contexto y en localStorage
   * @param {Object} datosActualizados - Datos actualizados del usuario
   */
  const actualizarUsuario = (datosActualizados) => {
    // Actualizar en memoria (React state)
    setUsuario((prev) => ({
      ...prev,
      ...datosActualizados,
    }));
    // Actualizar en localStorage para persistencia
    actualizarSesion(datosActualizados);
  };

  /**
   * Recarga los datos del usuario desde el backend
   * Útil después de actualizar el perfil o cambiar la contraseña
   */
  const recargarUsuario = async () => {
    // En modo demo, no intentamos recargar del backend
    if (isModoDemo()) {
      console.log("Modo demo - No se puede recargar usuario del backend");
      toast.error("Modo demo: No se puede conectar al servidor");
      return;
    }

    try {
      const response = await getUsuarioAutenticado();
      setUsuario(response.data);
      actualizarSesion(response.data);
    } catch (error) {
      console.error("Error al recargar datos del usuario:", error);
      throw error;
    }
  };

  const valor = {
    usuario,
    logueado,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarUsuario,
    recargarUsuario,
    isModoDemo: isModoDemo(), // Exponer estado de modo demo
  };

  return <AuthContext.Provider value={valor}>{cargando ? <SpinnerLoader texto="Cargando..." /> : children}</AuthContext.Provider>;
}

/**
 * Hook para usar el contexto de autenticación
 * @returns {Object} Objeto con el estado y funciones de autenticación
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return contexto;
}

export default AuthContext;