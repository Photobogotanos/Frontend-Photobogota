import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function FormularioCreacion() {
  return (
    <Form>
        
        <h3>Registro en Photo Bogota</h3>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="text-start w-100">Email*</Form.Label>
          <Form.Control type="email" placeholder="" />
          <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
    </Form>
  );
}

export default FormularioCreacion;
