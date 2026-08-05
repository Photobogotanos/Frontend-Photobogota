import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { FaArrowLeft } from "react-icons/fa";
import PerfilHeader from "../MiPerfil/PerfilHeader";
import PerfilStats from "../MiPerfil/PerfilStats";
import PerfilTabs from "../MiPerfil/PerfilTabs";
import FotoPerfilModal from "../FotoPerfilModal/FotoPerfilModal";
import ReportarPerfilModal from "@/components/perfil/ReportarPerfilModal/ReportarPerfilModal";
import { obtenerPerfil } from "@/services/usuario.service";
import { useAuth } from "@/context/AuthContext";
import "./UsuarioPerfil.css";

const ESTADO_INICIAL_PERFIL = {
  nombresCompletos: "",
  nombreUsuario: "",
  email: "",
  biografia: "",
  telefono: "",
  fotoPerfil: null,
  rol: "MIEMBRO",
  nivel: null,
  totalSpots: 0,
  totalResenas: 0,
  totalGuardados: 0,
};

export default function UsuarioPerfil() {
  const { nombreUsuario: nombreUsuarioParam } = useParams();
  const navigate = useNavigate();
  const { usuario } = useAuth();

  const [tab, setTab] = useState("publicaciones");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noExiste, setNoExiste] = useState(false);
  const [perfilData, setPerfilData] = useState(ESTADO_INICIAL_PERFIL);
  const [mostrarFoto, setMostrarFoto] = useState(false);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      if (!nombreUsuarioParam) return;

      setLoading(true);
      setError(null);
      setNoExiste(false);

      try {
        if (!activo) return;

        const resultado = await obtenerPerfil(nombreUsuarioParam);

        if (!activo || !resultado) return;

        if (resultado?.exitoso && resultado.datos) {
          setPerfilData((prev) => ({
            ...prev,
            nombresCompletos: resultado.datos.nombresCompletos || "Usuario",
            nombreUsuario:
              resultado.datos.nombreUsuario || nombreUsuarioParam,
            email: resultado.datos.email || "",
            biografia: resultado.datos.biografia || "",
            telefono: resultado.datos.telefono || "",
            fotoPerfil: resultado.datos.fotoPerfil || null,
            rol: (
              resultado.datos.rol ||
              resultado.datos.tipoUsuario ||
              "MIEMBRO"
            ).toUpperCase(),
            nivel: resultado.datos.nivel ?? null,
            totalSpots: resultado.datos.totalSpots ?? 0,
            totalResenas: resultado.datos.totalResenas ?? 0,
            totalGuardados: resultado.datos.totalGuardados ?? 0,
          }));
          setNoExiste(false);

          if (resultado.esMock) {
            setError(
              "Servidor no disponible. Mostrando datos de demostración.",
            );
          }
        } else {
          // 404 o error de negocio: el service retorna exitoso:false + mensaje
          const es404 = /no existe/i.test(resultado?.mensaje || "");
          setNoExiste(es404);
          if (!es404) {
            setError(
              resultado?.mensaje || "No se pudo cargar el perfil del usuario.",
            );
          }
        }
      } catch {
        if (!activo) return;
        setError("Error al cargar el perfil. Intenta más tarde.");
      } finally {
        if (activo) setLoading(false);
      }
    };

    cargarPerfil();
    return () => {
      activo = false;
    };
  }, [nombreUsuarioParam]);

  // Si el perfil visto es el del usuario logueado → redirigir a Mi Perfil
  const esPerfilPropio =
    !!usuario &&
    (nombreUsuarioParam || "").toLowerCase() ===
      (usuario?.nombreUsuario ||
        usuario?.nombre ||
        usuario?.username?.replace(/^@/, "") ||
        "").toLowerCase();

  useEffect(() => {
    if (esPerfilPropio) {
      navigate("/perfil", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esPerfilPropio]);

  const dispatchTabs = (action) => {
    if (action.type === "SET_TAB") setTab(action.payload);
    if (action.type === "SET_MOSTRAR_FOTO_PERFIL") setMostrarFoto(action.payload);
  };

  const handleReportar = () => setMostrarReporte(true);

  const handleVolver = () => navigate(-1);

  if (loading) {
    return (
      <Container fluid className="perfil-container">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3 text-muted">Cargando perfil de usuario…</p>
        </div>
      </Container>
    );
  }

  if (noExiste) {
    return (
      <Container fluid className="perfil-container">
        <div className="text-center py-5">
          <div
            className="empty-icon"
            style={{ color: "#999", margin: "0 auto 1rem" }}
          >
            <FaArrowLeft size={48} />
          </div>
          <h3 className="perfil-nombre">Usuario no encontrado</h3>
          <p className="text-muted mb-4">
            @{nombreUsuarioParam} no corresponde a ninguna cuenta en la
            plataforma.
          </p>
          <button
            type="button"
            className="btn-editar-perfil"
            onClick={() => navigate("/")}
          >
            Volver al inicio
          </button>
        </div>
      </Container>
    );
  }

  const stats = {
    totalSpots: perfilData.totalSpots,
    totalResenas: perfilData.totalResenas,
    totalGuardados: perfilData.totalGuardados,
  };

  return (
    <Container fluid className="perfil-container">
      {error && (
        <div className="perfil-error-banner" role="alert">
          {error}
        </div>
      )}

      <button
        type="button"
        className="perfil-ajeno-back"
        onClick={handleVolver}
      >
        <FaArrowLeft /> Volver atrás
      </button>

      <PerfilHeader
        perfilData={perfilData}
        dispatch={dispatchTabs}
        rol={perfilData.rol}
        nivel={perfilData.nivel}
        usandoMock={false}
        esPerfilPropio={false}
        onReportar={handleReportar}
      />

      <div className="line-divider" />

      <PerfilStats
        rol={perfilData.rol}
        stats={stats}
        esPerfilPropio={false}
      />

      <div className="line-divider" />

      <PerfilTabs
        tab={tab}
        dispatch={dispatchTabs}
        rol={perfilData.rol}
        nombreUsuario={perfilData.nombreUsuario}
        usandoMock={false}
        esPerfilPropio={false}
        onDatosCargados={() => {}}
      />

      <FotoPerfilModal
        show={mostrarFoto}
        onHide={() => setMostrarFoto(false)}
        foto={perfilData.fotoPerfil}
        nombre={perfilData.nombresCompletos}
      />

      <ReportarPerfilModal
        show={mostrarReporte}
        onHide={() => setMostrarReporte(false)}
        perfilData={perfilData}
      />
    </Container>
  );
}
