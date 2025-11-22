import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Form from 'react-bootstrap/Form';
import logo from "../assets/images/logo.png";
import './CreacionDeCuentaForm.css';

function FormularioCreacion() {
  return (
    <Form>

      <div className="text-center mb-4">
        <img 
          src={logo} 
          alt="Logo Photo Bogota" 
          className="creacion-logo"
         
        />
      </div>

      <h3 className="text-center">Registro en Photo Bogota</h3>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="creacion-formulario-label"> Email* </Form.Label>
        <Form.Control type="email" placeholder="" className="rounded-pill" />
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
        <Flatpickr
          options={{
            dateFormat: "Y-m-d",
            maxDate: "today",
            locale: Spanish,
            allowInput: true,
          }}
          className="rounded-pill form-control"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label className="creacion-formulario-label" >Password</Form.Label>
        <Form.Control type="password" className="rounded-pill" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword2">
        <Form.Label className="creacion-formulario-label" >Confirmación de la password</Form.Label>
        <Form.Control type="password" className="rounded-pill" />
      </Form.Group>
      <div className="creacion-form-submit mt-5">
      <button className="creacion-formulario-button rounded-pill text-center"> Guardar </button>
      </div>
    </Form>
  );
}

export default FormularioCreacion;
