import "./PaginaInicioContent.css";
import { useState, useCallback } from "react";

import HeroSection from "./HeroSection";
import InspoSection from "./InspoSection";
import ReviewsSection from "./ReviewsSection";
import TopSpotsSection from "./TopSpotsSection";
import GuiaMapaSection from "./GuiaMapaSection";
import ImageModal from "./ImageModal";
import LoginPromptModal from "./LoginPromptModal";

export default function PaginaInicioContent() {
  const [showModal, setShowModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleImageClick = useCallback((img, titulo = "") => {
    setSelectedImg(img);
    setSelectedTitle(titulo);
    setShowModal(true);
  }, []);

  const closeImageModal = useCallback(() => setShowModal(false), []);
  const closeLoginPrompt = useCallback(() => setShowLoginPrompt(false), []);
  const openLoginPrompt = useCallback(() => setShowLoginPrompt(true), []);

  return (
    <div className="pg-inicio-total">
      <HeroSection />

      <div className="pg-inicio-body">
        <InspoSection onImageClick={handleImageClick} />
        <ReviewsSection />
        <TopSpotsSection onImageClick={handleImageClick} />
        <GuiaMapaSection onMarkerClick={openLoginPrompt} />
      </div>

      <ImageModal
        show={showModal}
        onHide={closeImageModal}
        imgSrc={selectedImg}
        titulo={selectedTitle}
      />

      <LoginPromptModal show={showLoginPrompt} onHide={closeLoginPrompt} />
    </div>
  );
}
