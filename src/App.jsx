import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import ScrollToTop from "@/components/common/ScrollToTop";

import Lottie from "lottie-react";
import SecurityAnimation from "@/assets/animations/SecurityLock.json";
import { useRefreshLimit } from "@/hooks/useRefreshLimit";
import "@/hooks/useRefreshLimit.css";

import { MotionConfig } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import CuentaInactivaPage from "@/pages/cuenta/CuentaInactivaPage/CuentaInactivaPage";

function App() {
  const { isBlocked, remainingCooldown } = useRefreshLimit();
  const { logueado, usuario, cargando } = useAuth();

  if (isBlocked) {
    return (
      <div className="limit-screen-container">
        <div className="limit-card">
          <Lottie animationData={SecurityAnimation} className="limit-lottie" />
          <h1 className="limit-title">¡Acceso temporalmente pausado!</h1>
          <p className="limit-text">
            Has refrescado la página demasiadas veces.
            <br />
            Vuelve a intentarlo en:
          </p>
          <div className="limit-timer">{remainingCooldown}s</div>
        </div>
      </div>
    );
  }

  // Cuenta desactivada (suspendida por un admin, o dentro del período de 30 días
  // de recuperación tras una autoeliminación): bloqueamos el resto de la app y
  // mostramos únicamente la pantalla de recuperación / aviso correspondiente.
  if (!cargando && logueado && usuario?.estadoCuenta === false) {
    return <CuentaInactivaPage />;
  }

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename="/Frontend-Photobogota">
        <ScrollToTop />
        <AppRouter />
      </BrowserRouter>
    </MotionConfig>
  );
}

export default App;
