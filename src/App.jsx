import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PaginaInicioPage from './pages/PaginaInicioPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SolicitudSocioPage from './pages/SolicitudSocioPage.jsx';
import CreacionDeCuentaPage from './pages/CreacionDeCuentaPage.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<PaginaInicioPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path='/creacion-cuenta' element={<CreacionDeCuentaPage />} />

        <Route path="/solicitud-socio" element={<SolicitudSocioPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
