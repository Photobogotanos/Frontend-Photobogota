import { useReducer, useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
import { toast } from "react-hot-toast";

// Geocodificación inversa ligera (coordenadas -> dirección)
const obtenerDireccionDesdeCoordenadas = async (lat, lng, signal) => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=es`;
    const response = await fetch(url, {
      signal,
      headers: {
        "User-Agent": "Photobogota/1.0 (photobogota123@gmail.com)",
      },
    });
    if (!response.ok) return "";
    const data = await response.json();
    const a = data?.address;
    if (!a) return data?.display_name || "";

    const partes = [];
    if (a.road) {
      partes.push(
        `${a.house_number ? `${a.house_number} ` : ""}${a.road}`.trim(),
      );
    }
    if (a.neighbourhood) partes.push(a.neighbourhood);
    else if (a.suburb) partes.push(a.suburb);
    else if (a.city_district) partes.push(a.city_district);
    if (a.city || a.town || a.village || a.municipality) {
      partes.push(a.city || a.town || a.village || a.municipality);
    }
    return partes.join(", ");
  } catch (error) {
    if (error.name === "AbortError") return ""; // Petición cancelada intencionalmente
    return "";
  }
};

const esUrlSegura = (url) => {
  return (
    typeof url === "string" &&
    (url.startsWith("blob:") || url.startsWith("data:image/"))
  );
};

export default function CrearSpot() {
  const location = useLocation();
  const [state, dispatch] = useReducer(spotFormReducer, initialState);
  const previewsRef = useRef([]);
  const coordsDesdeMapaAplicadas = useRef(false);

  useEffect(() => {
    previewsRef.current = state.previews;
  }, [state.previews]);

  const cargarDireccionUbicacion = useCallback((lat, lng, controller) => {
    obtenerDireccionDesdeCoordenadas(lat, lng, controller.signal)
      .then((dir) => {
        if (dir) {
          dispatch({ type: "SET_DIRECCION", payload: dir });
        }
      })
      .catch(() => {
        // Ignorar cancelaciones
      });
  }, []);

  useEffect(() => {
    if (coordsDesdeMapaAplicadas.current) return;
    const { lat, lng, desdeMapa } = location.state || {};
    if (!desdeMapa || lat == null || lng == null) return;

    coordsDesdeMapaAplicadas.current = true;
    dispatch({ type: "SET_LATITUD", payload: lat });
    dispatch({ type: "SET_LONGITUD", payload: lng });

    toast("Ubicación cargada desde el mapa", { duration: 2800 });

    const controller = new AbortController();
    cargarDireccionUbicacion(lat, lng, controller);

    return () => {
      controller.abort();
    };
  }, [location.state, cargarDireccionUbicacion]);

  const { usuario } = useAuth();
  const esSocio = usuario?.rol === "SOCIO";

  useEffect(() => {
    dispatch({
      type: "SET_TIPO",
      payload: esSocio ? "LOCAL" : "SPOT",
    });
  }, [esSocio]);

  const { handlePublicar } = usePublicacionSpot({ state, dispatch, esSocio });

  const handleImagen = (files) => {
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const currentPreviewUrlsRef = useRef([]);

  useEffect(() => {
    if (!state.imagenes || state.imagenes.length === 0) {
      currentPreviewUrlsRef.current.forEach((url) => {
        if (esUrlSegura(url) && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
      currentPreviewUrlsRef.current = [];
      dispatch({ type: "SET_PREVIEWS", payload: [] });
      return;
    }

    const objectUrls = [];
    for (const file of state.imagenes) {
      objectUrls.push(URL.createObjectURL(file));
    }
    currentPreviewUrlsRef.current = objectUrls;
    dispatch({ type: "SET_PREVIEWS", payload: objectUrls });

    return () => {
      for (const url of objectUrls) {
        URL.revokeObjectURL(url);
      }
      if (currentPreviewUrlsRef.current === objectUrls) {
        currentPreviewUrlsRef.current = [];
      }
    };
  }, [state.imagenes]);

  const handleRemoveImagen = (idx) => {
    const newImagenes = state.imagenes.filter((_, i) => i !== idx);
    dispatch({ type: "SET_IMAGENES", payload: newImagenes });

    const nuevoIdx = Math.min(state.indiceImagenActual, newImagenes.length - 1);
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

  return (
    <div className="pb-5">
      <div className="formulario-contenedor">
        <HeaderSpot esSocio={esSocio} />

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
              esSocio={esSocio}
            />
          </Col>
        </Row>

        <SpotBotones
          onPreview={() => dispatch({ type: "SET_SHOW_MODAL", payload: true })}
          onPublish={handlePublicar}
          cargando={state.cargando}
        />

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
