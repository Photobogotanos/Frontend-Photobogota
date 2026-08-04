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
import AdminLogsPage from "@/pages/admin/AdminLogs/AdminLogsPage";
import MantenimientoPage from "@/pages/admin/Mantenimiento/MantenimientoPage";
import EnviarNotificacionPage from "@/pages/admin/EnviarNotificacion/EnviarNotificacionPage";
import GestionCategoriasPage from "../pages/moderador/GestionCategoriasPage/GestionCategoriasPage";
import PreferenciasNotificacionesPage from "@/pages/notificaciones/PreferenciasNotificaciones/PreferenciasNotificacionesPage";
import DashboardReportesPage from "@/pages/moderador/DashboardReportesPage/DashboardReportesPage";
import AdminReportesPage from "@/pages/admin/AdminReportesPage/AdminReportesPage";
import AdminEliminacionesPage from "@/pages/admin/AdminEliminacionesPage/AdminEliminacionesPage";
import ProtectedRoute from "./ProtectedRoute";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* ── RUTAS PÚBLICAS ── */}
        <Route path="/" element={<PaginaInicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/creacion-cuenta" element={<CreacionDeCuentaPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContraPage />} />
        <Route path="/nueva-contrasena" element={<ContrasenaNuevaPage />} />
        <Route
          path="/confirmacion-codigo"
          element={<ConfirmacionCodigoPage />}
        />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route
          path="/solicitud-socio/formulario"
          element={<FormularioSolicitudSocioPage />}
        />
        <Route path="/solicitud-enviada" element={<SolicitudEnviadaPage />} />

        {/* ── RUTAS AUTENTICADAS (cualquier rol) ── */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <MiPerfil />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil/preferencias-notificaciones"
          element={
            <ProtectedRoute>
              <PreferenciasNotificacionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-spot"
          element={
            <ProtectedRoute>
              <CreacionSpotPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mapa"
          element={
            <ProtectedRoute>
              <Mapa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spot/:id"
          element={
            <ProtectedRoute>
              <SpotPage />
            </ProtectedRoute>
          }
        />

        {/* ── RUTAS DE SOCIO ── */}
        <Route
          path="/estadisticas"
          element={
            <ProtectedRoute roles={["SOCIO"]}>
              <EstadisticasSocioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/socio-promociones"
          element={
            <ProtectedRoute roles={["SOCIO"]}>
              <SocioPromocionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crear-promocion"
          element={
            <ProtectedRoute roles={["SOCIO"]}>
              <CrearPromocionPage />
            </ProtectedRoute>
          }
        />

        {/* ── RUTAS DE MODERADOR ── */}
        <Route
          path="/moderador/revision-solicitudes"
          element={
            <ProtectedRoute roles={["MOD"]}>
              <RevisionSolicitudesSocioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitudes-socios"
          element={
            <ProtectedRoute roles={["MOD"]}>
              <RevisionSolicitudesSocioPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorias"
          element={
            <ProtectedRoute roles={["MOD"]}>
              <GestionCategoriasPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-reportes"
          element={
            <ProtectedRoute roles={["MOD"]}>
              <DashboardReportesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/gestionar-reportes"
          element={
            <ProtectedRoute roles={["MOD"]}>
              <DashboardReportesPage />
            </ProtectedRoute>
          }
        />

        {/* ── RUTAS DE ADMIN ── */}
        <Route
          path="/admin/crear-cuentas"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <CrearCuentasAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminUsuariosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ver-logs"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminReportesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/eliminaciones"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminEliminacionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notificaciones-mantenimiento"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <MantenimientoPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enviar-notificacion"
          element={
            <ProtectedRoute roles={["ADMIN", "MOD"]}>
              <EnviarNotificacionPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Error404Page />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
