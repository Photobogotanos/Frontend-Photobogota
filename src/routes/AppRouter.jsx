import MainLayout from "@/layouts/MainLayout";
import { Routes, Route } from "react-router-dom";
import PaginaInicioPage from "@/pages/pagina-inicio/PaginaInicioPage/PaginaInicioPage.jsx";
import LoginPage from "@/pages/auth/LoginPage/LoginPage.jsx";
import FormularioSolicitudSocioPage from "@/pages/socio/FormularioSolicitudSocioPage/FormularioSolicitudSocioPage.jsx";
import SolicitudEnviadaPage from "@/pages/socio/SolicitudEnviadaPage/SolicitudEnviadaPage.jsx";
import RevisionSolicitudesSocioPage from "@/pages/moderador/RevisionSolicitudesSocioPage/RevisionSolicitudesSocioPage.jsx";
import CreacionDeCuentaPage from "@/pages/auth/CreacionDeCuentaPage/CreacionDeCuentaPage.jsx";
import RecuperarContraPage from "@/pages/auth/RecuperarContraPage/RecuperarContraPage.jsx";
import MiPerfil from "@/pages/perfil/MiPerfilPage/MiPerfilPage.jsx";
import Nosotros from "@/pages/pagina-inicio/Nosotros/Nosotros.jsx";
import ConfirmacionCodigoPage from "@/pages/auth/ConfirmacionCodigoPage/ConfirmacionCodigoPage.jsx";
import Mapa from "@/pages/mapa/MapaPage/MapaPage.jsx";
import SpotPage from "@/pages/spots/SpotPage/SpotPage.jsx";
import CreacionSpotPage from "@/pages/spots/CreacionSpotPage/CreacionSpotPage.jsx";
import EstadisticasSocioPage from "@/pages/socio/EstadisticasSocioPage/EstadisticasSocioPage.jsx";
import Error404Page from "@/pages/common/Error404Page/Error404Page.jsx";
import SocioPromocionesPage from "@/pages/socio/SocioPromocionesPage/SocioPromocionesPage.jsx";
import CrearPromocionPage from "@/pages/socio/SocioPromocionesPage/CrearPromocionPage";
import ContrasenaNuevaPage from "@/pages/auth/ContrasenaNuevaPage/ContrasenaNuevaPage";
import CrearCuentasAdminPage from "@/pages/admin/CrearCuentasAdmin/CrearCuentasAdminPage";
import AdminUsuariosPage from "@/pages/admin/AdminUsuarios/AdminUsuariosPage";

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
        <Route path="/crear-promocion" element={<CrearPromocionPage/>}/>

        {/* Rutas para Revisión de Solicitudes - Moderador */}
        <Route path="/moderador/revision-solicitudes" element={<RevisionSolicitudesSocioPage />} />
        <Route path="/solicitudes-socios" element={<RevisionSolicitudesSocioPage />} />
        
        <Route path="/recuperar-contrasena" element={<RecuperarContraPage />} />
        <Route path="/nueva-contrasena" element={<ContrasenaNuevaPage/>} />
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
        <Route path="/admin/crear-cuentas" element={<CrearCuentasAdminPage />} />
        <Route path="/admin/usuarios" element={<AdminUsuariosPage />} />
        
        {/* Ruta para página 404 */}
        <Route path="*" element={<Error404Page />} />
      </Route>


    </Routes>
  );
};

export default AppRouter;
