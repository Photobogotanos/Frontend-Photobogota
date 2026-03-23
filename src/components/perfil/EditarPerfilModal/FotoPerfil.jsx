// ============================================================
// COMPONENTE HIJO: FotoPerfil
// Su única responsabilidad: mostrar la foto y sus botones.
// No sabe nada del formulario, no tiene estado propio.
// Todo lo que necesita lo recibe por props del padre.
// ============================================================

import { FaUpload, FaTrash } from "react-icons/fa";
import { IoMdPhotos } from "react-icons/io";
import { Form } from "react-bootstrap";

// Recibe 3 props:
//   fotoPerfil    → string con la ruta o base64 de la imagen actual
//   onFotoChange  → función del padre que se llama al elegir archivo
//   onEliminarFoto → función del padre que se llama al presionar Eliminar
export default function FotoPerfil({ fotoPerfil, onFotoChange, onEliminarFoto }) {
  return (
    <Form.Group className="mb-4">
      <Form.Label className="form-label-custom">
        <IoMdPhotos /> Cambiar foto
        <span className="file-format">JPG, PNG o GIF (máx. 5MB)</span>
      </Form.Label>

      <div className="foto-perfil-container">
        <div className="foto-preview">

          {/* Muestra la foto actual. El valor viene del padre via prop */}
          <img src={fotoPerfil} alt="Foto perfil" className="foto-perfil-img" />

          <div className="foto-actions">
            {/* Este label abre el input file al hacer click */}
            <label htmlFor="upload-foto" className="btn-foto-action upload">
              <FaUpload className="me-1" /> Cambiar
            </label>

            {/* Al elegir un archivo, llama a onFotoChange que viene del padre */}
            <input
              type="file"
              id="upload-foto"
              accept=".jpg,.jpeg,.png,.gif"
              onChange={onFotoChange}
              className="d-none"
            />

            {/* Al hacer click, llama a onEliminarFoto que viene del padre */}
            <button
              type="button"
              className="btn-foto-action delete"
              onClick={onEliminarFoto}
            >
              <FaTrash className="me-1" /> Eliminar
            </button>
          </div>
        </div>
      </div>
    </Form.Group>
  );
}