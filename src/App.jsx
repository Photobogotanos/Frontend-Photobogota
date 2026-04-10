import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import ScrollToTop from "@/components/common/ScrollToTop";

import Lottie from "lottie-react";
import SecurityAnimation from "@/assets/animations/SecurityLock.json";
import { useRefreshLimit } from "@/hooks/useRefreshLimit";
import "@/hooks/useRefreshLimit.css";

function App() {
  const { isBlocked, remainingCooldown, manualReset } = useRefreshLimit();

  if (isBlocked) {
    return (
      <div className="limit-screen-container">
        <div className="limit-card">
          <Lottie
            animationData={SecurityAnimation}
            className="limit-lottie"
          />
          <h1 className="limit-title">¡Acceso temporalmente pausado!</h1>
          <p className="limit-text">
            Has refrescado la página demasiadas veces.<br />
            Espera un momento para continuar:
          </p>
          <div className="limit-timer">{remainingCooldown}s</div>
          <button className="limit-btn" onClick={manualReset}>
            Reintentar ahora
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter basename="/Frontend-Photobogota">
      <ScrollToTop />
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;