import { FaEye, FaPaperPlane } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";

export default function PromoBotones({ onPreview, onPublish }) {
  return (
    <div className="botones-contenedor mt-3">
      <BackButton />
      <button type="button" className="spot-btn-preview" onClick={onPreview}>
        <FaEye /> Vista previa
      </button>
      <button type="button" className="spot-btn-publish" onClick={onPublish}>
        <FaPaperPlane /> Publicar
      </button>
    </div>
  );
}
