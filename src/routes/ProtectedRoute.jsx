import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";

export default function ProtectedRoute({ children, roles = [] }) {
  const { usuario, logueado, cargando } = useAuth();

  // Espera a que AuthContext verifique la sesión con el backend
  if (cargando) return <SpinnerLoader texto="Verificando sesión..." />;

  // No está logueado al login
  if (!logueado) return <Navigate to="/login" replace />;

  // Tiene rol requerido? (rol viene del backend, no del localStorage)
  if (roles.length > 0 && !roles.includes(usuario?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
