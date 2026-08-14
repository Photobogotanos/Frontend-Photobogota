import { LazyMotion, m, domAnimation, useScroll, useSpring, useTransform } from "framer-motion";
import paginaInicioMain from "/images/img-home/pagina-inicio-main.webp?url";

const fotoPrincipal = paginaInicioMain;

export default function HeroSection() {
  const { scrollY } = useScroll();
  const escalaImagen = useSpring(
    useTransform(scrollY, [0, 700], [1, 1.12]),
    { stiffness: 100, damping: 28 }
  );
  const opacidadContent = useTransform(scrollY, [0, 420], [1, 0]);
  const yContent = useTransform(scrollY, [0, 420], [0, 60]);

  return (
    <LazyMotion features={domAnimation}>
      <section className="pg-inicio-hero" aria-label="Portada PhotoBogotá">
        <m.div className="pg-inicio-hero-media" style={{ scale: escalaImagen }}>
          <img
            src={fotoPrincipal}
            alt="Bogotá desde las alturas al atardecer"
            width={1920}
            height={1080}
            decoding="async"
            fetchPriority="high"
            className="pg-inicio-hero-img"
          />
        </m.div>

        <div className="pg-inicio-hero-overlay" aria-hidden="true" />

        <m.div
          className="pg-inicio-hero-content"
          style={{ opacity: opacidadContent, y: yContent }}
        >
          <m.span
            className="pg-inicio-hero-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
          >
            Comunidad fotográfica de Bogotá
          </m.span>

          <m.h1
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            PhotoBogotá
          </m.h1>

          <m.p
            initial={{ y: 36, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Un espacio para compartir miradas fotográficas y redescubrir Bogotá
            desde diferentes perspectivas
          </m.p>

        </m.div>

        <div className="pg-inicio-hero-scroll" aria-hidden="true">
          <span />
        </div>
      </section>
    </LazyMotion>
  );
}
