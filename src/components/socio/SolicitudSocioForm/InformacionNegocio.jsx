import Form from "react-bootstrap/Form";
import Select from "react-select";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { FaStreetView } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { IoIosDocument } from "react-icons/io";
import "./InformacionNegocio.css";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

const InformacionNegocio = ({ formData, handleChange, categoriaOptions, setFormData }) => {
  return (
    <>
      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="apellidos">
          Apellidos <MdDriveFileRenameOutline />
          <RequiredMark />
        </Form.Label>
        <Form.Control
          id="apellidos"
          name="apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="direccion">
          Dirección <FaStreetView />
          <RequiredMark />
        </Form.Label>
        <Form.Control
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="nit">
          NIT o RUT <FaIdCard />
          <RequiredMark />
        </Form.Label>
        <Form.Control
          id="nit"
          name="nit"
          value={formData.nit}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label
          className="label-solicitud-socio"
          htmlFor="propietario"
        >
          Nombre del propietario <FaUserCircle />
          <RequiredMark />
        </Form.Label>
        <Form.Control
          id="propietario"
          name="propietario"
          value={formData.propietario}
          onChange={handleChange}
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="label-solicitud-socio" htmlFor="categoria">
          Categoría <BiSolidCategoryAlt />
          <RequiredMark />
        </Form.Label>
        <Select
          options={categoriaOptions}
          value={
            categoriaOptions.find(
              (o) => o.value === formData.categoria
            ) || null
          }
          onChange={(selected) =>
            handleChange({
              target: { name: "categoria", value: selected?.value || "" },
            })
          }
          placeholder="Seleccione una categoría"
          classNamePrefix="react-select"
          className="react-select-container-solicitud"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label
          className="label-solicitud-socio"
          htmlFor="rutDocumento"
        >
          Subir RUT (PDF o Imagen) <IoIosDocument />
          <RequiredMark />
        </Form.Label>
        <Form.Control
          id="rutDocumento"
          type="file"
          accept=".pdf, .jpg, .jpeg, .png"
          name="rutDocumento"
          onChange={(e) =>
            setFormData({
              ...formData,
              rutDocumento: e.target.files[0],
            })
          }
          className="input-solicitud-socio rounded-pill"
          required
        />
      </Form.Group>
    </>
  );
};

export default InformacionNegocio;