import { FaEye, FaPaperPlane } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";

export default function SpotBotones({ onPreview, onPublish }) {
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
      <button type="button" className="spot-btn-publish" onClick={onPublish}>
        <FaPaperPlane /> Publicar
      </button>
    </div>
  );
}
