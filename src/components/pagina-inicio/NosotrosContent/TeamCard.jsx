import { m } from "framer-motion";
import {
  FaInstagram,
  FaLinkedin,
  FaBriefcase,
  FaGraduationCap,
  FaPlay,
  FaPause,
} from "react-icons/fa";

export default function TeamCard({ member, index, flipped, playing, onCardClick, onToggleAudio }) {
  return (
    <m.div
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <div
        className={`team-card-3d ${flipped ? "flipped" : ""}`}
        onClick={onCardClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onCardClick(e);
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ver más información de ${member.name}`}
      >
        <div className="team-card-inner-3d">
          {/* Front */}
          <div className="team-card-front">
            <div className="team-photo-wrapper">
              <img src={member.photo} alt={member.name} className="team-img" />
              <div className="photo-gradient"></div>
            </div>
            <div className="team-front-info">
              <h4 className="team-name">{member.name}</h4>
              <p className="team-role">{member.role}</p>
            </div>
          </div>

          {/* Back */}
          <div className="team-card-back">
            <div className="team-back-content">
              <h4 className="team-name-back">{member.name}</h4>

              <div className="team-info-item">
                <FaGraduationCap size={16} className="info-icon" />
                <p>{member.education}</p>
              </div>

              <div className="team-info-item">
                <FaBriefcase size={16} className="info-icon" />
                <p>{member.expertise}</p>
              </div>

              <div className="team-status">
                <span className="status-badge">{member.status}</span>
              </div>

              <div className="team-social-links">
                {member.instagram && (
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn instagram-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaInstagram size={18} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn linkedin-btn"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLinkedin size={18} />
                  </a>
                )}
              </div>

              <div className="song-section">
                <p>
                  {playing ? "Reproduciendo..." : "Canción Favorita:"}
                  <br />
                  <strong>{member.songName}</strong>
                </p>
                <button
                  type="button"
                  className="song-btn"
                  onClick={onToggleAudio}
                  aria-label={playing ? "Pausar canción" : "Reproducir canción"}
                >
                  {playing ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </m.div>
  );
}