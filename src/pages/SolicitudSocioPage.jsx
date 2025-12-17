import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolicitudSocioForm from "@/components/socio/SolicitudSocioForm/SolicitudSocioForm";
import Container from 'react-bootstrap/Container';
import './SolicitudSocioPage.css';

const SolicitudSocioPage = () => {
  const navigate = useNavigate();

  // DEPURACIÓN: Descomentae estas líneas para limpiar el localStorage y probar
  //useEffect(() => {
  //  localStorage.removeItem("solicitudSocio");
  //}, []);

  useEffect(() => {

    const solicitudGuardada = localStorage.getItem("solicitudSocio");
    
    if (solicitudGuardada) {
      try {
        const data = JSON.parse(solicitudGuardada);
        navigate("/solicitud-enviada");
      } catch (error) {
        console.error("Error al parsear solicitud:", error);
        localStorage.removeItem("solicitudSocio");
      }
    } 
  }, [navigate]);

  return (
    <div className="solicitud-socio-page mt-5">
      <Container className="mt-3">
        <SolicitudSocioForm />
      </Container>
    </div>
  );
};

export default SolicitudSocioPage;