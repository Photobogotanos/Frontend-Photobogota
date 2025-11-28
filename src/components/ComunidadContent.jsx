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
    imagenes: ["/images/fotodemo3.jpg"],
    meGustas: 245,
    comentarios: 2,
    texto: "Acá parchando, la locura es solo un placer que solo los locos conocen. No me molesten Guau Guauu",
    avatar: "/images/users/fotouserdemo1.jpg"
  },
  {
    id: 2,
    usuario: "Danfel",
    nombreUsuario: "danfel_fr",
    tiempo: "4h",
    etiqueta: "Norte",
    imagenes: ["/images/fotodemo1.jpg", "/images/fotodemo2.jpg"],
    meGustas: 189,
    comentarios: 2,
    texto: "Hola papuss",
    avatar: "/images/users/fotouserdemo2.jpg"
  },
  {
    id: 3,
    usuario: "Carlos Ruiz",
    nombreUsuario: "@carlitos_r",
    tiempo: "6h",
    etiqueta: "Sur",
    imagenes: ["/images/fotodemo4.jpg"],
    meGustas: 312,
    comentarios: 2,
    texto: "Nueva aventura comenzada! 🚀 Quien se une?",
    avatar: "/images/users/fotouserdemo3.jpg"
  },
  {
    id: 4,
    usuario: "Ana Martínez",
    nombreUsuario: "@anita.m",
    tiempo: "8h",
    etiqueta: "Chapinero",
    imagenes: ["/images/fotodemo5.jpg", "/images/fotodemo6.jpg", "/images/fotodemo7.jpg"],
    meGustas: 421,
    comentarios: 2,
    texto: "Recorrido por la ciudad, cada rincón tiene su magia ✨",
    avatar: "/images/users/fotouserdemo4.jpg"
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

  return (
    <div className="container py-3">
      {publicaciones.map(pub => (
        <PublicacionFeed 
          key={pub.id} 
          publicacion={pub}
          alToggleMeGusta={manejarToggleMeGusta}
        />
      ))}
    </div>
  );
};

export default ComunidadContent;