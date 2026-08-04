import { useState } from "react";
import { FaPaperPlane, FaBullhorn } from "react-icons/fa";
import Swal from "sweetalert2";
import { enviarNotificacionManual } from "@/services/notificacion.service";
import "./EnviarNotificacion.css";

const ALCANCE_OPCIONES = [
  { value: "TODOS", label: "Todos los usuarios" },
  { value: "POR_ROL", label: "Usuarios con un rol específico" },
  { value: "USUARIOS_ESPECIFICOS", label: "Usuarios específicos" },
];

const ROLES_DISPONIBLES = ["MIEMBRO", "SOCIO", "MOD", "ADMIN"];

const FORM_INICIAL = {
  titulo: "",
  mensaje: "",
  alcance: "TODOS",
  roles: [],
  usernamesTexto: "",
};

export default function EnviarNotificacion() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleRol = (rol) => {
    setForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(rol)
        ? prev.roles.filter((r) => r !== rol)
        : [...prev.roles, rol],
    }));
  };

  const limpiarFormulario = () => setForm(FORM_INICIAL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.titulo.trim() || !form.mensaje.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "El título y el mensaje son obligatorios",
      });
      return;
    }

    if (form.alcance === "POR_ROL" && form.roles.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Falta el rol",
        text: "Selecciona al menos un rol",
      });
      return;
    }

    const usernames = form.usernamesTexto
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    if (form.alcance === "USUARIOS_ESPECIFICOS" && usernames.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Faltan usuarios",
        text: "Indica al menos un nombre de usuario",
      });
      return;
    }

    const confirmacion = await Swal.fire({
      icon: "question",
      title: "¿Enviar notificación?",
      text: "Esta acción notificará de inmediato a los usuarios seleccionados.",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    setEnviando(true);
    const resultado = await enviarNotificacionManual({
      titulo: form.titulo.trim(),
      mensaje: form.mensaje.trim(),
      alcance: form.alcance,
      roles: form.alcance === "POR_ROL" ? form.roles : null,
      usernames: form.alcance === "USUARIOS_ESPECIFICOS" ? usernames : null,
    });
    setEnviando(false);

    if (resultado.exitoso) {
      Swal.fire({
        icon: "success",
        title: "Notificación enviada",
        text: "Se envió correctamente a los usuarios seleccionados",
      });
      limpiarFormulario();
    } else {
      Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
    }
  };

  return (
    <div className="enviar-notif-admin">
      <div className="enviar-notif-header">
        <div className="enviar-notif-title-wrap">
          <span className="enviar-notif-subtitle">Administración</span>
          <h2 className="enviar-notif-title">
            <FaBullhorn className="enviar-notif-icon" /> Enviar notificación
          </h2>
          <span className="enviar-notif-line" />
        </div>
        <p className="enviar-notif-descripcion">
          Envía un anuncio a todos los usuarios, a un rol específico o a
          usuarios puntuales. Solo moderadores y administradores pueden
          hacerlo.
        </p>
      </div>

      <form className="enviar-notif-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="enviar-notif-label" htmlFor="titulo">
            Título
          </label>
          <input
            type="text"
            name="titulo"
            className="form-control rounded-pill input-without-focus"
            placeholder="Ej: Nueva función disponible"
            value={form.titulo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="enviar-notif-label" htmlFor="mensaje">
            Mensaje
          </label>
          <textarea
            name="mensaje"
            className="form-control input-without-focus"
            rows={4}
            placeholder="Escribe el contenido del anuncio"
            value={form.mensaje}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="enviar-notif-label" htmlFor="alcance">
            ¿A quién va dirigido?
          </label>
          <div className="alcance-opciones">
            {ALCANCE_OPCIONES.map((op) => (
              <label
                key={op.value}
                className={`alcance-pill ${form.alcance === op.value ? "activo" : ""}`}
              >
                <input
                  type="radio"
                  className="me-2"
                  name="alcance"
                  value={op.value}
                  checked={form.alcance === op.value}
                  onChange={handleChange}
                />
                {op.label}
              </label>
            ))}
          </div>
        </div>

        {form.alcance === "POR_ROL" && (
          <div className="form-group">
            <label className="enviar-notif-label" htmlFor="roles">
              Roles
            </label>
            <div className="roles-grid">
              {ROLES_DISPONIBLES.map((rol) => (
                <div key={rol} className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={form.roles.includes(rol)}
                    onChange={() => toggleRol(rol)}
                    id={`rol-${rol}`}
                  />
                  <label className="form-check-label" htmlFor={`rol-${rol}`}>
                    {rol}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {form.alcance === "USUARIOS_ESPECIFICOS" && (
          <div className="form-group">
            <label className="enviar-notif-label" htmlFor="usernamesTexto">
              Nombres de usuario (separados por coma)
            </label>
            <input
              type="text"
              name="usernamesTexto"
              className="form-control rounded-pill input-without-focus"
              placeholder="Ej: juanperez, mariagomez"
              value={form.usernamesTexto}
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit" className="btn-enviar-notif" disabled={enviando}>
          <FaPaperPlane /> {enviando ? "Enviando..." : "Enviar notificación"}
        </button>
      </form>
    </div>
  );
}
