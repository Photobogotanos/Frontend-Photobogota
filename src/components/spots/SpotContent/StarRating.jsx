import StarItem from "./StarItem";

// Renderiza las 5 estrellas usando StarItem
// isInteractive=true = permite al usuario calificar
const StarRating = ({ rating, isInteractive = false, hoverRating = 0, onSelect, onHover, onLeave }) => (
  <>
    {[1, 2, 3, 4, 5].map((starValue) => (
      <StarItem
        key={starValue} 
        starValue={starValue}
        isFilled={starValue <= (isInteractive ? hoverRating || rating : rating)}
        isInteractive={isInteractive}
        onSelect={onSelect}
        onHover={onHover}
        onLeave={onLeave}
      />
    ))}
  </>
);

export default StarRating;