import { FaStar, FaRegStar } from "react-icons/fa";

// Una estrella individual — interactiva o de solo lectura
const StarItem = ({ starValue, isFilled, isInteractive, onSelect, onHover, onLeave }) => (
  <span
    className={`star ${isInteractive ? "interactive" : ""}`}
    onClick={isInteractive ? () => onSelect(starValue) : undefined}
    onKeyDown={
      isInteractive
        ? (e) => { if (e.key === "Enter" || e.key === " ") onSelect(starValue); }
        : undefined
    }
    onMouseEnter={isInteractive ? () => onHover(starValue) : undefined}
    onMouseLeave={isInteractive ? onLeave : undefined}
    role={isInteractive ? "button" : undefined}
    tabIndex={isInteractive ? 0 : -1}
    aria-label={isInteractive ? `Calificar con ${starValue} estrellas` : undefined}
  >
    {isFilled ? <FaStar className="star-filled" /> : <FaRegStar className="star-empty" />}
  </span>
);

export default StarItem;