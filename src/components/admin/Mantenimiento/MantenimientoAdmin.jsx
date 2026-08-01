import { useState, useEffect, useCallback, useRef } from "react";
import {
  FaTools,
  FaTrash,
  FaPlus,
  FaSync,
  FaCalendarAlt,
} from "react-icons/fa";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Spanish } from "flatpickr/dist/l10n/es.js";
import SpinnerLoader from "@/components/common/SpinnerLoader/SpinnerLoader";
import {
  listarMantenimientosProgramados,
  programarMantenimiento,
  cancelarMantenimiento,
} from "@/services/mantenimiento.service";
import "./MantenimientoAdmin.css";

flatpickr.localize(Spanish);

const FORM_INICIAL = {
  motivo: "",
  mensajePersonalizado: "",
};

// Formato interno de flatpickr; el valor real que se envía al backend se
// arma aparte en aIsoLocal() a partir del objeto Date, así que esto solo
// afecta al input oculto.
const FORMATO_FLATPICKR = "Y-m-d H:i";

const formatearParaMostrar = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const estaActivoAhora = (m) => {
  const ahora = Date.now();
  return (
    new Date(m.fechaInicio).getTime() <= ahora &&
    ahora <= new Date(m.fechaFin).getTime()
  );
};

export default function MantenimientoAdmin() {
  const [programados, setProgramados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);

  const inicioRef = useRef(null);
  const finRef = useRef(null);

  const cargarProgramados = useCallback(async () => {
    setCargando(true);
    const resultado = await listarMantenimientosProgramados();
    if (resultado.exitoso) {
      setProgramados(resultado.data);
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          resultado.mensaje ||
          "No se pudieron cargar los mantenimientos programados",
      });
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarProgramados();
  }, [cargarProgramados]);

  // Flatpickr con selección de fecha y hora, en español
  useEffect(() => {
    // React StrictMode (dev) monta -> desmonta -> vuelve a montar los efectos.
    // Si el input ya tiene una instancia de flatpickr colgada (de un montaje
    // anterior que no llegó a limpiarse), la destruimos antes de crear otra.
    // Sin esto, cada input terminaba con su altInput duplicado.
    inicioRef.current?._flatpickr?.destroy();
    finRef.current?._flatpickr?.destroy();

    const configComun = {
      enableTime: true,
      time_24hr: true,
      dateFormat: FORMATO_FLATPICKR,
      altInput: true,
      altInputClass:
        "form-control rounded-pill input-without-focus flatpickr-alt-input",
      altFormat: "d/m/Y H:i",
      minDate: "today",
    };

    const pickerInicio = flatpickr(inicioRef.current, {
      ...configComun,
      onChange: ([date]) => setFechaInicio(date || null),
    });

    const pickerFin = flatpickr(finRef.current, {
      ...configComun,
      onChange: ([date]) => setFechaFin(date || null),
    });

    return () => {
      pickerInicio.destroy();
      pickerFin.destroy();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const limpiarFormulario = () => {
    setForm(FORM_INICIAL);
    setFechaInicio(null);
    setFechaFin(null);
    inicioRef.current._flatpickr?.clear();
    finRef.current._flatpickr?.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      Swal.fire({
        icon: "warning",
        title: "Faltan fechas",
        text: "Selecciona la fecha/hora de inicio y de fin del mantenimiento",
      });
      return;
    }

    if (!form.motivo.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta el motivo",
        text: "Indica el motivo del mantenimiento (se incluye en el aviso a los usuarios)",
      });
      return;
    }

    const confirmacion = await Swal.fire({
      icon: "question",
      title: "¿Programar mantenimiento?",
      html: `Se notificará <strong>a todos los usuarios</strong> que el servidor estará en mantenimiento de<br/>
             <strong>${formatearParaMostrar(fechaInicio)}</strong> a <strong>${formatearParaMostrar(fechaFin)}</strong>.`,
      showCancelButton: true,
      confirmButtonText: "Sí, programar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;

    setEnviando(true);
    const resultado = await programarMantenimiento({
      fechaInicio: aIsoLocal(fechaInicio),
      fechaFin: aIsoLocal(fechaFin),
      motivo: form.motivo.trim(),
      mensajePersonalizado: form.mensajePersonalizado,
    });
    setEnviando(false);

    if (resultado.exitoso) {
      Swal.fire({
        icon: "success",
        title: "Mantenimiento programado",
        text: "Se notificó a todos los usuarios",
      });
      limpiarFormulario();
      cargarProgramados();
    } else {
      Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
    }
  };

  const handleCancelar = async (mantenimiento) => {
    const confirmacion = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar este mantenimiento?",
      text: "Se notificará a todos los usuarios que ya no aplica.",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });
    if (!confirmacion.isConfirmed) return;

    const resultado = await cancelarMantenimiento(mantenimiento.id);
    if (resultado.exitoso) {
      Swal.fire({
        icon: "success",
        title: "Cancelado",
        text: "El mantenimiento fue cancelado",
      });
      cargarProgramados();
    } else {
      Swal.fire({ icon: "error", title: "Error", text: resultado.mensaje });
    }
  };

  return (
    <div className="mantenimiento-admin">
      <div className="mantenimiento-admin-header">
        <div className="mantenimiento-header-left">
          <span className="mantenimiento-subtitle">Administración</span>
          <h2>
            <FaTools /> Mantenimiento del sistema
          </h2>
          <div className="mantenimiento-line" />
        </div>

        <button
          className="btn-refrescar"
          onClick={cargarProgramados}
          disabled={cargando}
        >
          <FaSync className={cargando ? "girando" : ""} /> Refrescar
        </button>
      </div>

      <form className="mantenimiento-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label className="mantenimiento-label">
              <FaCalendarAlt /> Inicio
            </label>
            <input
              ref={inicioRef}
              className="form-control rounded-pill input-without-focus"
              placeholder="Selecciona fecha y hora"
              readOnly
            />
          </div>

          <div className="form-group">
            <label className="mantenimiento-label">
              <FaCalendarAlt /> Fin
            </label>
            <input
              ref={finRef}
              className="form-control rounded-pill input-without-focus"
              placeholder="Selecciona fecha y hora"
              readOnly
            />
          </div>
        </div>

        <div className="form-group">
          <label className="mantenimiento-label">Motivo</label>
          <input
            type="text"
            name="motivo"
            className="form-control rounded-pill input-without-focus"
            placeholder="Ej: Actualización de base de datos"
            value={form.motivo}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label className="mantenimiento-label">
            Mensaje personalizado (opcional)
          </label>
          <textarea
            name="mensajePersonalizado"
            className="form-control input-without-focus"
            rows={3}
            placeholder="Si lo dejas vacío, se genera un mensaje automático con las fechas y el motivo"
            value={form.mensajePersonalizado}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn-programar" disabled={enviando}>
          <FaPlus />{" "}
          {enviando ? "Programando..." : "Programar y notificar a todos"}
        </button>
      </form>

      <h3 className="mantenimiento-admin-subtitulo">
        Mantenimientos programados
      </h3>

      {cargando ? (
        <SpinnerLoader texto="Cargando..." />
      ) : programados.length === 0 ? (
        <div className="mantenimiento-vacio">
          <p>No hay mantenimientos programados actualmente.</p>
        </div>
      ) : (
        <div className="tabla-mantenimientos-wrapper">
          <table className="tabla-mantenimientos">
            <thead>
              <tr>
                <th>Estado</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Motivo</th>
                <th>Programado por</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {programados.map((m) => (
                <tr key={m.id}>
                  <td>
                    {estaActivoAhora(m) ? (
                      <span className="badge-estado badge-activo">
                        Activo ahora
                      </span>
                    ) : (
                      <span className="badge-estado badge-pendiente">
                        Próximo
                      </span>
                    )}
                  </td>
                  <td>{formatearParaMostrar(m.fechaInicio)}</td>
                  <td>{formatearParaMostrar(m.fechaFin)}</td>
                  <td>{m.motivo}</td>
                  <td>{m.creadoPor}</td>
                  <td>
                    <button
                      className="btn-cancelar-mantenimiento"
                      title="Cancelar mantenimiento"
                      onClick={() => handleCancelar(m)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Flatpickr con altInput ya nos da un objeto Date en horario local;
// lo formateamos a "Y-m-dTH:i:S" (sin milisegundos ni zona) para el backend.
function aIsoLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
}