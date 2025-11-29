import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaInicioPage from './pages/PaginaInicioPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SolicitudSocioPage from './pages/SolicitudSocioPage.jsx';
import CreacionDeCuentaPage from './pages/CreacionDeCuentaPage.jsx';
import RecuperarContraPage from './pages/RecuperarContraPage.jsx';
import MenuSuperior from "./components/MenuSuperior";
import ComunidadPage from './pages/ComunidadPage.jsx';
import Footer from './components/Footer.jsx';
import MiPerfil from './components/MiPerfil.jsx';
import Nosotros from './pages/Nosotros.jsx';
import Mapa from './components/MapaContent.jsx';

function App() {

  return (
    <BrowserRouter>

      <MenuSuperior />

      <Routes>
        <Route path="/" element={<PaginaInicioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/creacion-cuenta" element={<CreacionDeCuentaPage />} />
        <Route path="/solicitud-socio" element={<SolicitudSocioPage />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContraPage />} />
        <Route path="/comunidad" element={<ComunidadPage />} />
        <Route path="/perfil" element={<MiPerfil />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/crear-publicacion" element={<div>Página de Crear Publicación (en construcción)</div>} />
        <Route path="/notificaciones" element={<div>Página de Notificaciones (en construcción)</div>} />
        <Route path="/nosotros" element={<Nosotros />} />
      </Routes>

      <Footer />

    </BrowserRouter>
  )
}

export default App
