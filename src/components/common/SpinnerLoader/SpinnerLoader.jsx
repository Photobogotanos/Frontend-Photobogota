import Lottie from "lottie-react";
import LoadingAnimation from "@/assets/animations/Loading.json";
import "./SpinnerLoader.css";

function SpinnerLoader({ texto = "Cargando..." }) {
  return (
    <div className="spinner-loader-container">
      <Lottie
        animationData={LoadingAnimation}
        loop={true}
        className="spinner-loader-animation"
      />
      {texto && <span className="spinner-loader-text">{texto}</span>}
    </div>
  );
}

export default SpinnerLoader;
