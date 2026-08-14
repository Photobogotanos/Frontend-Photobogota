import { useState } from "react";
import {
  FaUserCircle,
  FaCopy,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaShieldAlt,
  FaUserTag,
  FaInfoCircle,
  FaLightbulb,
} from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { GiPoliceBadge } from "react-icons/gi";
import { HiUserGroup } from "react-icons/hi";
import "./DemoAccountsPanel.css";

const CREDENCIALES_DEMO = {
  socio: "socio123",
  perro: "encerrado",
  moderador: "mod123",
  miembro: "miembro123",
};
const ORDEN_ROL = { MIEMBRO: 1, SOCIO: 2, MOD: 3, ADMIN: 4 };

const ROLES_CONFIG = {
  SOCIO: {
    texto: "Socio",
    color: "#8b5cf6",
    bgLight: "#f3e8ff",
    icon: <FaUserTag />,
  },
  ADMIN: {
    texto: "Admin",
    color: "#ef4444",
    bgLight: "#fee2e2",
    icon: <MdAdminPanelSettings />,
  },
  MOD: {
    texto: "Mod",
    color: "#10b981",
    bgLight: "#d1fae5",
    icon: <GiPoliceBadge />,
  },
  MIEMBRO: {
    texto: "Miembro",
    color: "#6b7280",
    bgLight: "#f3f4f6",
    icon: <HiUserGroup />,
  },
};

export default function DemoAccountsPanel({
  cuentas,
  onSelectAccount,
  selectedAccount,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyCredentials = (nombreUsuario) => {
    onSelectAccount(nombreUsuario, CREDENCIALES_DEMO[nombreUsuario] ?? "");
    setIsOpen(false);
  };

  const cuentasOrdenadas = cuentas.toSorted(
    (a, b) => ORDEN_ROL[a.rol] - ORDEN_ROL[b.rol],
  );

  return (
    <div className="demo-accounts-modern">
      <button
        type="button"
        className={`demo-toggle-modern ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="demo-toggle-content">
          <FaShieldAlt className="demo-toggle-icon" />
          <span className="demo-toggle-text">Cuentas de demo</span>
          <span className="demo-toggle-badge">Offline</span>
        </div>
        {isOpen ? (
          <FaChevronUp className="demo-toggle-arrow" />
        ) : (
          <FaChevronDown className="demo-toggle-arrow" />
        )}
      </button>

      <div className={`demo-panel-modern ${isOpen ? "expanded" : "collapsed"}`}>
        <div className="demo-panel-header">
          <p className="demo-panel-description">
            <FaInfoCircle className="info-icon" />
            <span>Selecciona para autocompletar</span>
          </p>
        </div>

        <div className="demo-cards-grid">
          {cuentasOrdenadas.map(({ id, rol, nombreUsuario }) => {
            const conf = ROLES_CONFIG[rol] || {
              texto: rol,
              color: "#8b5cf6",
              bgLight: "#f3e8ff",
              icon: <FaUserCircle />,
            };
            const isSelected = selectedAccount === nombreUsuario;

            return (
              <button
                key={id}
                type="button"
                className={`demo-card-modern ${isSelected ? "selected" : ""}`}
                onClick={() => handleCopyCredentials(nombreUsuario)}
                style={{
                  "--rol-color": conf.color,
                  "--rol-bg-light": conf.bgLight,
                }}
              >
                <div className="demo-card-left">
                  <div
                    className="demo-card-avatar"
                    style={{ background: conf.color }}
                  >
                    {conf.icon}
                  </div>
                  <span className="demo-card-role">{conf.texto}</span>
                </div>

                <div className="demo-card-action">
                  {isSelected ? (
                    <>
                      <FaCheckCircle />
                      <span>Listo</span>
                    </>
                  ) : (
                    <>
                      <FaCopy />
                      <span>Usar</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="demo-panel-footer">
          <p className="demo-footer-note">
            <FaLightbulb className="light-icon" />
            <span>Autocompletado automático</span>
          </p>
        </div>
      </div>
    </div>
  );
}
