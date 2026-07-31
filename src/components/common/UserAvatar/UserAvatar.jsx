import { useState, useEffect } from "react";
import "./UserAvatar.css";

/**
 * Avatar reutilizable: foto si carga bien; si no, inicial de nombreUsuario.
 */
export default function UserAvatar({
  src,
  nombre = "",
  nombreUsuario = "",
  alt = "Avatar",
  className = "",
  size,
  onClick,
  tabIndex,
  role,
  "aria-label": ariaLabel,
  onKeyDown,
}) {
  const [error, setError] = useState(false);

  // Si cambia la URL, reintentar mostrar foto
  useEffect(() => {
    setError(false);
  }, [src]);

  const tieneFoto = Boolean(src) && !error;

  // Prioridad: nombreUsuario (sin @) → nombresCompletos → "U"
  const inicial = (
    nombreUsuario?.replace(/^@/, "")?.trim()?.charAt(0) ||
    nombre?.trim()?.charAt(0) ||
    "U"
  ).toUpperCase();

  if (tieneFoto) {
    return (
      <img
        src={src}
        alt={alt}
        className={`user-avatar-img ${className}`.trim()}
        style={size ? { width: size, height: size } : undefined}
        onError={() => setError(true)}
        onClick={onClick}
        onKeyDown={onKeyDown}
        tabIndex={tabIndex}
        role={role}
        aria-label={ariaLabel}
      />
    );
  }

  return (
    <div
      className={`user-avatar-letter ${className}`.trim()}
      style={size ? { width: size, height: size, fontSize: size * 0.42 } : undefined}
      onClick={onClick}
      onKeyDown={onKeyDown}
      tabIndex={tabIndex}
      role={role || (onClick ? "button" : undefined)}
      aria-label={ariaLabel || alt}
    >
      {inicial}
    </div>
  );
}
