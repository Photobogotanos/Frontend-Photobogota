import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const PaginacionUsuarios = ({ paginacion, onCambiarPagina }) => {
  if (paginacion.totalPaginas <= 1) return null;

  return (
    <div className="paginacion">
      <button
        type="button"
        className="page-btn"
        disabled={paginacion.pagina === 0}
        onClick={() => onCambiarPagina(paginacion.pagina - 1)}
        aria-label="Página anterior"
      >
        <FaChevronLeft />
      </button>
      <span className="page-info">
        {paginacion.pagina + 1} de {paginacion.totalPaginas}
      </span>
      <button
        type="button"
        className="page-btn"
        disabled={paginacion.pagina >= paginacion.totalPaginas - 1}
        onClick={() => onCambiarPagina(paginacion.pagina + 1)}
        aria-label="Página siguiente"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default PaginacionUsuarios;
