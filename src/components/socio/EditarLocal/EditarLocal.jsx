import { useReducer, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaExclamationTriangle } from "react-icons/fa";
import BackButton from "@/components/common/BackButton";
import { useAuth } from "@/context/AuthContext";
import { obtenerSpotPorId } from "@/services/spot.service";
import { esLocalPropio } from "@/utils/spot.util";
import SeccionImagenes from "@/components/spots/CreacionSpotForm/SeccionImagenes";
import SpotInformacionBasica from "@/components/spots/CreacionSpotForm/SpotInformacionBasica";
import SpotCategorizacion from "@/components/spots/CreacionSpotForm/SpotCategorizacion";
import SpotDescripcion from "@/components/spots/CreacionSpotForm/SpotDescripcion";
import SpotDatosLocal from "@/components/spots/CreacionSpotForm/SpotDatosLocal";
import SpotPreviewModal from "@/components/spots/SpotPreviewModal/SpotPreviewModal";
import EditarLocalHeader from "./EditarLocalHeader";
import EditarLocalBotones from "./EditarLocalBotones";
import { editarLocalReducer, initialState } from "./editarLocalReducer";
import { useActualizarLocal } from "./useActualizarLocal";
import { useEdicionImagenes } from "./useEdicionImagenes";
import "@/components/spots/CreacionSpotForm/CreacionSpotForm.css";
import "./EditarLocal.css";

export default function EditarLocal() {
  const { id } = useParams();
  const { usuario } = useAuth();
  const [state, dispatch] = useReducer(editarLocalReducer, initialState);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const esSocio = usuario?.rol === "SOCIO";

  useEffect(() => {
    let activo = true;

    const cargar = async () => {
      if (!id) {
        setErrorCarga("No se encontró el identificador del local.");
        setCargandoDatos(false);
        return;
      }

      setCargandoDatos(true);
      if (!activo) return;

      const resultado = await obtenerSpotPorId(id);
      if (!activo || !resultado) return;

      if (!resultado.exitoso || !resultado.datos) {
        setErrorCarga(resultado.mensaje || "No se pudo cargar el local.");
        setCargandoDatos(false);
        return;
      }

      const local = resultado.datos;

      if ((local.tipo || "").toUpperCase() !== "LOCAL") {
        setErrorCarga(
          "Este establecimiento no es un local gestionable por un socio.",
        );
        setCargandoDatos(false);
        return;
      }

      if (!esLocalPropio(local, usuario)) {
        setErrorCarga("No tienes permisos para editar este local.");
        setCargandoDatos(false);
        return;
      }

      dispatch({ type: "SET_LOCAL", payload: local });
      setCargandoDatos(false);
    };

    cargar();

    return () => {
      activo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- solo se carga al montar o al cambiar id
  }, [id]);

  const {
    handleImagen,
    handleRemoveImagen,
    handleNavigate,
  } = useEdicionImagenes({ state, dispatch });

  const { handleGuardar } = useActualizarLocal({ state, dispatch, localId: id });

  const spotData = {
    nombre: state.nombreLugar || "Nombre del lugar",
    direccion: state.direccion || "Dirección del lugar",
    horario: state.horario || null,
    imagen: state.previews[0] || null,
    rating: 0,
    totalResenas: 0,
    categoria: state.categoria?.label || "Categoría",
    localidad: state.localidad?.label || null,
    descripcion: state.descripcionImagen || "Descripción del lugar...",
    recomendacion: state.recomendacion || null,
    tipsFoto: state.tipsFoto || null,
    resenas: [],
  };

  if (cargandoDatos) {
    return (
      <div className="editar-local-estado text-center py-5">
        <Spinner animation="border" role="status" style={{ color: "#806fbe" }} />
        <p className="text-muted mt-3 mb-0">Cargando tu local...</p>
      </div>
    );
  }

  if (errorCarga) {
    return (
      <div className="editar-local-container">
        <Alert variant="warning" className="d-flex align-items-center gap-2">
          <FaExclamationTriangle />
          <span>{errorCarga}</span>
        </Alert>
        <div className="d-flex gap-2">
          <BackButton />
          <a href="/locales" className="btn btn-sm btn-explorar">
            Volver a mis locales
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="editar-local-container pb-5">
      <EditarLocalHeader />

      {state.deshabilitado && (
        <div className="editar-local-avisodeshab">
          <FaExclamationTriangle />
          <span>
            Este local está deshabilitado, por lo que no aparece en el mapa
            público. Podrás activarlo de nuevo desde "Mis Locales".
          </span>
        </div>
      )}

      <div className="formulario-contenedor">
        <Row className="g-4">
          <Col xs={12}>
            <SeccionImagenes
              previews={state.previews || []}
              indice={state.indiceImagenActual}
              onImageChange={handleImagen}
              onRemove={handleRemoveImagen}
              onNavigate={handleNavigate}
              onSelectIndice={(idx) =>
                dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })
              }
            />

            <SpotInformacionBasica
              nombreLugar={state.nombreLugar}
              direccion={state.direccion}
              latitud={state.latitud}
              longitud={state.longitud}
              onNombreChange={(val) =>
                dispatch({ type: "SET_NOMBRE_LUGAR", payload: val })
              }
              onDireccionChange={(val) =>
                dispatch({ type: "SET_DIRECCION", payload: val })
              }
              onLatitudChange={(val) =>
                dispatch({ type: "SET_LATITUD", payload: val })
              }
              onLongitudChange={(val) =>
                dispatch({ type: "SET_LONGITUD", payload: val })
              }
              esSocio={esSocio}
            />

            <SpotCategorizacion
              categoria={state.categoria}
              localidad={state.localidad}
              onCategoriaChange={(val) =>
                dispatch({ type: "SET_CATEGORIA", payload: val })
              }
              onLocalidadChange={(val) =>
                dispatch({ type: "SET_LOCALIDAD", payload: val })
              }
            />

            <SpotDatosLocal
              telefono={state.telefono}
              horario={state.horario}
              sitioWeb={state.sitioWeb}
              onTelefonoChange={(v) =>
                dispatch({ type: "SET_TELEFONO", payload: v })
              }
              onHorarioChange={(v) =>
                dispatch({ type: "SET_HORARIO", payload: v })
              }
              onSitioWebChange={(v) =>
                dispatch({ type: "SET_SITIO_WEB", payload: v })
              }
            />

            <SpotDescripcion
              descripcionImagen={state.descripcionImagen}
              recomendacion={state.recomendacion}
              tipsFoto={state.tipsFoto}
              onDescripcionChange={(val) =>
                dispatch({ type: "SET_DESCRIPCION", payload: val })
              }
              onRecomendacionChange={(val) =>
                dispatch({ type: "SET_RECOMENDACION", payload: val })
              }
              onTipsFotoChange={(val) =>
                dispatch({ type: "SET_TIPS_FOTO", payload: val })
              }
              esSocio
            />
          </Col>
        </Row>
      </div>

      <EditarLocalBotones
        onPreview={() => dispatch({ type: "SET_SHOW_MODAL", payload: true })}
        onGuardar={handleGuardar}
        cargando={state.cargando}
      />

      <SpotPreviewModal
        show={state.showModal}
        onHide={() => dispatch({ type: "SET_SHOW_MODAL", payload: false })}
        spotData={spotData}
        previews={state.previews || []}
      />
    </div>
  );
}