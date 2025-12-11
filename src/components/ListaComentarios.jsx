import ItemComentario from "./ItemComentario";
import "./ListaComentarios.css";

const comentariosMock = {
  1: [
    { id: 1, usuario: "Camila Paez", texto: "Soto como siempre el más lindo 😍", tiempo: "3h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 2, usuario: "Yanpol", texto: "El soto paput", tiempo: "2h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 8, usuario: "Laura Neira", texto: "Quien es esa pelada", tiempo: "2h", avatar: "/images/user-pfp/fotouserdemo.jpg" }
  ],
  2: [
    { id: 3, usuario: "Pedro López", texto: "Qué hermosas fotos! 📸", tiempo: "3h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 4, usuario: "Laura Silva", texto: "Me encanta ese lugar!", tiempo: "2h", avatar: "/images/user-pfp/fotouserdemo.jpg" }
  ],
  3: [
    { id: 5, usuario: "Sergio Gomez", texto: "Pero invita, pero tiene que aflojar", tiempo: "5h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 10, usuario: "Sebastian Sotomayor", texto: "Nos estan ciclado cohetes🔥", tiempo: "4h", avatar: "/images/user-pfp/fotouserdemo.jpg" }
  ],
  4: [
    { id: 6, usuario: "Camila Sotomayor", texto: "Necesito ir ahí!", tiempo: "7h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 7, usuario: "Karen Rodriguez", texto: "Impresionante!", tiempo: "6h", avatar: "/images/user-pfp/fotouserdemo.jpg" },
    { id: 9, usuario: "Los TC", texto: "Sal de ahi bro!🗣", tiempo: "6h", avatar: "/images/user-pfp/fotouserdemo.jpg" }
  ]
};

const ListaComentarios = ({ idPublicacion }) => {
  const comentarios = comentariosMock[idPublicacion] || [];

  return (
    <div className="mt-3">
      {comentarios.map(c => (
        <ItemComentario key={c.id} comentario={c} />
      ))}
    </div>
  );
};

export default ListaComentarios;