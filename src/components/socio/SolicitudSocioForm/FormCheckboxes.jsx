import Form from "react-bootstrap/Form";
import "./FormCheckboxes.css";

const FormCheckboxes = ({ formData, setFormData, setShowModal }) => {
  return (
    <>
      <Form.Group className="mb-3 fw-bold">
        <Form.Check
          type="checkbox"
          name="autorizoUsoDatos"
          label="Autorizo el uso de mis datos personales"
          checked={formData.autorizoUsoDatos || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              autorizoUsoDatos: e.target.checked,
            })
          }
          required
        />
      </Form.Group>

      <Form.Group className="mb-4 fw-bold">
        <Form.Check
          type="checkbox"
          name="aceptaTerminos"
          checked={formData.aceptaTerminos || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              aceptaTerminos: e.target.checked,
            })
          }
          required
          label={
            <span className="terminos-label-solicitud">
              Acepto los{" "}
              <button type="button"
                className="terminos-link-solicitud"
                onClick={() => setShowModal(true)}
              >
                términos y condiciones
              </button>
            </span>
          }
        />
      </Form.Group>
    </>
  );
};

export default FormCheckboxes;