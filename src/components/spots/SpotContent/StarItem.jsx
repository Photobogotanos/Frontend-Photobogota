import { FaStar, FaRegStar } from "react-icons/fa";

const StarItem = ({ 
  starValue, 
  isFilled, 
  isInteractive, 
  onSelect, 
  onHover, 
  onLeave 
}) => {
  
  if (!isInteractive) {
    return (
      <span className="star" aria-hidden="true">
        {isFilled ? <FaStar /> : <FaRegStar />}
      </span>
    );
  }
  
  return (
    <button
      type="button"
      className={`star interactive ${isFilled ? "filled" : "empty"}`}
      onClick={() => onSelect(starValue)}
      onMouseEnter={() => onHover(starValue)}
      onMouseLeave={onLeave}
      aria-label={`Calificar con ${starValue} estrellas`}
    >
      {isFilled ? <FaStar /> : <FaRegStar />}
    </button>
  );
};

export default StarItem;