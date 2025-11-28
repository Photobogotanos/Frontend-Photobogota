import ItemComentario from "./ItemComentario";

const comentariosMock = {
  1: [
    { id: 1, usuario: "Camila Paez", texto: "Soto como siempre el más lindo 😍", tiempo: "3h", avatar: "/images/users/fotouserdemo.jpg" },
    { id: 2, usuario: "Yanpol", texto: "El soto paput", tiempo: "2h", avatar: "/images/users/fotouserdemo2.jpg" }
  ],
  2: [
    { id: 3, usuario: "Pedro López", texto: "Qué hermosas fotos! 📸", tiempo: "3h", avatar: "/images/users/fotouserdemo3.jpg" },
    { id: 4, usuario: "Laura Silva", texto: "Me encanta ese lugar!", tiempo: "2h", avatar: "/images/users/fotouserdemo4.jpg" }
  ],
  3: [
    { id: 5, usuario: "Diego Torres", texto: "Vamos! 🔥", tiempo: "5h", avatar: "/images/users/fotouserdemo.jpg" }
  ],
  4: [
    { id: 6, usuario: "Sofia Ramírez", texto: "Necesito ir ahí!", tiempo: "7h", avatar: "/images/users/fotouserdemo2.jpg" },
    { id: 7, usuario: "Juan Castro", texto: "Impresionante!", tiempo: "6h", avatar: "/images/users/fotouserdemo3.jpg" }
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