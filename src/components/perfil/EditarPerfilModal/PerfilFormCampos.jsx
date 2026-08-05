import { Form, Row, Col } from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import FotoPerfil from "./FotoPerfil";
import BotonesAccion from "./BotonesAccion";

export default function PerfilFormCampos({
  formData,
  fotoPerfil,
  rolMostrar,
  perfilData,
  handleChange,
  handleFotoChange,
  handleEliminarFoto,
  handleSubmit,
  onCancelar,
}) {
  return (
    <Form onSubmit={handleSubmit}>
      <div className="profile-hero">
        <FotoPerfil
          fotoPerfil={fotoPerfil}
          onFotoChange={handleFotoChange}
          onEliminarFoto={handleEliminarFoto}
          nombreUsuario={formData.nombreUsuario}
          nombre={formData.nombresCompletos}
        />
        <div className="hero-info">
          <p className="hero-name">
            {formData.nombresCompletos || "Usuario"}
          </p>
          <p className="hero-user">
            @{formData.nombreUsuario || "usuario"}
          </p>
          <div className="hero-pills">
            <span className="hpill">{rolMostrar}</span>
            {rolMostrar === "MIEMBRO" &&
              perfilData?.nivel !== null &&
              perfilData?.nivel !== undefined && (
                <span className="hpill accent">
                  Nivel {perfilData.nivel}
                </span>
              )}
          </div>
        </div>
      </div>

      <div className="form-block">
        <div className="block-heading">
          <FaUser className="bh-icon" />
          <span>Información personal</span>
        </div>
        <Row className="g-3">
          <Col md={12}>
            <div className="fgroup">
              <label htmlFor="nombresCompletos" className="flabel">Nombre completo</label>
              <Form.Control
                id="nombresCompletos"
                type="text"
                name="nombresCompletos"
                value={formData.nombresCompletos}
                onChange={handleChange}
                className="finput"
                placeholder="Tu nombre completo"
              />
            </div>
          </Col>
          <Col md={12}>
            <div className="fgroup">
              <label htmlFor="biografia" className="flabel">Biografía</label>
              <Form.Control
                id="biografia"
                as="textarea"
                rows={3}
                name="biografia"
                value={formData.biografia}
                onChange={handleChange}
                className="finput ftextarea"
                placeholder="Cuéntanos sobre ti..."
                maxLength={160}
              />
              <span className="char-hint">
                {formData.biografia?.length || 0}/160
              </span>
            </div>
          </Col>
        </Row>
      </div>

      <div className="block-sep" />

      <div className="form-block">
        <div className="block-heading">
          <FaEnvelope className="bh-icon" />
          <span>Contacto</span>
        </div>
        <Row className="g-3">
          <Col md={7}>
            <div className="fgroup">
              <label htmlFor="email" className="flabel">Correo electrónico</label>
              <Form.Control
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="finput"
                placeholder="correo@ejemplo.com"
                disabled
              />
            </div>
          </Col>
          <Col md={5}>
            <div className="fgroup">
              <label htmlFor="telefono" className="flabel">
                <FaPhone style={{ fontSize: "0.7rem", marginRight: 5 }} />
                Teléfono
              </label>
              <Form.Control
                id="telefono"
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="finput"
                placeholder="300 000 0000"
              />
            </div>
          </Col>
        </Row>
      </div>

      <BotonesAccion onCancelar={onCancelar} />
    </Form>
  );
}
