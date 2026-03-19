import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import PaginaInicioPage from "@/pages/PaginaInicioPage.jsx";
import LoginPage from "@/pages/LoginPage.jsx";
import FormularioSolicitudSocioPage from "@/pages/FormularioSolicitudSocioPage.jsx";
import SolicitudEnviadaPage from "@/pages/SolicitudEnviadaPage.jsx";
import RevisionSolicitudesSocioPage from "@/pages/RevisionSolicitudesSocioPage.jsx";
import CreacionDeCuentaPage from "@/pages/CreacionDeCuentaPage.jsx";
import RecuperarContraPage from "@/pages/RecuperarContraPage.jsx";
import MiPerfil from "@/pages/MiPerfilPage.jsx";
import Nosotros from "@/pages/Nosotros.jsx";
import ConfirmacionCodigoPage from "@/pages/ConfirmacionCodigoPage.jsx";
import Mapa from "@/pages/MapaPage.jsx";
import SpotPage from "@/pages/SpotPage";
import CreacionSpotPage from "@/pages/CreacionSpotPage.jsx";
import EstadisticasSocioPage from "@/pages/EstadisticasSocioPage.jsx";
import Error404Page from "@/pages/Error404Page.jsx";
import SocioPromocionesPage from "@/pages/SocioPromocionesPage";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<PaginaInicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/creacion-cuenta" element={<CreacionDeCuentaPage />} />
        
        {/* Rutas para Solicitud de Socio - Usuario */}  
        <Route path="/solicitud-socio/formulario" element={<FormularioSolicitudSocioPage />} />
        <Route path="/solicitud-enviada" element={<SolicitudEnviadaPage />} />
        
        {/* Rutas para Socio Promociones */}
        <Route path="/socio-promociones" element={<SocioPromocionesPage/>}/>
        
        {/* Rutas para Revisión de Solicitudes - Moderador */}
        <Route path="/moderador/revision-solicitudes" element={<RevisionSolicitudesSocioPage />} />
        <Route path="/solicitudes-socios" element={<RevisionSolicitudesSocioPage />} />
        
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
        
        {/* Ruta para página 404 */}
        <Route path="*" element={<Error404Page />} />
      </Route>


    </Routes>
  );
};

export default AppRouter;
