import { FaEye, FaPaperPlane } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";

export default function PromoBotones({ onPreview, onPublish }) {
  return (
    <div className="botones-contenedor mt-3">
      <BackButton />
      <button className="btn btn-outline-primary me-2" onClick={onPreview}>
        <FaEye /> Vista previa
      </button>
      <button className="btn btn-primary" onClick={onPublish}>
        <FaPaperPlane /> Publicar
      </button>
    </div>
  );
}
