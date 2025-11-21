import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

function FormularioCreacion() {
  return (
    <Form>
        
        <h3>Registro en Photo Bogota</h3>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="creacion-formulario-label"> Email* </Form.Label>
          <Form.Control type="email" placeholder=""className="rounded-pill" />
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="creacion-formulario-label">Nombre de usuario *</Form.Label>
          <Form.Control className="rounded-pill" name="user" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="creacion-formulario-label">Nombre de usuario *</Form.Label>
          <Form.Control className="rounded-pill" name="user" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="creacion-formulario-label">Fecha de nacimiento *</Form.Label>
          <Form.Control className="rounded-pill" name="fecha" type="date" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label className="creacion-formulario-label" >Password</Form.Label>
          <Form.Control type="password" placeholder="" className="rounded-pill" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword2">
          <Form.Label className="creacion-formulario-label" >Confirmacion de la password</Form.Label>
          <Form.Control type="password" placeholder="" className="rounded-pill" />
        </Form.Group>

        <button className="creacion-formulario-button rounded-pill text-center"> Guardar </button>
    </Form>
  );
}

export default FormularioCreacion;
