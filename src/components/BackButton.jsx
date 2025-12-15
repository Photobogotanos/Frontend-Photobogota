import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import "./BackButton.css";

function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="back-button-container text-center mt-3">
      <button className="back-button" onClick={() => navigate("/")}>
        <IoArrowBack /> Atrás
      </button>
    </div>
  );
}

export default BackButton;