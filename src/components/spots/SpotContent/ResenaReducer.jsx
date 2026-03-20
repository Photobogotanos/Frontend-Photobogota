// Estado inicial del reducer de reseñas
export const initialResenaState = {
  nuevaResena: { rating: 0, comentario: "" }, // datos del formulario
  hoverRating: 0,                             // estrella sobrevolada con el mouse
  respuestaActiva: null,                      // ID de la reseña en respuesta activa
  respuestas: {},                             // { resenaId: { respuesta, fecha, creador } }
};

// Reducer que agrupa los 5 useState relacionados con reseñas
export function resenaReducer(state, action) {
  switch (action.type) {
    case "SET_RATING":
      return { ...state, nuevaResena: { ...state.nuevaResena, rating: action.payload } };
    case "SET_COMENTARIO":
      return { ...state, nuevaResena: { ...state.nuevaResena, comentario: action.payload } };
    case "SET_HOVER":
      return { ...state, hoverRating: action.payload };
    case "RESET_FORM":
      return { ...state, nuevaResena: { rating: 0, comentario: "" }, hoverRating: 0 };
    case "SET_RESPUESTA_ACTIVA":
      return { ...state, respuestaActiva: action.payload };
    case "ADD_RESPUESTA":
      return {
        ...state,
        respuestas: { ...state.respuestas, [action.resenaId]: action.payload },
        respuestaActiva: null,
      };
    default:
      return state;
  }
}