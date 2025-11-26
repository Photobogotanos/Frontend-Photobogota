import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import Form from 'react-bootstrap/Form';
import './CreacionDeCuentaForm.css';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdDateRange } from "react-icons/md";


function FormularioCreacion() {
  return (
    <Form>
      <h3 className="text-center mt-5 register-form-cuenta">Registro en Photo Bogota</h3>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label className="creacion-formulario-label">Email  <MdOutlineEmail/>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
        </Form.Label>
        <Form.Control type="email" placeholder="" className="rounded-pill" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">Nombres <MdDriveFileRenameOutline/>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
        </Form.Label>
        <Form.Control className="rounded-pill" name="name" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">Apellidos <MdDriveFileRenameOutline/> 
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
        </Form.Label>
        <Form.Control className="rounded-pill" name="apellido" />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">Fecha de nacimiento <MdDateRange/>
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
          </Form.Label>
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
        <Form.Label className="creacion-formulario-label" >Password 
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
        </Form.Label>
        <Form.Control type="password" className="rounded-pill" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword2">
        <Form.Label className="creacion-formulario-label" >Confirmación de la password 
        <OverlayTrigger
          placement="right"
          overlay={<Tooltip>Campo obligatorio</Tooltip>}
        >
          <span> *</span>
        </OverlayTrigger>
        </Form.Label>
        <Form.Control type="password" className="rounded-pill" />
      </Form.Group>
      <div className="creacion-form-submit mt-5">
      <button className="creacion-formulario-button rounded-pill text-center"> Guardar </button>
      </div>
    </Form>
  );
}

export default FormularioCreacion;
