import { useRef } from "react";
import {
  LazyMotion,
  m,
  domAnimation,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FaImages, FaCamera } from "react-icons/fa";
import Lottie from "lottie-react";
import uploadAnimation from "@/assets/animations/Upload.json";

const GaleriaSpot = ({ imagenes, spotNombre, onAbrirImagen }) => {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const escalaImagen = useSpring(
    useTransform(scrollYProgress, [0, 1], [1, 1.22]),
    { stiffness: 120, damping: 30 },
  );
  const opacidadHero = useTransform(scrollYProgress, [0, 0.85], [1, 0.1]);

  const imagenPrincipal = imagenes[0];

  return (
    <>
      <div className="lugar-imagen-principal" ref={heroRef}>
        {imagenPrincipal ? (
          <LazyMotion features={domAnimation}>
            <m.button
              type="button"
              className="lugar-imagen-hero"
              style={{ opacity: opacidadHero }}
              onClick={() => onAbrirImagen(0)}
              aria-label={`Ver imagen de ${spotNombre}`}
            >
              <m.img
                src={imagenPrincipal.src}
                alt={imagenPrincipal.alt}
                style={{ scale: escalaImagen }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback =
                    e.currentTarget.parentElement?.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              {imagenes.length > 1 && (
                <span className="lugar-galeria-badge">
                  <FaImages />
                  <span>{imagenes.length} fotos</span>
                </span>
              )}
            </m.button>
          </LazyMotion>
        ) : null}
        <div
          className="lugar-imagen-fallback"
          style={{ display: imagenPrincipal ? "none" : "flex" }}
        >
          <Lottie
            animationData={uploadAnimation}
            loop
            style={{ width: 160, height: 160 }}
          />
          <span>Sin imagen</span>
        </div>
      </div>

      {imagenes.length > 1 && (
        <section
          className="lugar-galeria-scroll"
          aria-label={`Galería de fotos de ${spotNombre}`}
        >
          <header className="lugar-galeria-scroll-head">
            <h2 className="lugar-galeria-titulo">
              <FaImages /> Galería de fotos
            </h2>
            <span className="lugar-galeria-total">
              {imagenes.length} fotos
            </span>
          </header>

          <LazyMotion features={domAnimation}>
            {imagenes.map((imagen, index) => (
              <m.button
                key={`stack-${imagen.src}-${index}`}
                type="button"
                className="lugar-foto-stack"
                style={{ "--stack-offset": `${Math.min(index, 6) * 12}px` }}
                onClick={() => onAbrirImagen(index)}
                aria-label={`Ampliar foto ${index + 1} de ${imagenes.length}`}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <img
                  src={imagen.src}
                  alt={imagen.alt || `${spotNombre} — foto ${index + 1}`}
                  loading="lazy"
                />
                <span className="lugar-foto-counter">
                  {index + 1} / {imagenes.length}
                </span>
                <span className="lugar-foto-caption">
                  <FaCamera /> {spotNombre}
                </span>
              </m.button>
            ))}
          </LazyMotion>
        </section>
      )}
    </>
  );
};

export default GaleriaSpot;
