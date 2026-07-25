import { Row, Col } from "react-bootstrap";

const PerfilStats = ({ tienePublicaciones, tieneResenas, tieneGuardados, rol, stats = {} }) => {
  const esSocio = rol === "SOCIO";
  const esModOAdmin = rol === "MOD" || rol === "ADMIN";

  const totalSpots = stats.totalSpots ?? (tienePublicaciones ? 5 : 0);
  const totalResenas = stats.totalResenas ?? (tieneResenas ? 6 : 0);
  const totalGuardados = stats.totalGuardados ?? (tieneGuardados ? 12 : 0);

  return (
    <Row className="perfil-stats">
      <Col xs={esSocio || esModOAdmin ? 6 : 4} className="perfil-stat">
        <h4>{totalSpots}</h4>
        <p>Spots</p>
      </Col>

      <Col xs={esSocio || esModOAdmin ? 6 : 4} className="perfil-stat">
        <h4>{totalResenas}</h4>
        <p>{esSocio ? "Reseñas Recibidas" : "Reseñas"}</p>
      </Col>

      {!esSocio && !esModOAdmin && (
        <Col xs={4} className="perfil-stat">
          <h4>{totalGuardados}</h4>
          <p>Guardados</p>
        </Col>
      )}
    </Row>
  );
};

export default PerfilStats;
