import { useState, useRef } from "react";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import {
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";

export default function ImageUploader({
  previews,
  onImageChange,
  onRemove,
  onNavigate,
  indice,
  onSelectIndice,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type.startsWith("image/"),
    );
    if (files.length) onImageChange(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onImageChange(files);
  };

  const total = previews.length;

  return (
    <div className="uploader-wrapper">
      {total === 0 ? (
        // Estado sin imágenes - Zona de drop
        <div
          className={`drop-zone${isDragging ? " dragging" : ""}`}
          role="button"
          tabIndex={0}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current.click();
            }
          }}
        >
          <div className="drop-zone-lottie">
            <Lottie
              animationData={uploadAnimation}
              loop
              style={{ width: 110, height: 110 }}
            />
          </div>
          <p className="drop-zone-title">Arrastra tus fotos aquí</p>
          <p className="drop-zone-sub">o haz clic para seleccionar</p>
          <span className="drop-zone-badge">JPG · PNG · WEBP · múltiples</span>
        </div>
      ) : (
        // Estado con imágenes - Carrusel de previews
        <div className="uploader-con-imagenes">
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, react-doctor/no-static-element-interactions */}
          <div
            className="preview-carousel"
            onClick={() => onNavigate("next")}
          >
            <img
              src={previews[indice]}
              alt={`Preview ${indice + 1}`}
              className="preview-img"
            />
            <span className="preview-counter">
              {indice + 1} / {total}
            </span>

            {total > 1 && (
              <>
                <button
                  type="button"
                  className="preview-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("prev");
                  }}
                  aria-label="Anterior"
                >
                  <FaChevronLeft />
                </button>
                <button
                  type="button"
                  className="preview-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("next");
                  }}
                  aria-label="Siguiente"
                >
                  <FaChevronRight />
                </button>
              </>
            )}

            <button
              type="button"
              className="preview-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(indice);
              }}
              aria-label="Eliminar imagen"
            >
              <FaTrash />
            </button>
          </div>

          {/* Miniaturas */}
          <div className="thumbnails-strip">
            {previews.map((src, idx) => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events, react-doctor/no-static-element-interactions
              <div
                key={src}
                className={`thumbnail-item${idx === indice ? " active" : ""}`}
                onClick={() => onSelectIndice(idx)}
              >
                <img src={src} alt={`Thumb ${idx + 1}`} />
                <button
                  type="button"
                  className="thumb-remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(idx);
                  }}
                  aria-label={`Eliminar imagen ${idx + 1}`}
                >
                  ×
                </button>
              </div>
            ))}

            {/* Botón para agregar más imágenes */}
            <button
              type="button"
              className="thumbnail-add"
              onClick={() => inputRef.current.click()}
              aria-label="Añadir imagen"
            >
              <span className="thumbnail-add-icon">+</span>
              <span className="thumbnail-add-text">Añadir</span>
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
    </div>
  );
}
