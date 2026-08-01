const PerfilStats = ({ rol, stats = {}, esPerfilPropio = true }) => {
  const rolNormalizado = (rol || "MIEMBRO").toUpperCase();
  const esSocio = rolNormalizado === "SOCIO";
  // ADMIN y MOD: solo reseñas y guardados (sin spots/publicaciones)
  const esStaff = rolNormalizado === "ADMIN" || rolNormalizado === "MOD";

  const totalSpots = stats.totalSpots ?? 0;
  const totalResenas = stats.totalResenas ?? 0;
  const totalGuardados = stats.totalGuardados ?? 0;

  if (esSocio) {
    return (
      <div className="perfil-stats">
        <div className="perfil-stat">
          <h4>{totalSpots}</h4>
          <p>Locales</p>
        </div>
        <div className="perfil-stat">
          <h4>{totalResenas}</h4>
          <p>Reseñas recibidas</p>
        </div>
      </div>
    );
  }

  if (esStaff) {
    return (
      <div className="perfil-stats">
        <div className="perfil-stat">
          <h4>{totalResenas}</h4>
          <p>Reseñas</p>
        </div>
        {esPerfilPropio && (
          <div className="perfil-stat">
            <h4>{totalGuardados}</h4>
            <p>Guardados</p>
          </div>
        )}
      </div>
    );
  }

  // MIEMBRO
  return (
    <div className="perfil-stats">
      <div className="perfil-stat">
        <h4>{totalSpots}</h4>
        <p>Spots</p>
      </div>
      <div className="perfil-stat">
        <h4>{totalResenas}</h4>
        <p>Reseñas</p>
      </div>
      {esPerfilPropio && (
        <div className="perfil-stat">
          <h4>{totalGuardados}</h4>
          <p>Guardados</p>
        </div>
      )}
    </div>
  );
};

export default PerfilStats;
