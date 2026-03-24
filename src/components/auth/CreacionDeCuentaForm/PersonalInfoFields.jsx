import Form from "react-bootstrap/Form";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import { MdDriveFileRenameOutline, MdOutlineEmail, MdDateRange } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

export default function PersonalInfoFields({
  email, setEmail,
  nombres, setNombres,
  apellidos, setApellidos,
  nombreUsuario, setNombreUsuario,
  fecha, setFecha,
}) {
  return (
    <div className="mt-4">

      {/* Email */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <MdOutlineEmail /> Email <RequiredMark />
        </Form.Label>
        <Form.Control
          type="email"
          className="rounded-pill input-without-focus"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      {/* Nombres */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <MdDriveFileRenameOutline /> Nombres <RequiredMark />
        </Form.Label>
        <Form.Control
          className="rounded-pill input-without-focus"
          value={nombres}
          onChange={(e) => setNombres(e.target.value)}
        />
      </Form.Group>

      {/* Apellidos */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <MdDriveFileRenameOutline /> Apellidos <RequiredMark />
        </Form.Label>
        <Form.Control
          className="rounded-pill input-without-focus"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
        />
      </Form.Group>

      {/* Nombre de usuario */}
      <Form.Group className="mb-3">
        <Form.Label className="creacion-formulario-label">
          <FaUser /> Nombre de usuario <RequiredMark />
        </Form.Label>
        <Form.Control
          className="rounded-pill input-without-focus"
          value={nombreUsuario}
          onChange={(e) => setNombreUsuario(e.target.value)}
        />
      </Form.Group>

      {/* Fecha de nacimiento */}
      <Form.Group className="mb-4">
        <Form.Label className="creacion-formulario-label">
          <MdDateRange /> Fecha de nacimiento <RequiredMark />
        </Form.Label>
        <Flatpickr
          options={{ dateFormat: "Y-m-d", maxDate: "today", locale: Spanish, allowInput: true }}
          value={fecha}
          onChange={(selectedDates) =>
            setFecha(selectedDates[0] ? selectedDates[0].toISOString().split("T")[0] : "")
          }
          className="rounded-pill form-control input-without-focus"
        />
      </Form.Group>

    </div>
  );
}