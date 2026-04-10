// DemoAccountsPanel.jsx - Cierre automático al seleccionar
import { useState } from "react";
import {
    FaUserCircle,
    FaKey,
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

const getRolIcon = (rol) => {
    switch (rol) {
        case "ADMIN":
            return <MdAdminPanelSettings />;
        case "MOD":
            return <GiPoliceBadge />;
        case "SOCIO":
            return <FaUserTag />;
        case "MIEMBRO":
            return <HiUserGroup />;
        default:
            return <FaUserCircle />;
    }
};

const getRolInfo = (rol) => {
    const mapa = {
        SOCIO: { 
            texto: "Socio", 
            color: "#8b5cf6", 
            bgLight: "#f3e8ff",
            hoverBg: "#7c3aed"
        },
        ADMIN: { 
            texto: "Administrador", 
            color: "#ef4444", 
            bgLight: "#fee2e2",
            hoverBg: "#dc2626"
        },
        MOD: { 
            texto: "Moderador", 
            color: "#10b981", 
            bgLight: "#d1fae5",
            hoverBg: "#059669"
        },
        MIEMBRO: { 
            texto: "Miembro", 
            color: "#6b7280", 
            bgLight: "#f3f4f6",
            hoverBg: "#4b5563"
        },
    };
    return mapa[rol] || { texto: rol, color: "#8b5cf6", bgLight: "#f3e8ff", hoverBg: "#7c3aed" };
};

export default function DemoAccountsPanel({ cuentas, onSelectAccount, selectedAccount }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCopyCredentials = (nombreUsuario) => {
        const pass = CREDENCIALES_DEMO[nombreUsuario] ?? "";
        onSelectAccount(nombreUsuario, pass);
        setIsOpen(false); // Cierra el panel automáticamente al seleccionar
    };

    const ordenRol = { MIEMBRO: 1, SOCIO: 2, MOD: 3, ADMIN: 4 };
    const cuentasOrdenadas = [...cuentas].sort((a, b) => ordenRol[a.rol] - ordenRol[b.rol]);

    return (
        <div className="demo-accounts-modern">
            <button
                type="button"
                className={`demo-toggle-modern ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="demo-toggle-content">
                    <span className="demo-toggle-icon">
                        <FaShieldAlt />
                    </span>
                    <span className="demo-toggle-text">Cuentas de demostración</span>
                    <span className="demo-toggle-badge">Offline</span>
                </div>
                <span className="demo-toggle-arrow">
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
            </button>

            <div className={`demo-panel-modern ${isOpen ? "expanded" : "collapsed"}`}>
                <div className="demo-panel-header">
                    <p className="demo-panel-description">
                        <FaInfoCircle className="info-icon" />
                        <span>Selecciona una cuenta para autocompletar</span>
                    </p>
                </div>

                <div className="demo-cards-grid">
                    {cuentasOrdenadas.map((cuenta) => {
                        const rolInfo = getRolInfo(cuenta.rol);
                        const isSelected = selectedAccount === cuenta.nombreUsuario;

                        return (
                            <button
                                key={cuenta.id}
                                type="button"
                                className={`demo-card-modern ${isSelected ? "selected" : ""}`}
                                onClick={() => handleCopyCredentials(cuenta.nombreUsuario)}
                                style={{
                                    "--rol-color": rolInfo.color,
                                    "--rol-bg-light": rolInfo.bgLight,
                                    "--rol-hover-bg": rolInfo.hoverBg,
                                }}
                            >
                                <div className="demo-card-header">
                                    <div
                                        className="demo-card-avatar"
                                        style={{ background: rolInfo.color }}
                                    >
                                        {getRolIcon(cuenta.rol)}
                                    </div>
                                    <span
                                        className="demo-card-role"
                                        style={{ background: rolInfo.bgLight, color: rolInfo.color }}
                                    >
                                        {rolInfo.texto}
                                    </span>
                                </div>

                                <div className="demo-card-body">
                                    <div className="demo-card-username">
                                        <FaUserCircle className="username-icon" />
                                        <span>{cuenta.nombreUsuario}</span>
                                    </div>
                                    <div className="demo-card-password">
                                        <FaKey className="password-icon" />
                                        <span>{CREDENCIALES_DEMO[cuenta.nombreUsuario] ?? "••••••••"}</span>
                                    </div>
                                </div>

                                <div className="demo-card-footer">
                                    <div className="demo-card-action">
                                        {isSelected ? (
                                            <>
                                                <FaCheckCircle className="check-icon" />
                                                <span>Copiado</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaCopy className="copy-icon" />
                                                <span>Usar</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="demo-card-selected-badge">
                                        <FaCheckCircle />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="demo-panel-footer">
                    <p className="demo-footer-note">
                        <FaLightbulb className="light-icon" />
                        <span>Las credenciales se autocompletarán automáticamente</span>
                    </p>
                </div>
            </div>
        </div>
    );
}