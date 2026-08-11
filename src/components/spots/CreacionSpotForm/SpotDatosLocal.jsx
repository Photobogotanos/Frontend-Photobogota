import { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaPhone, FaClock, FaGlobe } from "react-icons/fa";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import RequiredMark from "@/components/common/RequiredMark/RequiredMark";

// Días de la semana en orden (semana que inicia el lunes)
const DIAS_SEMANA = [
  { label: "Lunes" },
  { label: "Martes" },
  { label: "Miércoles" },
  { label: "Jueves" },
  { label: "Viernes" },
  { label: "Sábado" },
  { label: "Domingo" },
];

const WEEK_DAYS_ES = [
  ["Sábado", "Sáb"],
  ["Domingo", "Dom"],
  ["Lunes", "Lun"],
  ["Martes", "Mar"],
  ["Miércoles", "Mié"],
  ["Jueves", "Jue"],
  ["Viernes", "Vie"],
];

const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const INPUT_STYLE = { width: "auto", height: "auto" };

export default function SpotDatosLocal({
  telefono,
  horario,
  sitioWeb,
  onTelefonoChange,
  onHorarioChange,
  onSitioWebChange,
}) {
  const [diaInicio, setDiaInicio] = useState(null);
  const [diaFin, setDiaFin] = useState(null);
  const [apertura, setApertura] = useState(null);
  const [cierre, setCierre] = useState(null);

  const construirHorario = (ini, fin, ap, ci) => {
    const ha24 = ap ? ap.format("HH:mm") : "";
    const hc24 = ci ? ci.format("HH:mm") : "";

    if (ini === null || fin === null || !ha24 || !hc24 || hc24 <= ha24) {
      onHorarioChange("");
      return;
    }

    onHorarioChange(
      `${DIAS_SEMANA[ini].label} a ${DIAS_SEMANA[fin].label} · ${ap.format(
        "hh:mm A",
      )} a ${ci.format("hh:mm A")}`,
    );
  };

  const seleccionarDia = (idx) => {
    let ini = diaInicio;
    let fin = diaFin;

    if (ini === null || fin !== null) {
      ini = idx;
      fin = null;
    } else if (idx < ini) {
      ini = idx;
      fin = null;
    } else {
      fin = idx;
    }

    setDiaInicio(ini);
    setDiaFin(fin);
    construirHorario(ini, fin, apertura, cierre);
  };

  const handleApertura = (val) => {
    setApertura(val);
    construirHorario(diaInicio, diaFin, val, cierre);
  };

  const handleCierre = (val) => {
    setCierre(val);
    construirHorario(diaInicio, diaFin, apertura, val);
  };

  const diaActivo = (idx) =>
    diaInicio !== null && idx >= diaInicio && idx <= diaFin;

  const diasLabel =
    diaInicio !== null
      ? diaFin !== null
        ? `${DIAS_SEMANA[diaInicio].label} a ${DIAS_SEMANA[diaFin].label}`
        : DIAS_SEMANA[diaInicio].label
      : "";

  const rangoHorasInvalido =
    apertura &&
    cierre &&
    cierre.format("HH:mm") <= apertura.format("HH:mm");

  return (
    <div className="mb-3">
      <h5 className="section-title mb-2">Datos del local</h5>
      <Row className="g-3">
        <Col xs={12} md={6}>
          <label className="spot-label" htmlFor="telefono-local">
            <FaPhone className="me-2" />
            Teléfono <RequiredMark />
          </label>
          <input
            id="telefono-local"
            type="tel"
            className="spot-input"
            placeholder="Ej: 3001234567"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
            value={telefono}
            onChange={(e) =>
              onTelefonoChange(e.target.value.replace(/\D+/g, "").slice(0, 15))
            }
          />
        </Col>

        <Col xs={12} md={6}>
          <label className="spot-label" htmlFor="web-local">
            <FaGlobe className="me-2" />
            Sitio web
          </label>
          <input
            id="web-local"
            type="url"
            className="spot-input"
            placeholder="https://..."
            value={sitioWeb}
            onChange={(e) => onSitioWebChange(e.target.value)}
          />
        </Col>

        <Col xs={12}>
          <span className="spot-label">
            <FaClock className="me-2" />
            Horario de atención <RequiredMark />
          </span>

          {/* Rango de días de la semana */}
          <div className="horario-dias-row">
            {DIAS_SEMANA.map((dia, idx) => (
              <button
                key={dia.label}
                type="button"
                className={`horario-dia-chip${
                  diaActivo(idx) ? " active" : ""
                }${diaInicio === idx ? " start" : ""}${
                  diaFin === idx ? " end" : ""
                }`}
                onClick={() => seleccionarDia(idx)}
                aria-pressed={diaActivo(idx)}
              >
                {dia.label}
              </button>
            ))}
          </div>
          <small
            className="d-block mt-1 text-muted"
            style={{ fontSize: "0.75rem" }}
          >
            Haz clic en el día de inicio y luego en el día de cierre para
            seleccionar el rango.
          </small>

          {/* Horas de apertura y cierre */}
          <div className="d-flex flex-wrap gap-3 align-items-center mt-2">
            <span className="text-muted">Horas:</span>

            <DatePicker
              value={apertura}
              onChange={handleApertura}
              disableDayPicker
              format="hh:mm A"
              weekStartDayIndex={2}
              weekDays={WEEK_DAYS_ES}
              months={MONTHS_ES}
              plugins={[<TimePicker position="bottom" hideSeconds />]}
              inputClass="spot-input"
              style={INPUT_STYLE}
              placeholder="Apertura"
            />

            <span className="text-muted">a</span>

            <DatePicker
              value={cierre}
              onChange={handleCierre}
              disableDayPicker
              format="hh:mm A"
              weekStartDayIndex={2}
              weekDays={WEEK_DAYS_ES}
              months={MONTHS_ES}
              plugins={[<TimePicker position="bottom" hideSeconds />]}
              inputClass="spot-input"
              style={INPUT_STYLE}
              placeholder="Cierre"
            />
          </div>

          <small
            className="d-block mt-1 text-muted"
            style={{ fontSize: "0.75rem" }}
          >
            Selecciona la hora de apertura y de cierre.
          </small>
          {rangoHorasInvalido && (
            <small
              className="d-block mt-1"
              style={{ fontSize: "0.75rem", color: "#dc3545" }}
            >
              La hora de cierre debe ser mayor que la de apertura.
            </small>
          )}
          {(horario || diasLabel) && (
            <small
              className="d-block mt-1"
              style={{
                fontSize: "0.75rem",
                color: "var(--color-primary)",
                fontWeight: 500,
              }}
            >
              ✓ {horario || diasLabel}
            </small>
          )}
        </Col>
      </Row>
    </div>
  );
}
