// ============================================================
// COMPONENTE HIJO: BotonesAccion
// Su responsabilidad: mostrar los botones de Cancelar y Guardar.
//
// NOTA IMPORTANTE sobre el botón Guardar:
// Es type="submit". Eso significa que cuando se presiona,
// automáticamente dispara el onSubmit del <Form> que está
// en el padre (EditarPerfilModal). No necesita ninguna función
// extra, Bootstrap/HTML lo maneja solo.
// ============================================================

import { FaSave } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

// Recibe 1 prop:
//   onCancelar → función del padre (es onHide) para cerrar el modal
export default function BotonesAccion({ onCancelar }) {
  return (
    <div className="modal-actions">

      {/* Al hacer click llama a onCancelar que viene del padre,
          que a su vez es la función onHide del modal */}
      <button type="button" className="btn-cancelar" onClick={onCancelar}>
        <MdOutlineCancel /> Cancelar
      </button>

      {/* type="submit" → no necesita onClick.
          Al hacer click busca el <Form> más cercano y ejecuta su onSubmit,
          que está definido en EditarPerfilModal como handleSubmit */}
      <button type="submit" className="btn-guardar">
        <FaSave className="icon-test" /> Guardar Cambios
      </button>

    </div>
  );
}
