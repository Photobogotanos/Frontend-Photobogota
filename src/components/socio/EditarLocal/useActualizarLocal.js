import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { actualizarLocal } from "@/services/spot.service";
import { subirImagenesSpot } from "@/services/imagen.service";

export function useActualizarLocal({ state, dispatch, localId }) {
  const navigate = useNavigate();

  const validarFormulario = () => {
    if (!state.nombreLugar.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Por favor ingresa el nombre del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.direccion.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Dirección requerida",
        text: "Por favor ingresa la dirección del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.categoria) {
      Swal.fire({
        icon: "warning",
        title: "Categoría requerida",
        text: "Por favor selecciona una categoría.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.localidad) {
      Swal.fire({
        icon: "warning",
        title: "Localidad requerida",
        text: "Por favor selecciona una localidad.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.descripcionImagen.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Descripción requerida",
        text: "Por favor ingresa una descripción del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    const totalImagenes =
      (state.imagenesExistentes?.length || 0) + (state.imagenes?.length || 0);

    if (totalImagenes === 0) {
      Swal.fire({
        icon: "warning",
        title: "Imágenes requeridas",
        text: "El local debe conservar al menos una imagen.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    if (!state.latitud || !state.longitud) {
      Swal.fire({
        icon: "warning",
        title: "Ubicación GPS requerida",
        text: "Usa el botón de ubicación para obtener las coordenadas del lugar.",
        confirmButtonColor: "#806fbe",
      });
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    dispatch({ type: "SET_CARGANDO", payload: true });

    Swal.fire({
      title: "Subiendo imágenes...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // 1. Subir solo las imágenes nuevas (archivos locales).
      let urlsNuevas = [];
      if (state.imagenes.length > 0) {
        const resultadoImagenes = await subirImagenesSpot(state.imagenes);

        if (!resultadoImagenes.exitoso) {
          Swal.close();
          dispatch({ type: "SET_CARGANDO", payload: false });
          Swal.fire({
            icon: "error",
            title: "Error al subir imágenes",
            text: resultadoImagenes.mensaje,
            confirmButtonColor: "#806fbe",
          });
          return;
        }
        urlsNuevas = resultadoImagenes.urls;
      }

      // 2. Actualizar el local con la mezcla de imágenes ya guardadas + nuevas.
      Swal.update({ title: "Guardando cambios..." });

      const localParaEnviar = {
        nombre: state.nombreLugar,
        latitud: parseFloat(state.latitud),
        longitud: parseFloat(state.longitud),
        direccion: state.direccion,
        categoria: state.categoria?.value || state.categoria,
        localidad: state.localidad?.value || state.localidad,
        descripcion: state.descripcionImagen,
        recomendacion: state.recomendacion || "",
        tipsFoto: state.tipsFoto || "",
        imagenes: [...(state.imagenesExistentes || []), ...urlsNuevas],
        tipo: "LOCAL",
        telefono: state.telefono || "",
        horario: state.horario || "",
        sitioWeb: state.sitioWeb || "",
      };

      const resultado = await actualizarLocal(localId, localParaEnviar);

      Swal.close();
      dispatch({ type: "SET_CARGANDO", payload: false });

      if (resultado.exitoso) {
        await Swal.fire({
          icon: "success",
          title: "Local actualizado",
          text: "Los datos públicos de tu local quedaron guardados.",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        navigate("/locales");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al actualizar",
          text: resultado.mensaje,
          confirmButtonColor: "#806fbe",
        });
      }
    } catch (error) {
      Swal.close();
      dispatch({ type: "SET_CARGANDO", payload: false });

      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        "Ocurrió un error al actualizar el local.";

      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: mensaje,
        confirmButtonColor: "#806fbe",
      });
    }
  };

  return { handleGuardar };
}