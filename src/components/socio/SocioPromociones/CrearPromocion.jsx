




const promoFormReducer = (state, action) =>{
    switch (action.type){
        case "SET_IMAGENES": return { ...state, imagenes: action.playload };
        case "SET_PREVIEWS": return { ...state, previews: action.playload };
        case "SET_INDICE_IMAGEN": return { ...state, indiceImagenActual: action.playload };
        case "SET_TITULO_PROMO": return { ...state, tituloPromo: action.playload };
        case "SET_DIRECCION": return  { ...state, direccion: action.playload };
        case "SET_DESCRIPCION": return { ...state, tituloPromo: action.playload };
        case "SET_ESTADO": return { ...state, estado: action.playload };
        case "SET_FECHA_INICIO": return { ...state, fechaInicio: action.playload };
        case "SET_FECHA_FIN": return { ...state, fechaFin: action.playload };
        case "SET_SHOW_MODAL": return { ...state,showModal: action.playload };
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

return (
    <div className="pb-5">

    </div>
)