import { useState, useEffect } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerPreferenciasNotificaciones,
  actualizarPreferenciasNotificaciones,
} from "@/services/notificacion.service";
import toast from "react-hot-toast";
import { FaBell, FaSave, FaArrowLeft } from "react-icons/fa";
import "./PreferenciasNotificaciones.css";

const canalOptions = [
  { value: "APP", label: "Solo en la aplicación" },
  { value: "EMAIL", label: "Solo por correo electrónico" },
  { value: "AMBOS", label: "Aplicación + Correo electrónico" },
];

const PreferenciasNotificaciones = ({
  enModal = false,
  onCerrar,
  onGuardado,
}) => {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [preferencias, setPreferencias] = useState({
    notificacionesActivas: true,
    canalPreferido: "APP",
  });
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    let activo = true;

    const cargarPreferenciasSeguro = async () => {
      setCargando(true);
      try {
        if (!activo) return;
        const res = await obtenerPreferenciasNotificaciones();
        if (!activo || !res) return;
        if (res.exitoso && res.data) {
          setPreferencias(res.data);
        }
      } catch (error) {
        if (activo) console.error(error);
      } finally {
        if (activo) setCargando(false);
      }
    };

    cargarPreferenciasSeguro();
    return () => {
      activo = false;
    };
  }, [usuario]);

  const handleCanalChange = (selected) => {
    setPreferencias((prev) => ({ ...prev, canalPreferido: selected.value }));
  };

  const guardarPreferencias = async () => {
    setGuardando(true);
    try {
      const res = await actualizarPreferenciasNotificaciones(preferencias);
      if (res.exitoso) {
        toast.success("Preferencias guardadas correctamente");
        onGuardado?.(preferencias);
      } else {
        toast.error("Error al guardar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const handleVolver = () => {
    if (enModal) {
      onCerrar?.();
    } else {
      navigate(-1);
    }
  };

  if (cargando) {
    return <div className="text-center py-5">Cargando...</div>;
  }

  const contenido = (
    <div className="preferencias-card">
      <div className="card-body">
        <div className="mb-1">
          {" "}
          <div className="form-check form-switch custom-switch d-flex align-items-center gap-3">
            <input
              className="form-check-input"
              type="checkbox"
              name="notificacionesActivas"
              checked={preferencias.notificacionesActivas}
              onChange={(e) =>
                setPreferencias((prev) => ({
                  ...prev,
                  notificacionesActivas: e.target.checked,
                }))
              }
              id="notificacionesActivas"
            />
            <label
              className="form-check-label fw-bold fs-5 d-flex align-items-center gap-2"
              htmlFor="notificacionesActivas"
            >
              <FaBell
                className={`bell-icon ${preferencias.notificacionesActivas ? "bell-ringing" : ""}`}
              />
              Recibir notificaciones
            </label>
          </div>
        </div>

        {/* Canal preferido con react-select */}
        <div className="mb-1 select-container">
          <label className="form-label fw-bold section-title" htmlFor="canalPreferido">
            Canal preferido
          </label>
          <Select
            id="canalPreferido"
            name="canalPreferido"
            options={canalOptions}
            value={canalOptions.find(
              (opt) => opt.value === preferencias.canalPreferido,
            )}
            onChange={handleCanalChange}
            classNamePrefix="spot-select"
            isSearchable={false}
            isDisabled={!preferencias.notificacionesActivas}
            menuPosition="fixed"
          />
        </div>
        {/* Botones */}
        <div className="d-flex justify-content-between pt-4">
          <button
            type="button"
            className="btn-volver-preferencias d-flex align-items-center justify-content-center gap-2"
            onClick={handleVolver}
          >
            <FaArrowLeft /> {enModal ? "Cancelar" : "Volver"}
          </button>

          <button
            type="button"
            className="preferencias-btn d-flex align-items-center justify-content-center gap-2"
            onClick={guardarPreferencias}
            disabled={guardando}
          >
            {guardando ? (
              <span className="spinner-border spinner-border-sm" />
            ) : (
              <FaSave />
            )}
            {guardando ? "Guardando..." : "Guardar Preferencias"}
          </button>
        </div>
      </div>
    </div>
  );

  if (enModal) {
    return contenido;
  }

  return (
    <div className="preferencias-container">
      <div className="page-container">
        <div className="preferencias-header">
          <span className="preferencias-subtitle">Configuración</span>
          <h2 className="preferencias-title">Preferencias de Notificaciones</h2>
          <div className="preferencias-line" />
        </div>
        {contenido}
      </div>
    </div>
  );
};

export default PreferenciasNotificaciones;
