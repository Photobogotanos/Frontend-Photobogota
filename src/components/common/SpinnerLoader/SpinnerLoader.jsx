// Importamos TODO el módulo de lottie-react como namespace (no solo el default).
// Esto es necesario porque Vite 8 tiene un bug de interoperabilidad CJS/ESM
// que rompe el import por defecto normal: `import Lottie from "lottie-react"`
import * as LottieModule from "lottie-react";

// Import normal de la animación JSON (esto nunca fue el problema)
import LoadingAnimation from "@/assets/animations/Loading.json";

// Import normal de los estilos
import "./SpinnerLoader.css";

// Extraemos el componente Lottie real desde el objeto "doble-envuelto".
// Por el bug de empaquetado, la estructura que llega es:
//   LottieModule.default = { __esModule: true, default: <- el componente real está aquí, useLottie, useLottieInteractivity }
// Por eso hay que bajar dos niveles: .default.default
//
// El operador ?. (optional chaining) evita que explote si algún nivel no existe.
// El operador ?? (nullish coalescing) da alternativas por si la estructura cambia:
//   1) Intenta LottieModule.default.default (el caso real, según el diagnóstico)
//   2) Si no existe, prueba LottieModule.default
//   3) Si tampoco, usa LottieModule directo
const Lottie = LottieModule.default?.default ?? LottieModule.default ?? LottieModule;

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