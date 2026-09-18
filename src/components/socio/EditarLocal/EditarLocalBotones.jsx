import { FaEye, FaSave } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";

export default function EditarLocalBotones({ onPreview, onGuardar, cargando }) {
  return (
    <div className="botones-contenedor mt-3">
      <BackButton />
      <button
        type="button"
        className="spot-btn-preview"
        onClick={onPreview}
      >
        <FaEye /> Previsualizar
      </button>
      <button
        type="button"
        className="spot-btn-publish"
        onClick={onGuardar}
        disabled={cargando}
      >
        <FaSave /> {cargando ? "Guardando..." : "Guardar cambios"}
      </button>
    </div>
  );
}