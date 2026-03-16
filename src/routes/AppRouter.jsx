import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import PaginaInicioPage from "@/pages/PaginaInicioPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import SolicitudSocioPage from "@/pages/SolicitudSocioPage.jsx";
import SolicitudEnviadaPage from "@/pages/SolicitudEnviadaPage.jsx";
import CreacionDeCuentaPage from "@/pages/CreacionDeCuentaPage.jsx";
import RecuperarContraPage from "@/pages/RecuperarContraPage.jsx";
import MiPerfil from "@/pages/MiPerfilPage.jsx";
import Nosotros from "@/pages/Nosotros.jsx";
import ConfirmacionCodigoPage from "@/pages/ConfirmacionCodigoPage.jsx";
import Mapa from "@/pages/MapaPage.jsx";
import SpotPage from "@/pages/SpotPage";
import CreacionSpotPage from "@/pages/CreacionSpotPage.jsx";
import EstadisticasSocioPage from "@/pages/EstadisticasSocioPage.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<PaginaInicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/creacion-cuenta" element={<CreacionDeCuentaPage />} />
        <Route path="/solicitud-socio" element={<SolicitudSocioPage />} />
        <Route path="/solicitud-enviada" element={<SolicitudEnviadaPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContraPage />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/crear-spot" element={<CreacionSpotPage />} />
        <Route
          path="/notificaciones"
          element={<div>Página de Notificaciones (en construcción)</div>}
        />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route
          path="/confirmacion-codigo"
          element={<ConfirmacionCodigoPage />}
        />
        <Route path="/spot/:id" element={<SpotPage />} />
        <Route path="/estadisticas" element={<EstadisticasSocioPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
