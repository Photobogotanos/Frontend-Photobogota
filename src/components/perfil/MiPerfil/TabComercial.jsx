import { FaInfoCircle, FaTimes } from "react-icons/fa";

const TabComercial = () => (
  <div className="no-contenido no-contenido-socio">
    <div className="empty-icon" style={{ color: "#e65100" }}>
      <FaInfoCircle size={48} />
    </div>
    <h4 style={{ color: "#e65100" }}>Información comercial</h4>
    <p>
      No hay información comercial disponible para este socio. Cuando
      el negocio comparta datos de contacto, horarios o certificaciones,
      aparecerán en esta sección.
    </p>
    <div
      className="perfil-comercial-empty-rows"
      style={{ width: "100%", marginTop: 12 }}
    >
      <div
        className="perfil-comercial-empty-row"
        style={{ opacity: 0.5, marginBottom: 8 }}
      >
        <FaTimes style={{ marginRight: 8 }} /> Sin horarios públicos
      </div>
      <div
        className="perfil-comercial-empty-row"
        style={{ opacity: 0.5, marginBottom: 8 }}
      >
        <FaTimes style={{ marginRight: 8 }} /> Sin certificaciones
      </div>
    </div>
  </div>
);

export default TabComercial;
