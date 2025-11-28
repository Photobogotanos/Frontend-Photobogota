import { useEffect, useState } from "react";

const SelectorGif = ({ alSeleccionar }) => {
  const [gifs, setGifs] = useState([]);

  useEffect(() => {
    fetch("https://g.tenor.com/v1/trending?key=LIVDSRZULELA&limit=15")
      .then(res => res.json())
      .then(datos => setGifs(datos.results || []))
      .catch(err => console.error("Error cargando GIFs:", err));
  }, []);

  return (
    <div className="selector-gif">
      <div className="cuadricula-gif">
        {gifs.map(g => (
          <img
            key={g.id}
            src={g.media[0].tinygif.url}
            className="miniatura-gif"
            onClick={() => alSeleccionar(g.media[0].tinygif.url)}
            alt="gif"
          />
        ))}
      </div>
    </div>
  );
};

export default SelectorGif;