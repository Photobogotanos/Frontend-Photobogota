import { useReducer, useRef, useState } from "react";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
import "./CrearPromocion.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

import { FaCamera, FaChevronLeft, FaChevronRight, FaTrash } from "react-icons/fa";
import HeaderPromo from "./HeaderPromo";
import { div } from "framer-motion/client";

const promoFormReducer = (state, action) =>{
    switch (action.type){
        case "SET_IMAGENES": return { ...state, imagenes: action.playload };
        case "SET_PREVIEWS": return { ...state, previews: action.playload };
        case "SET_INDICE_IMAGEN": return { ...state, indiceImagenActual: action.playload };
        case "SET_TITULO_PROMO": return { ...state, tituloPromo: action.playload };
        case "SET_DIRECCION": return  { ...state, direccion: action.playload };
        case "SET_DESCRIPCION_PROMO": return { ...state, descripcionPromo: action.playload };
        case "SET_ESTADO": return { ...state, estado: action.playload };
        case "SET_FECHA_INICIO": return { ...state, fechaInicio: action.playload };
        case "SET_FECHA_FIN": return { ...state, fechaFin: action.playload };
        case "SET_SHOW_MODAL": return { ...state,showModal: action.playload };
    }   
};

const initialState = {
    imagenes: [], previews: [], indiceImagenActual: 0,
    tituloPromo: "", direccion: "", descripcionPromo: "",
    estado: null, fechaInicio: null, fechaFin: null,
    showModal: false,
};

