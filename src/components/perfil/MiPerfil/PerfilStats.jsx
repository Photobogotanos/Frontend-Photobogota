import { Row, Col } from "react-bootstrap";

const PerfilStats = ({ tienePublicaciones, tieneResenas, tieneGuardados }) => {
  return (
    <Row className="perfil-stats">
      <Col xs={4} className="perfil-stat">
        <h4>{tienePublicaciones ? "6" : "0"}</h4>
        <p>Publicaciones</p>
      </Col>

      <Col xs={4} className="perfil-stat">
        <h4>{tieneResenas ? "6" : "0"}</h4>
        <p>Reseñas</p>
      </Col>

      <Col xs={4} className="perfil-stat">
        <h4>{tieneGuardados ? "12" : "0"}</h4>
        <p>Guardados</p>
      </Col>
    </Row>
  );
};

export default PerfilStats;