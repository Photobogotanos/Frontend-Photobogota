import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePhoneAndroid } from "react-icons/md";
import { MdOutlineFactory } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { PiCityDuotone } from "react-icons/pi";
import "./InformacionPersonal.css";

const InformacionPersonal = ({ formData, handleChange }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="nombres">
          Nombres <MdDriveFileRenameOutline />
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Campo obligatorio</Tooltip>}
          >
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          id="nombres"
          name="nombres"
          value={formData.nombres}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="email">
          Email <MdOutlineEmail />
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Campo obligatorio</Tooltip>}
          >
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="telefono">
          Teléfono <MdOutlinePhoneAndroid />
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Campo obligatorio</Tooltip>}
          >
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          id="telefono"
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          onBeforeInput={(e) => {
            if (!/^\d+$/.test(e.data)) {
              e.preventDefault();
            }
            if (e.target.value.length >= 10) {
              e.preventDefault();
            }
          }}
          onPaste={(e) => {
            const pastedText = e.clipboardData.getData("text");
            if (!/^\d+$/.test(pastedText)) {
              e.preventDefault();
            }
          }}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label
          className="label-solicitud-socio"
          htmlFor="fechaNacimiento"
        >
          Fecha de nacimiento <MdDateRange />
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
            maxDate: new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate()),
            locale: Spanish,
            allowInput: true,
          }}
          className="form-control input-solicitud-socio rounded-pill"
          value={formData.fechaNacimiento}
          onChange={(date) =>
            handleChange({
              target: { name: "fechaNacimiento", value: date[0] },
            })
          }
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label
          className="label-solicitud-socio"
          htmlFor="razonSocial"
        >
          Razón Social <MdOutlineFactory />
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Campo obligatorio</Tooltip>}
          >
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          id="razonSocial"
          name="razonSocial"
          value={formData.razonSocial}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="localidad">
          Localidad <PiCityDuotone />
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Campo obligatorio</Tooltip>}
          >
            <span> *</span>
          </OverlayTrigger>
        </Form.Label>
        <Form.Control
          id="localidad"
          name="localidad"
          value={formData.localidad}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>
    </>
  );
};

export default InformacionPersonal;