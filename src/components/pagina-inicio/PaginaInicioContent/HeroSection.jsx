import { LazyMotion, m, domAnimation } from "framer-motion";

import paginaInicioMain from '/images/img-home/pagina-inicio-main.jpg?url';

const fotoPrincipal = paginaInicioMain;

export default function HeroSection() {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pg-inicio-hero"
      >
        <img src={fotoPrincipal} alt="Bogotá desde las alturas" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <m.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            PhotoBogotá
          </m.h1>
          <m.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            Un espacio para compartir miradas fotográficas y redescubrir Bogotá
            desde diferentes perspectivas
          </m.p>
        </div>
      </m.div>
    </LazyMotion>
  );
}