import { useEffect, useRef } from "react";

const esBlobUrl = (url) => typeof url === "string" && url.startsWith("blob:");

/**
 * Gestiona las imágenes del formulario de edición combinando URLs ya
 * guardadas en el backend (imagenesExistentes) con archivos nuevos (imagenes).
 * Los previews de archivos locales son blob: URLs que se revocan al quitar la
 * imagen y al desmontar el formulario.
 */
export function useEdicionImagenes({ state, dispatch }) {
  const previewsBlobRef = useRef([]);

  // Revoca las blob: URLs que ya no estén en la lista de previews.
  useEffect(() => {
    const blobsActuales = new Set(
      (state.previews || []).filter((p) => esBlobUrl(p)),
    );
    previewsBlobRef.current.forEach((url) => {
      if (esBlobUrl(url) && !blobsActuales.has(url)) {
        URL.revokeObjectURL(url);
      }
    });
    previewsBlobRef.current = state.previews || [];
  }, [state.previews]);

  // Revoca todas las blob: URLs pendientes al desmontar.
  useEffect(
    () => () => {
      previewsBlobRef.current.forEach((url) => {
        if (esBlobUrl(url)) URL.revokeObjectURL(url);
      });
    },
    [],
  );

  const handleImagen = (files) => {
    // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke -- se revoca al quitar y en unmount (previewsBlobRef)
    const nuevosPreviews = files.map((file) => URL.createObjectURL(file));
    dispatch({ type: "SET_IMAGENES", payload: [...state.imagenes, ...files] });
    dispatch({
      type: "SET_PREVIEWS",
      payload: [...(state.previews || []), ...nuevosPreviews],
    });
    dispatch({ type: "SET_INDICE_IMAGEN", payload: 0 });
  };

  const handleRemoveImagen = (idx) => {
    const totalExistentes = state.imagenesExistentes?.length || 0;
    const esExistente = idx < totalExistentes;

    if (esExistente) {
      dispatch({
        type: "SET_IMAGENES_EXISTENTES",
        payload: state.imagenesExistentes.filter((_, i) => i !== idx),
      });
    } else {
      const url = state.previews[idx];
      if (esBlobUrl(url)) {
        URL.revokeObjectURL(url);
      }
      const indiceEnArchivos = idx - totalExistentes;
      dispatch({
        type: "SET_IMAGENES",
        payload: state.imagenes.filter((_, i) => i !== indiceEnArchivos),
      });
    }

    dispatch({
      type: "SET_PREVIEWS",
      payload: state.previews.filter((_, i) => i !== idx),
    });

    const nuevoIdx = Math.min(
      state.indiceImagenActual,
      (state.previews?.length || 0) - 2,
    );
    dispatch({ type: "SET_INDICE_IMAGEN", payload: Math.max(0, nuevoIdx) });
  };

  const handleNavigate = (dir) => {
    const total = state.previews?.length || 0;
    if (total === 0) return;
    const siguiente =
      dir === "next"
        ? (state.indiceImagenActual + 1) % total
        : (state.indiceImagenActual - 1 + total) % total;
    dispatch({ type: "SET_INDICE_IMAGEN", payload: siguiente });
  };

  return { handleImagen, handleRemoveImagen, handleNavigate };
}