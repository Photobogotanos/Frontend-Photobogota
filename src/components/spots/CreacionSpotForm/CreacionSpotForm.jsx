import { useReducer, useRef, useEffect } from "react";
import "./CreacionSpotForm.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useAuth } from "@/context/AuthContext";
import SpotPreviewModal from "../SpotPreviewModal/SpotPreviewModal";
import HeaderSpot from "./HeaderSpot";
import SpotInformacionBasica from "./SpotInformacionBasica";
import SpotCategorizacion from "./SpotCategorizacion";
import SpotDescripcion from "./SpotDescripcion";
import SpotBotones from "./SpotBotones";
import SpotDatosLocal from "./SpotDatosLocal";
import SeccionImagenes from "./SeccionImagenes";
import { spotFormReducer, initialState } from "./creacionSpotReducer";
import { usePublicacionSpot } from "./usePublicacionSpot";

// ============================================================
// COMPONENTE PRINCIPAL CrearSpot
// ============================================================
export default function CrearSpot() {
  const [state, dispatch] = useReducer(spotFormReducer, initialState);
  const previewsRef = useRef([]);

  useEffect(() => {
    previewsRef.current = state.previews;
  }, [state.previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
      previewsRef.current = [];
    };
  }, []);

  const { usuario } = useAuth();
  const esSocio = usuario?.rol === "SOCIO";

  // opcional: useEffect para fijar tipo
  useEffect(() => {
    dispatch({
      type: "SET_TIPO",
      payload: esSocio ? "LOCAL" : "SPOT",
    });
  }, [esSocio]);

  const { handlePublicar } = usePublicacionSpot({ state, dispatch, esSocio });

  // ============================================================
  // HANDLERS DE IMÁGENES
  // ============================================================
  const handleImagen = (files) => {
    // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke -- se revoca en handleRemoveImagen y en unmount (previewsRef)
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({
      type: "SET_PREVIEWS",
      payload: [...state.previews, ...newPreviews],
    });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const handleRemoveImagen = (idx) => {
    const url = state.previews[idx];
    if (url) URL.revokeObjectURL(url);
    const newImagenes = state.imagenes.filter((_, i) => i !== idx);
    const newPreviews = state.previews.filter((_, i) => i !== idx);
    dispatch({ type: "SET_IMAGENES", payload: newImagenes });
    dispatch({ type: "SET_PREVIEWS", payload: newPreviews });

    // Ajustar el índice actual
    const nuevoIdx = Math.min(state.indiceImagenActual, newPreviews.length - 1);
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  const handleNavigate = (dir) => {
    const total = state.previews.length;
    const next =
      dir === "next"
        ? (state.indiceImagenActual + 1) % total
        : (state.indiceImagenActual - 1 + total) % total;
    dispatch({ type: "SET_INDICE_IMAGEN", payload: next });
  };

  // ============================================================
  // DATOS PARA EL MODAL DE PREVIEW
  // ============================================================
  const spotData = {
    nombre: state.nombreLugar || "Nombre del lugar",
    direccion: state.direccion || "Dirección del lugar",
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

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        <HeaderSpot />

        <Row className="g-4">
          <Col xs={12}>
            <SeccionImagenes
              previews={state.previews}
              indice={state.indiceImagenActual}
              onImageChange={handleImagen}
              onRemove={handleRemoveImagen}
              onNavigate={handleNavigate}
              onSelectIndice={(idx) =>
                dispatch({ type: "SET_INDICE_IMAGEN", payload: idx })
              }
            />

            {/* Información básica */}
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
            />

            {/* Categorización */}
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

            {/* Datos en caso de ser socio */}
            {esSocio && (
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
            )}

            {/* Descripción y detalles */}
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
            />
          </Col>
        </Row>

        {/* Botones de acción */}
        <SpotBotones
          onPreview={() => dispatch({ type: "SET_SHOW_MODAL", payload: true })}
          onPublish={handlePublicar}
          cargando={state.cargando}
        />

        {/* Modal de previsualización */}
        <SpotPreviewModal
          show={state.showModal}
          onHide={() => dispatch({ type: "SET_SHOW_MODAL", payload: false })}
          spotData={spotData}
          previews={state.previews}
        />
      </div>
    </div>
  );
}
