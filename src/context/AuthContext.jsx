import { createContext, useContext, useState, useEffect } from "react";
import { obtenerSesion, estaLogueado, cerrarSesion as cerrarSesionHelper, actualizarSesion } from "@/utils/sessionHelper";
import { postLogout } from "@/api/usuarioApi";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

/**
 * Proveedor de contexto de autenticación
 * Maneja el estado global del usuario logueado
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [logueado, setLogueado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Cargar sesión inicial desde localStorage
    const verificarSesion = () => {
      if (estaLogueado()) {
        const sesion = obtenerSesion();
        setUsuario(sesion);
        setLogueado(true);
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
      // Llamar al backend para invalidar la sesión
      await postLogout();
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      // Incluso si falla el logout en el backend, limpiamos la sesión local
      console.error("Error al cerrar sesión en el backend:", error);
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

  const valor = {
    usuario,
    logueado,
    cargando,
    iniciarSesion,
    cerrarSesion,
    actualizarUsuario,
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