import { FaBullhorn } from "react-icons/fa";

const TabPromociones = ({ esPerfilPropio }) => (
  <div className="no-contenido no-contenido-socio">
    <div className="empty-icon" style={{ color: "#e65100" }}>
      <FaBullhorn size={48} />
    </div>
    <h4 style={{ color: "#e65100" }}>Promociones</h4>
    <p>
      {esPerfilPropio
        ? "Crea y gestiona promociones para atraer más visitantes a tus locales."
        : "Sin promociones activas en este momento."}
    </p>
    {esPerfilPropio && (
      <button
        className="btn-explorar"
        style={{ background: "#e65100" }}
        type="button"
        onClick={() => {
          window.location.href = "/locales";
        }}
      >
        Crear promoción
      </button>
    )}
  </div>
);

export default TabPromociones;
