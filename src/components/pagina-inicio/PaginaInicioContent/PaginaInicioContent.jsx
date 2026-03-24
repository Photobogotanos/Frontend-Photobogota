import "./PaginaInicioContent.css";
import { useState } from "react";

import HeroSection from "./HeroSection";
import InspoSection from "./InspoSection";
import ReviewsSection from "./ReviewsSection";
import TopSpotsSection from "./TopSpotsSection";
import GuiaMapaSection from "./GuiaMapaSection";
import ImageModal from "./ImageModal";
import LoginPromptModal from "./LoginPromptModal";

export default function PaginaInicioContent() {
  // Estado del modal de imagen
  const [showModal, setShowModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");

  // Estado del modal de invitación a registrarse
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleImageClick = (img, titulo = "") => {
    setSelectedImg(img);
    setSelectedTitle(titulo);
    setShowModal(true);
  };

  return (
    <div className="pg-inicio-total">

      <HeroSection />

      <InspoSection onImageClick={handleImageClick} />

      <ReviewsSection />

      <TopSpotsSection onImageClick={handleImageClick} />

      <GuiaMapaSection onMarkerClick={() => setShowLoginPrompt(true)} />

      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imgSrc={selectedImg}
        titulo={selectedTitle}
      />

      <LoginPromptModal
        show={showLoginPrompt}
        onHide={() => setShowLoginPrompt(false)}
      />

    </div>
  );
}