import { useNavigate } from "react-router-dom";

const SinContenido = ({ icono, titulo, descripcion, textBoton, rutaBoton }) => {
  const navigate = useNavigate();
  return (
    <div className="no-contenido">
      <div className="empty-icon">{icono}</div>
      <h4>{titulo}</h4>
      <p>{descripcion}</p>
      {textBoton && rutaBoton && (
        <button type="button" className="btn-explorar" onClick={() => navigate(rutaBoton)}>
          {textBoton}
        </button>
      )}
    </div>
  );
};

export default SinContenido;
