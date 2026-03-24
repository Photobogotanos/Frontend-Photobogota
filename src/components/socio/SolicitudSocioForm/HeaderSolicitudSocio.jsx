import "./HeaderSolicitudSocio.css";

const HeaderSolicitudSocio = () => {
  return (
    <div className="solicitud-header">
      <span className="solicitud-header-subtitle">Únete a la comunidad</span>
      <h2 className="solicitud-header-title">Solicitud de socio</h2>
      <span className="solicitud-header-line" />
      <p className="solicitud-header-desc">
        Completa todos los campos obligatorios para enviar tu solicitud.
      </p>
    </div>
  );
};

export default HeaderSolicitudSocio;