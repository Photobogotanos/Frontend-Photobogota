import { FaCamera } from "react-icons/fa";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";
import ImageUploader from "./ImageUploader";

export default function SeccionImagenes({
  previews,
  indice,
  onImageChange,
  onRemove,
  onNavigate,
  onSelectIndice,
}) {
  return (
    <>
      <label className="spot-label mb-2" htmlFor="foto-lugar">
        <FaCamera className="me-2" />
        Foto del lugar <RequiredMark />
      </label>
      <ImageUploader
        previews={previews}
        indice={indice}
        onImageChange={onImageChange}
        onRemove={onRemove}
        onNavigate={onNavigate}
        onSelectIndice={onSelectIndice}
      />
    </>
  );
}
