import { useState } from "react";
import "./ComunidadContent.css";
import PublicacionFeed from "./PublicacionFeed";

const publicacionesIniciales = [
  {
    id: 1,
    usuario: "Sebastian Sotomayor",
    nombreUsuario: "@sebass.ye",
    tiempo: "2h",
    etiqueta: "Centro",
    imagenes: ["/images/publicaciones/fotodemo4.jpg", "/images/publicaciones/fotodemo1.jpg"],
    meGustas: 245,
    comentarios: 2,
    texto: "Acá parchando, la locura es solo un placer que solo los locos conocen. No me molesten Guau Guauu",
    avatar: "/images/user-pfp/fotouserdemo1.jpg",
    meGustaDado: false,
    guardado: false
  },
  {
    id: 2,
    usuario: "Danfel",
    nombreUsuario: "danfel_fr",
    tiempo: "4h",
    etiqueta: "Centro",
    imagenes: ["/images/publicaciones/fotodemo2.jpg", "/images/publicaciones/fotodemo8.jpg", "/images/publicaciones/fotodemo9.jpg"],
    meGustas: 189,
    comentarios: 2,
    texto: "Hola papuss",
    avatar: "/images/user-pfp/fotouserdemo2.jpg",
    meGustaDado: false,
    guardado: false
  },
  {
    id: 3,
    usuario: "Sebastian Romero",
    nombreUsuario: "@sxbxxs.r",
    tiempo: "6h",
    etiqueta: "Noroccidente",
    imagenes: ["/images/publicaciones/fotodemo6.jpg", "/images/publicaciones/fotodemo5.jpg", "/images/publicaciones/fotodemo10.jpg"],
    meGustas: 312,
    comentarios: 2,
    texto: "Holii, qn pa salchipapa?",
    avatar: "/images/users/fotouserdemo3.jpg",
    meGustaDado: false,
    guardado: false
  },
  {
    id: 4,
    usuario: "Yanpol",
    nombreUsuario: "@void0bits",
    tiempo: "6h",
    etiqueta: "Chapinero",
    imagenes: ["/images/publicaciones/fotodemo11.jpg", "/images/publicaciones/fotodemo12.jpg"],
    meGustas: 400,
    comentarios: 2,
    texto: "Do de la mañana en el clu'",
    avatar: "/images/users/fotouserdemo3.jpg",
    meGustaDado: false,
    guardado: false
  }
];

const ComunidadContent = () => {
  const [publicaciones, setPublicaciones] = useState(publicacionesIniciales);

  const manejarToggleMeGusta = (idPublicacion) => {
    setPublicaciones(publicaciones.map(pub => {
      if (pub.id === idPublicacion) {
        return {
          ...pub,
          meGustaDado: !pub.meGustaDado,
          meGustas: pub.meGustaDado ? pub.meGustas - 1 : pub.meGustas + 1
        };
      }
      return pub;
    }));
  };

  const manejarToggleGuardar = (idPublicacion) => {
    setPublicaciones(publicaciones.map(pub => {
      if (pub.id === idPublicacion) {
        return {
          ...pub,
          guardado: !pub.guardado
        };
      }
      return pub;
    }));
  };

  return (
    <div className="container-fluid px-0 px-md-3">
      <div className="feed-container">
        {publicaciones.map(pub => (
          <PublicacionFeed
            key={pub.id}
            publicacion={pub}
            alToggleMeGusta={manejarToggleMeGusta}
            alToggleGuardar={manejarToggleGuardar}
          />
        ))}
      </div>
    </div>
  );
};

export default ComunidadContent;