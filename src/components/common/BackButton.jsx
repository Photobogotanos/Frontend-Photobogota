import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "./BackButton.css";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button type="button" className="back-button" onClick={() => navigate(-1)}>
      <IoArrowBack /> Atrás
    </button>
  );
}

export default BackButton;