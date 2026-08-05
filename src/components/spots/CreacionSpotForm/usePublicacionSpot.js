import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { crearSpot } from "@/services/spot.service";
import { subirImagenesSpot } from "@/services/imagen.service";

export function usePublicacionSpot({ state, dispatch, esSocio }) {
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

    if (state.imagenes.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Imágenes requeridas",
        text: "Por favor sube al menos una imagen del lugar.",
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

  const handlePublicar = async () => {
    if (!validarFormulario()) return;

    dispatch({ type: "SET_CARGANDO", payload: true });

    Swal.fire({
      title: "Subiendo imágenes...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      // 1. Subir imágenes usando el service
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

      // 2. Crear el spot con las URLs reales
      Swal.update({ title: "Publicando spot..." });

      const spotParaEnviar = {
        nombre: state.nombreLugar,
        latitud: parseFloat(state.latitud),
        longitud: parseFloat(state.longitud),
        direccion: state.direccion,
        categoria: state.categoria?.value || state.categoria,
        localidad: state.localidad?.value || state.localidad,
        descripcion: state.descripcionImagen,
        recomendacion: state.recomendacion || "",
        tipsFoto: state.tipsFoto || "",
        imagenes: resultadoImagenes.urls,
        tipo: esSocio ? "LOCAL" : "SPOT",
      };

      if (esSocio) {
        spotParaEnviar.telefono = state.telefono || "";
        spotParaEnviar.horario = state.horario || "";
        spotParaEnviar.sitioWeb = state.sitioWeb || "";
      }

      const resultado = await crearSpot(spotParaEnviar);

      Swal.close();
      dispatch({ type: "SET_CARGANDO", payload: false });

      if (resultado.exitoso) {
        await Swal.fire({
          icon: "success",
          title: esSocio ? "Local creado" : "Spot publicado",
          text:
            "Tu " +
            (esSocio ? "local" : "spot") +
            " ya está visible en el mapa.",
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        navigate(`/spot/${resultado.datos.id}`);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al publicar",
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
        "Ocurrió un error al publicar el spot.";

      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: mensaje,
        confirmButtonColor: "#806fbe",
      });
    }
  };

  return { handlePublicar };
}
