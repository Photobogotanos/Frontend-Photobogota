import { FaHeart, FaInfoCircle } from "react-icons/fa";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

function TextAreaField({ label, htmlFor, required, icon, value, onChange, rows, placeholder }) {
  return (
    <div className="mb-3">
      <label className="spot-label" htmlFor={htmlFor}>
        {icon && <span className="me-2">{icon}</span>}
        {label}
        {required && <RequiredMark />}
      </label>
      <textarea
        id={htmlFor}
        className="spot-textarea"
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default function SpotDescripcion({
  descripcionImagen,
  recomendacion,
  tipsFoto,
  onDescripcionChange,
  onRecomendacionChange,
  onTipsFotoChange,
  esSocio
}) {
  return (
    <>
      <TextAreaField
        label={esSocio ? "Descripción de la imagen" : "Descripción del establecimiento"}
        htmlFor="descripcion-imagen"
        required
        value={descripcionImagen}
        onChange={onDescripcionChange}
        rows={2}
        placeholder="Describe lo que se ve en la foto"
      />

      <TextAreaField
        label={esSocio ? "¿Por qué recomiendas este lugar?" : "¿Por qué recomiendas este establecimiento?"}
        htmlFor="recomendacion-lugar"
        required
        icon={<FaHeart />}
        value={recomendacion}
        onChange={onRecomendacionChange}
        rows={3}
        placeholder="Cuéntanos tu experiencia"
      />

      <TextAreaField
        label="Tips de fotografía (opcional)"
        htmlFor="tips-foto"
        icon={<FaInfoCircle />}
        value={tipsFoto}
        onChange={onTipsFotoChange}
        rows={2}
        placeholder="Hora ideal, lente, ángulo, etc."
      />
    </>
  );
}
