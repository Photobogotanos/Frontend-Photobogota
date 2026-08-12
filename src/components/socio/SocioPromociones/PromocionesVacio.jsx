import { BsMailbox } from "react-icons/bs";

export default function PromocionesVacio() {
  return (
    <div className="no-resultados">
      <div className="no-resultados-icon">
        <BsMailbox />
      </div>
      <h3>No se encontraron promociones</h3>
      <p>No hay promociones con el filtro seleccionado.</p>
    </div>
  );
}