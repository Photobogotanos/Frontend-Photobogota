const TAMANO_MAXIMO_BYTES = 4 * 1024 * 1024; // 4 MB (límite del backend: 5 MB)
const DIMENSION_MAXIMA = 1600; // px en el lado más largo
const CALIDAD_JPEG = 0.82;

const leerImagen = (archivo) =>
  new Promise((resolve, reject) => {
    // oxlint-disable-next-line react-doctor/no-create-object-url-without-revoke -- la URL se revoca en onload/onerror
    const url = URL.createObjectURL(archivo);
    const imagen = new Image();
    imagen.onload = () => {
      URL.revokeObjectURL(url);
      resolve(imagen);
    };
    imagen.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer la imagen"));
    };
    imagen.src = url;
  });

const convertirABlob = (canvas, mime, calidad) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("No se pudo procesar la imagen")),
      mime,
      calidad,
    );
  });

const nombreConExtension = (archivo, extension) => {
  const base = (archivo.name || "imagen").replace(/\.[^.]+$/, "");
  return `${base}.${extension}`;
};

/**
 * Reduce el peso de una imagen antes de subirla para que el backend no la
 * rechace por superar el tamaño máximo (5 MB).
 *
 * - Si la imagen ya está dentro de límites (dimensiones y peso) se devuelve tal cual.
 * - En caso contrario se redimensiona a 1600px como máximo y se re-comprime a
 *   JPEG/WebP, garantizando un archivo mucho más liviano.
 */
export const redimensionarImagen = async (archivo) => {
  if (!archivo || !archivo.type?.startsWith("image/")) return archivo;

  try {
    const imagen = await leerImagen(archivo);
    const ancho = imagen.naturalWidth;
    const alto = imagen.naturalHeight;

    const necesitaEscalar = ancho > DIMENSION_MAXIMA || alto > DIMENSION_MAXIMA;
    if (!necesitaEscalar && archivo.size <= TAMANO_MAXIMO_BYTES) return archivo;

    const factor = Math.min(1, DIMENSION_MAXIMA / Math.max(ancho, alto));
    const nuevoAncho = Math.round(ancho * factor);
    const nuevoAlto = Math.round(alto * factor);

    const canvas = document.createElement("canvas");
    canvas.width = nuevoAncho;
    canvas.height = nuevoAlto;
    canvas.getContext("2d").drawImage(imagen, 0, 0, nuevoAncho, nuevoAlto);

    const mime = archivo.type === "image/webp" ? "image/webp" : "image/jpeg";
    const calidad = mime === "image/jpeg" ? CALIDAD_JPEG : 0.8;
    const blob = await convertirABlob(canvas, mime, calidad);
    const extension = mime === "image/webp" ? "webp" : "jpg";

    return new File([blob], nombreConExtension(archivo, extension), {
      type: mime,
    });
  } catch {
    return archivo;
  }
};
