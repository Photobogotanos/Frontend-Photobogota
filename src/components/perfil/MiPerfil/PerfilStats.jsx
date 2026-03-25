import { Row, Col } from "react-bootstrap";

const PerfilStats = ({ tienePublicaciones, tieneResenas, tieneGuardados, rol }) => {
  const esSocio = rol === "SOCIO";
  const esModOAdmin = rol === "MOD" || rol === "ADMIN";
  
  return (
    <Row className="perfil-stats">
      <Col xs={esSocio || esModOAdmin ? 6 : 4} className="perfil-stat">
        <h4>{tienePublicaciones ? "5" : "0"}</h4>
        <p>Spots</p>
      </Col>

      <Col xs={esSocio || esModOAdmin ? 6 : 4} className="perfil-stat">
        <h4>{tieneResenas ? "6" : "0"}</h4>
        <p>{esSocio ? "Reseñas Recibidas" : "Reseñas"}</p>
      </Col>

      {!esSocio && !esModOAdmin && (
        <Col xs={4} className="perfil-stat">
          <h4>{tieneGuardados ? "12" : "0"}</h4>
          <p>Guardados</p>
        </Col>
      )}
    </Row>
  );
};

export default PerfilStats;