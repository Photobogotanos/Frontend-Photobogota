import { useEffect, useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

const SelectorGif = ({ alSeleccionar }) => {
  const [gifs, setGifs] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);

  const buscarGifs = (query = "trending") => {
    setCargando(true);
    const url = query === "trending" 
      ? "https://g.tenor.com/v1/trending?key=LIVDSRZULELA&limit=20"
      : `https://g.tenor.com/v1/search?q=${query}&key=LIVDSRZULELA&limit=20`;
    
    fetch(url)
      .then(res => res.json())
      .then(datos => {
        setGifs(datos.results || []);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error cargando GIFs:", err);
        setCargando(false);
      });
  };

  useEffect(() => {
    buscarGifs();
  }, []);

  const manejarBusqueda = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      buscarGifs(busqueda.trim());
    }
  };

  const manejarLimpiar = () => {
    setBusqueda("");
    buscarGifs();
  };

  return (
    <div className="selector-gif">
      <form onSubmit={manejarBusqueda} className="buscador-gif">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar GIFs..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={manejarLimpiar}
            >
              <FaTimes />
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={cargando}
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {cargando ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="cuadricula-gif">
          {gifs.map(g => (
            <img
              key={g.id}
              src={g.media[0].tinygif.url}
              className="miniatura-gif"
              onClick={() => alSeleccionar(g.media[0].gif.url)}
              alt="gif"
              title={g.content_description || "GIF"}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectorGif;