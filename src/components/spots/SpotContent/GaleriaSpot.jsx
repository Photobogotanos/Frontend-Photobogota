import { useState } from "react";
import {
  LazyMotion,
  m,
  domAnimation,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FaImages, FaMapMarkerAlt } from "react-icons/fa";
import LottieImport from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";
const Lottie = LottieImport?.default ?? LottieImport;
const GaleriaSpot = ({
  imagenes,
  spotNombre,
  spotDireccion,
  onAbrirImagen,
}) => {
  const [errorImagen, setErrorImagen] = useState(false);

  const { scrollY } = useScroll();
  const escalaImagen = useSpring(useTransform(scrollY, [0, 900], [1, 1.08]), {
    stiffness: 120,
    damping: 30,
  });
  const opacidadCaption = useTransform(scrollY, [0, 420], [1, 0]);

  const imagenPrincipal = imagenes[0];
  const sinImagen = !imagenPrincipal || errorImagen;

  return (
    <div className="lugar-imagen-principal">
      {sinImagen ? (
        <div className="lugar-imagen-fallback">
          <Lottie
            animationData={uploadAnimation}
            loop
            style={{ width: 160, height: 160 }}
          />
          <span>Sin imagen</span>
        </div>
      ) : (
        <LazyMotion features={domAnimation}>
          <m.button
            type="button"
            className="lugar-imagen-hero"
            onClick={() => onAbrirImagen(0)}
            aria-label={`Ver imagen de ${spotNombre}`}
          >
            <m.img
              src={imagenPrincipal.src}
              alt={imagenPrincipal.alt}
              style={{ scale: escalaImagen }}
              onError={() => setErrorImagen(true)}
            />
          </m.button>

          <m.div
            className="lugar-hero-caption"
            style={{ opacity: opacidadCaption }}
          >
            <span className="lugar-hero-nombre">{spotNombre}</span>
            {spotDireccion && (
              <span className="lugar-hero-direccion">
                <FaMapMarkerAlt className="lugar-hero-direccion-icon" />
                {spotDireccion}
              </span>
            )}
            {imagenes.length > 1 && (
              <span className="lugar-galeria-badge">
                <FaImages />
                {imagenes.length} fotos
              </span>
            )}
          </m.div>
        </LazyMotion>
      )}
    </div>
  );
};

export default GaleriaSpot;
