import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { FaStar } from "react-icons/fa";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";
import {
  obtenerConfiguracionPuntosAdmin,
  actualizarConfiguracionPuntosAdmin,
  ajustarPuntosUsuarioAdmin,
  listarUsuariosAdmin,
} from "@/services/admin.service";
import "./AdminPuntosPage.css";

const AdminPuntosPage = () => {
  const [config, setConfig] = useState({
    puntosSpot: 10,
    puntosResena: 5,
    puntosGuardado: 3,
    puntosBase: 0,
    limiteDiario: 100,
  });
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [ajuste, setAjuste] = useState({ usuarioId: "", delta: "", motivo: "" });

  useEffect(() => {
    let activo = true;

    async function init() {
      try {
        const res = await obtenerConfiguracionPuntosAdmin();
        if (activo && res.exitoso && res.datos) {
          setConfig(res.datos);
        }
      } catch (error) {
        console.error("Error cargando configuración:", error);
      }

      try {
        const res = await listarUsuariosAdmin(0, 50);
        if (activo && res.exitoso) {
          setUsuarios(res.data?.content || []);
        }
      } catch (error) {
        console.error("Error cargando usuarios:", error);
      } finally {
        if (activo) setCargando(false);
      }
    }

    init();
    return () => {
      activo = false;
    };
  }, []);

  const handleGuardarConfig = async () => {
    setGuardando(true);
    try {
      const res = await actualizarConfiguracionPuntosAdmin(config);
      if (res.exitoso) {
        toast.success("Configuración guardada correctamente");
      } else {
        toast.error(res.mensaje || "Error al guardar");
      }
    } catch {
      toast.error("Error de conexión");
    } finally {
      setGuardando(false);
    }
  };

  const handleAjuste = async () => {
    if (!ajuste.usuarioId || ajuste.delta === "") {
      toast.error("Selecciona un usuario y un delta");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Ajustar puntos?",
      text: `Se aplicará un delta de ${ajuste.delta} puntos a este usuario.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, ajustar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await ajustarPuntosUsuarioAdmin(ajuste.usuarioId, {
        delta: Number(ajuste.delta),
        motivo: ajuste.motivo || "Ajuste manual",
      });
      if (res.exitoso) {
        toast.success("Puntos ajustados correctamente");
        setAjuste({ usuarioId: "", delta: "", motivo: "" });
      } else {
        toast.error(res.mensaje || "Error al ajustar");
      }
    } catch {
      toast.error("Error de conexión");
    }
  };

  if (cargando) {
    return (
      <div className="admin-puntos-page">
        <Container fluid>
          <div className="puntos-page-header">
            <h1 className="page-title">
              <FaStar className="title-icon" />
              Sistema de Puntos y Niveles
            </h1>
          </div>
          <div className="puntos-card">
            <div className="suspense-loader">
              <span>Cargando configuración...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-puntos-page">
      <Container fluid>
        <div className="puntos-page-header">
          <div className="header-left">
            <h1 className="page-title">
              <FaStar className="title-icon" />
              Sistema de Puntos y Niveles
            </h1>
            <p className="page-subtitle">
              Configura los valores de puntos y realiza ajustes manuales
            </p>
          </div>
        </div>

        <div className="puntos-grid">
          <div className="puntos-card">
            <h2 className="card-title">Configuración de puntos</h2>
            <p className="card-subtitle">
              Define cuántos puntos otorga cada acción
            </p>

            <div className="puntos-form">
              <div className="form-group">
                <label htmlFor="puntosSpot">Puntos por spot creado</label>
                <input
                  id="puntosSpot"
                  type="number"
                  value={config.puntosSpot}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfig({ ...config, puntosSpot: v === '' ? 0 : Number(v) });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="puntosResena">Puntos por reseña</label>
                <input
                  id="puntosResena"
                  type="number"
                  value={config.puntosResena}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfig({ ...config, puntosResena: v === '' ? 0 : Number(v) });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="puntosGuardado">Puntos por spot guardado</label>
                <input
                  id="puntosGuardado"
                  type="number"
                  value={config.puntosGuardado}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfig({ ...config, puntosGuardado: v === '' ? 0 : Number(v) });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="puntosBase">Puntos base (inicio nivel)</label>
                <input
                  id="puntosBase"
                  type="number"
                  value={config.puntosBase}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfig({ ...config, puntosBase: v === '' ? 0 : Number(v) });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="limiteDiario">Límite diario de puntos</label>
                <input
                  id="limiteDiario"
                  type="number"
                  value={config.limiteDiario}
                  onChange={(e) => {
                    const v = e.target.value;
                    setConfig({ ...config, limiteDiario: v === '' ? 0 : Number(v) });
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-guardar-config"
              onClick={handleGuardarConfig}
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar configuración"}
            </button>
          </div>

          <div className="puntos-card">
            <h2 className="card-title">Ajuste manual</h2>
            <p className="card-subtitle">
              Suma o resta puntos a un usuario con motivo
            </p>

            <div className="puntos-form">
              <div className="form-group">
                <label htmlFor="ajusteUsuario">Usuario</label>
                <select
                  id="ajusteUsuario"
                  value={ajuste.usuarioId}
                  onChange={(e) =>
                    setAjuste({ ...ajuste, usuarioId: e.target.value })
                  }
                >
                  <option value="">Selecciona un usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombresCompletos} (@{u.nombreUsuario})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="ajusteDelta">Delta (positivo o negativo)</label>
                <input
                  id="ajusteDelta"
                  type="number"
                  value={ajuste.delta}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAjuste({ ...ajuste, delta: v === '' ? '' : v });
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ajusteMotivo">Motivo</label>
                <input
                  id="ajusteMotivo"
                  type="text"
                  value={ajuste.motivo}
                  onChange={(e) =>
                    setAjuste({ ...ajuste, motivo: e.target.value })
                  }
                  placeholder="Ej: bonificación evento"
                />
              </div>
            </div>

            <button
              type="button"
              className="btn-ajustar-puntos"
              onClick={handleAjuste}
            >
              Aplicar ajuste
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AdminPuntosPage;
