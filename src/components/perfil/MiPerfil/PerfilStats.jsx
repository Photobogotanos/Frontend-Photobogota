const PerfilStats = ({ rol, stats = {}, esPerfilPropio = true }) => {
  const rolNormalizado = (rol || "MIEMBRO").toUpperCase();
  const esSocio = rolNormalizado === "SOCIO";
  const esStaff = rolNormalizado === "ADMIN" || rolNormalizado === "MOD";

  const totalSpots = stats.totalSpots ?? 0;
  const totalResenas = stats.totalResenas ?? 0;
  const totalGuardados = stats.totalGuardados ?? 0;
  const totalCanjes = stats.totalCanjes ?? 0;
  const totalResenasRecibidas = stats.totalResenasRecibidas ?? 0;
  const totalPromocionesActivas = stats.totalPromocionesActivas ?? 0;

  if (esSocio) {
    return (
      <div className="perfil-stats">
        <div className="perfil-stat">
          <h4>{totalSpots}</h4>
          <p>Locales</p>
        </div>
        <div className="perfil-stat">
          <h4>{totalResenasRecibidas}</h4>
          <p>Reseñas recibidas</p>
        </div>
        <div className="perfil-stat">
          <h4>{totalPromocionesActivas}</h4>
          <p>Promociones Activas</p>
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
      {esPerfilPropio && (
        <div className="perfil-stat">
          <h4>{totalCanjes}</h4>
          <p>Canjes</p>
        </div>
      )}
    </div>
  );
};

export default PerfilStats;
