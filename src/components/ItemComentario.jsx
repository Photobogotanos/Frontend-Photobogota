import { useState } from "react";

const AVATAR_DEFAULT = "/images/user-pfp/default-avatar.jpg";

const ItemComentario = ({ comentario }) => {
  const [errorAvatar, setErrorAvatar] = useState(false);

  return (
    <div className="d-flex gap-2 mb-3">
      <img
        src={errorAvatar ? AVATAR_DEFAULT : comentario.avatar}
        onError={() => setErrorAvatar(true)}
        width={40}
        height={40}
        className="rounded-circle"
        alt="usuario"
      />
      <div>
        <strong>{comentario.usuario}</strong>
        <div>{comentario.texto}</div>
        <span className="texto-secundario">
          {comentario.tiempo}
        </span>
      </div>
    </div>
  );
};

export default ItemComentario;
