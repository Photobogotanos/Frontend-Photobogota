import { postSubirImagenSpot, postSubirAvatar } from "@/api/imagenApi";
import { redimensionarImagen } from "@/utils/imagen.util";

/**
 * Sube múltiples imágenes de un spot al servidor.
 * Antes de subir, cada imagen se redimensiona/compacta para que no supere el
 * límite de tamaño del backend (5 MB). Retorna un array de URLs listas para
 * guardar en el spot.
 */
export const subirImagenesSpot = async (archivos) => {
  try {
    const urls = await Promise.all(
      archivos.map(async (file) => {
        const archivoPreparado = await redimensionarImagen(file);
        const { data } = await postSubirImagenSpot(archivoPreparado);
        return data.url;
      }),
    );

    return {
      exitoso: true,
      urls,
      mensaje: "Imágenes subidas exitosamente",
    };
  } catch (error) {
    const mensajeServidor =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "";
    const esLimiteTamano =
      error.response?.status === 413 ||
      /(size|tamaño|maximum|max).*(exceeded|excede|excedido|máximo|permitido)|max-(file|upload)-size/i.test(
        mensajeServidor,
      );

    if (esLimiteTamano) {
      return {
        exitoso: false,
        urls: [],
        mensaje:
          "Una o más imágenes superan el tamaño máximo permitido (5MB). Se intentó reducir su peso automáticamente; prueba con una imagen más liviana.",
      };
    }

    if (error.response?.status === 415) {
      return {
        exitoso: false,
        urls: [],
        mensaje: "Formato de imagen no soportado. Usa JPG, PNG o WEBP.",
      };
    }

    return {
      exitoso: false,
      urls: [],
      mensaje:
        mensajeServidor || "Error al subir las imágenes. Revisa tu conexión e inténtalo de nuevo.",
    };
  }
};

/**
 * Sube el avatar del usuario al servidor.
 * Retorna la URL de la imagen guardada.
 */
export const subirAvatar = async (archivo) => {
  try {
    const { data } = await postSubirAvatar(archivo);

    return {
      exitoso: true,
      url: data.url,
      mensaje: "Avatar subido exitosamente",
    };
  } catch (error) {
    const mensaje =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error al subir el avatar";

    if (error.response?.status === 413) {
      return {
        exitoso: false,
        url: null,
        mensaje: "La imagen supera el tamaño máximo permitido (5MB)",
      };
    }

    if (error.response?.status === 415) {
      return {
        exitoso: false,
        url: null,
        mensaje: "Formato no soportado. Usa JPG, PNG o GIF.",
      };
    }

    return {
      exitoso: false,
      url: null,
      mensaje,
    };
  }
};
