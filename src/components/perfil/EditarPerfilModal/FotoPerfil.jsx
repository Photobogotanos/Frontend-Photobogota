// ============================================================
// COMPONENTE HIJO: FotoPerfil
// Muestra foto real o inicial de nombreUsuario si no hay / falla.
// ============================================================

import { FaUpload, FaTrash } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { Form } from "react-bootstrap";
import UserAvatar from "@/components/common/UserAvatar/UserAvatar";

const esFotoReal = (url) => {
  if (!url || typeof url !== "string") return false;
  const u = url.trim();
  if (!u) return false;
  if (u.includes("default-avatar")) return false;
  return true;
};

export default function FotoPerfil({
  fotoPerfil,
  onFotoChange,
  onEliminarFoto,
  nombreUsuario = "",
  nombre = "",
}) {
  const fotoSrc = esFotoReal(fotoPerfil) ? fotoPerfil : null;

  return (
    <Form.Group className="mb-4">
      <Form.Label className="form-label-custom">
        <IoMdPhotos /> Cambiar foto
        <span className="file-format">JPG, PNG o GIF (máx. 5MB)</span>
      </Form.Label>

      <div className="foto-perfil-container">
        <div className="foto-preview">
          <UserAvatar
            src={fotoSrc}
            nombreUsuario={nombreUsuario}
            nombre={nombre}
            alt="Foto perfil"
            className="foto-perfil-img"
          />

          <div className="foto-actions">
            <label htmlFor="upload-foto" className="btn-foto-action upload">
              <FaUpload className="me-1" /> Cambiar
            </label>

            <input
              type="file"
              id="upload-foto"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={onFotoChange}
              className="d-none"
            />

            <button
              type="button"
              className="btn-foto-action delete"
              onClick={onEliminarFoto}
              disabled={!fotoSrc}
            >
              <FaTrash className="me-1" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </Form.Group>
  );
}
