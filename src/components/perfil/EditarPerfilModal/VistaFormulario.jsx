import Select from "react-select";
import {
  FaExclamationTriangle,
  FaUserSlash,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

const MOTIVOS = [
  { value: "", label: "Prefiero no decirlo" },
  { value: "NO_USO_LA_APLICACION", label: "Ya no uso la aplicación" },
  { value: "ENCONTRE_OTRA_ALTERNATIVA", label: "Encontré otra alternativa" },
  { value: "PREOCUPACIONES_DE_PRIVACIDAD", label: "Preocupaciones de privacidad" },
  { value: "MALA_EXPERIENCIA_DE_USO", label: "Mala experiencia de uso" },
  { value: "DEMASIADAS_NOTIFICACIONES", label: "Demasiadas notificaciones" },
  { value: "OTRO", label: "Otro motivo" },
];

export default function VistaFormulario({
  usuario,
  motivo,
  comentario,
  enviando,
  onMotivoChange,
  onComentarioChange,
  onSolicitar,
}) {
  return (
    <div className="elim-block">
      <div className="elim-hero elim-hero-danger">
        <span className="elim-hero-icon">
          <FaExclamationTriangle />
        </span>
        <p className="elim-hero-title">Eliminar mi cuenta, {usuario?.nombre || ""}</p>
        <p className="elim-hero-sub">
          Esta acción desactiva tu cuenta de inmediato. Léela con calma antes de continuar.
        </p>
      </div>

      <div className="elim-consecuencias">
        <div className="elim-consecuencia-item">
          <FaUserSlash className="elim-cons-icon" />
          <div>
            <b>Tu cuenta se desactiva al instante</b>
            <p>No podrás iniciar sesión normalmente ni usar la aplicación mientras esté en este estado.</p>
          </div>
        </div>
        <div className="elim-consecuencia-item">
          <FaClock className="elim-cons-icon" />
          <div>
            <b>Tienes 30 días para recuperarla</b>
            <p>Podrás cancelar la eliminación en cualquier momento antes de que se cumpla el plazo.</p>
          </div>
        </div>
        <div className="elim-consecuencia-item">
          <FaChartBar className="elim-cons-icon" />
          <div>
            <b>Pasado el plazo, se anonimizan tus datos personales</b>
            <p>
              Tu nombre, teléfono, foto y biografía se eliminan de forma permanente. Tus puntos,
              nivel, calificaciones y spots creados se conservan de forma anónima para
              mantener las estadísticas generales de la plataforma.
            </p>
          </div>
        </div>
      </div>

      <div className="elim-form-fields">
        <div className="fgroup">
          <label className="flabel" htmlFor="motivo-eliminacion">
            ¿Por qué te vas? (opcional)
          </label>
          <Select
            id="motivo-eliminacion"
            inputId="motivo-eliminacion"
            classNamePrefix="spot-select"
            options={MOTIVOS}
            value={MOTIVOS.find((m) => m.value === motivo) || null}
            onChange={(opcion) => onMotivoChange(opcion ? opcion.value : "")}
            isClearable
            placeholder="Selecciona un motivo..."
          />
        </div>

        <div className="fgroup">
          <label className="flabel" htmlFor="comentario-eliminacion">
            Cuéntanos más (opcional)
          </label>
          <textarea
            id="comentario-eliminacion"
            className="finput ftextarea"
            rows={3}
            maxLength={500}
            placeholder="Ayúdanos a mejorar contándonos qué pasó..."
            value={comentario}
            onChange={(e) => onComentarioChange(e.target.value)}
          />
          <span className="char-hint">{comentario.length}/500</span>
        </div>
      </div>

      <button
        type="button"
        className="elim-btn-danger"
        onClick={onSolicitar}
        disabled={enviando}
      >
        <FaExclamationTriangle /> {enviando ? "Enviando..." : "Solicitar eliminación de mi cuenta"}
      </button>
    </div>
  );
}