function ImageUploader({ previews, onImageChange, onRemove, onNavigate, indice, onSelectIndice }){
  const[isDragging, setIsDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    if (files.length) onImageChange(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length) onImageChange(files);
  };

  const total = previews.length;

  return (
    <div className="uploader-wrapper">
      {total === 0 ?(
        <div
          className={`drop-zone${isDragging ? " dragging" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true);}}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
          aria-label="Subir Imagenes"
        >
          <div className="drop-zone-lottie">
             <Lottie animationData={uploadAnimation} loop style={{ width: 110, height: 110}}/>
          </div>
          <p className="drop-zone-title">Pon las fotos de tu promoción aquí</p>
          <p className="drop-zone-sub">o haz click para seleccionar</p>
          <span className="drop-zone-badge">JPG · PNG · WEBP · múltiples</span>
        </div>
      ) : (
        <div className="uploader-con-imagenes">
          <div
           className="preview-carousel"
           onClick={() => onNavigate("next")}
           role="button"
           tableIndex={0}
           onKeyDown={(e) => e.key === "Enter" && onNavigate("next")}
           aria-label="Avanzar imagen"
          >
            <img
             src={previews[indice]}
             alt={`Previews ${indice + 1}`}
             className="preview-img"
            />
            <span className="preview-counter">{indice + 1} / {total} </span>
            {total > 1 && ( 
              <>
                <button type="button" className="preview-nav prev"
                  onClick={(e) => {e.stopPropagation(); onNavigate("prev"); }}
                  aria-label="Anterior">
                  <FaChevronLeft />
                </button>
                <button type="button" className="preview-nav next"
                  onClick={(e) => {e.stopPropagation(); onNavigate("next"); }}
                  aria-label="Siguiente">
                  <FaChevronRight/>
                </button>
              </>
            )}
            <button type="button" className="preview-remove"
              onClick={(e) => { e.stopPropagation(); onRemove(indice);}}
              aria-label="Eliminar imagen">
              <FaTrash/>
            </button>
        </div>

        {/* ── Tira de thumbnails ── */}
        <div className="thumbnails-strip">
          {previews.map((src, idx) => (
            <div 
             key={src}
             className={`thumnail-item${idx === indice ? " active" : ""}`}
             onClick={() => onSelectIndice(idx)}
             role="button"
             tabIndex={0}
             onKeyDown={(e) => e.key === "Enter" && onSelectIndice(idx)}
             aria-label={`Ver imagen ${idx + 1}`} 
            >
              <img src={src} alt={`Thumb ${idx + 1}`} />
              <button 
                type="button"
                className="thumb-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(idx);}}
                aria-label={`Eliminar imagen ${idx + 1}`}
              >
                ×
              </button>
            </div>
          ))}

          {/* Botón agregar más */}
          <div 
           className="thumbnail-add"
           onClick={() => inputRef.current.click()}
           role="button"
           tabIndex={0}
           onKeyDown={(e) => e.key === "Enter" && inputRef.current.click()}
           aria-label="Agregar más fotos"
          >
            <span className="thumbnail-add-icon">+</span>
            <span className="thumbnail-add-text">Añañiiir</span>
          </div>
         </div>
       </div>
      )}
      
      <input 
       ref={inputRef}
       type="file"
       accept="image/"
       multiple
       style={{ display: "none" }}
       onChange={handleFileInput}
      />
    </div>
  );
}

//-- Componente principal --------------------------------------------
export default function CrearPromocion(){
    const[state, dispatch] = useReducer(promoFormReducer, initialState);

    const handleImagen = (files) =>{
        const newPreviews = files.map((f) => URL.createObjectURL(f));
        dispatch({ type: "SET_IMAGENES", playload: [...state.imagenes, ...files]});
        dispatch({ type: "SET_PREVIEWS", playload: [...state.previews, ...newPreviews] })
        dispatch({ type: "SET_INDICE_IMAGEN", playload: 0});
        
    };

    const handleRemoveImagen = (idx) => {
        const newImagenes = state.imagenes.filter((_, i) => i !== idx);
        const newPreviews = state.previews.filter((_, i) => i !== idx);
        dispatch({ type: "SET_IMAGENES", playload: newImagenes});
        dispatch({ type: "SET_PREVIEWS", playload: newPreviews});
        const nuevoIdx = Math.min(state.indiceImagenActual, newPreviews.length - 1);
        dispatch({ type: "SET_INDICE_IMAGEN", playload: Math.max(0, nuevoIdx) });
    };

    const handleNavigate = (dir) => {
        const total = state.previews.length;
        const next = dir === "next"
          ? (state.indiceImagenActual + 1) % total
          : (state.indiceImagenActual - 1 + total) % total;
        dispatch ({ type: "SET_INDICE_IMAGEN", playload: next});
    };

    const promoData = {
      titulo: state.nombreLugar || "Nombre del lugar",
      direccion: state.direccion || "Dirección del lugar",
      imagen: state.previews[0] || null,
      rating: 0, totalResenas: 0,
      categoria: state.categoria?.label || "Categoría",
      localidad: state.localidad?.label || null,
      descripcion: state.descripcionImagen || "Descripción del lugar...",
      recomendacion: state.recomendacion || null,
      tipsFoto: state.tipsFoto || null,
      resenas: [],
    };

    return(
        <div className="pb-5">
            <div className="formulario-contenedor">

                {/* Header  */}
                <HeaderPromo/>

                <Row className="g-4">
                    <Col xs={12}>
                      {/* Uploader */}
                      <label className="promo-label mb-2" htmlFor="foto-promocion" >
                        <FaCamera className="me-2" />
                        Foto de la promoción <RequiredMark />
                      </label>
                      <ImageUploader
                       previews={state.previews}
                       indice={state.indiceImagenActual}
                       onImageChange={handleImagen}
                       onRemove={handleRemoveImagen}
                       onNavigate={handleNavigate}
                       onSelectIndice={(idx) => dispatch({ type : "SET_INDICE_IMAGEN", payload: idx })}
                      />
                      


                    </Col>
                </Row>
            </div>
        </div>
    )
}



// }

// function ImageUploader({ previews, onImageChange, onRemove, onNavigate, indice, onSelectIndice})
//     const [isDragging, setIsDragging] = useState(false);
//     const inputRef= useRef();
    
//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
//         if (files.length) onImageChange(files);
//     };


//     const handleFileInput = (e) => {
//         const files = Array.from(e.target.files);
//         if (files.length) onImageChange(files);
//     };

//     const total = previews.length;

// // Componente principal

// export default function CrearPromocion(){
// const [state, dispatch] = useReducer(spotFormReducer, initialState);

// const handleImagen = (files) => {
//     const newPreviews = files.map((f))
// } 
// }