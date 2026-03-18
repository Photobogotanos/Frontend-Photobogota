import { m, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function TeamCarousel({ images, currentSlide, onNext, onPrev, onGoTo }) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="carousel-container"
    >
      <div className="carousel-wrapper">
        <AnimatePresence mode="sync">
          <m.div
            key={currentSlide}
            className="carousel-slide"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <img
              src={images[currentSlide].src}
              alt={images[currentSlide].alt}
              className="carousel-image"
            />
            <div className="carousel-overlay"></div>
            <div className="carousel-content">
              <m.h1
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {images[currentSlide].caption}
              </m.h1>
              <m.p
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Conozca un poquito de lo que hay detrás de estos ideales
              </m.p>
            </div>
          </m.div>
        </AnimatePresence>

        <button
          className="carousel-btn carousel-btn-prev"
          onClick={onPrev}
          aria-label="Anterior"
        >
          <FaChevronLeft />
        </button>
        <button
          className="carousel-btn carousel-btn-next"
          onClick={onNext}
          aria-label="Siguiente"
        >
          <FaChevronRight />
        </button>

        <div className="carousel-indicators">
          {images.map((img, idx) => (
            <button
              key={img.alt} 
              className={`indicator ${idx === currentSlide ? "active" : ""}`}
              onClick={() => onGoTo(idx)}
              aria-label={`Ir a imagen ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </m.div>
  );
}