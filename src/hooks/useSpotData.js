// hooks/useSpotData.js
import { useState, useEffect, useRef } from "react";
import { obtenerSpotPorId } from "@/services/spot.service";
import { obtenerPromocionActivaDeSpot } from "@/services/promocion.service";
import { toast } from "react-hot-toast";

export const useSpotData = (id) => {
  const [spot, setSpot] = useState(null);
  const [cargandoSpot, setCargandoSpot] = useState(false);
  const [promocion, setPromocion] = useState(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!id) {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
      setSpot(null);
      setPromocion(null);
      setCargandoSpot(false);
      return;
    }

    let isActive = true;
    abortControllerRef.current = new AbortController();

    const cargarSpot = async () => {
      // Only set loading if still active
      if (!isActive) return;
      setCargandoSpot(true);

      try {
        const resultado = await obtenerSpotPorId(id, {
          signal: abortControllerRef.current.signal,
        });

        // Guard: skip all state updates if cancelled
        if (!isActive || resultado.aborted) return;

        if (resultado.exitoso) {
          if (isActive) {
            setSpot(resultado.datos);
            setPromocion(null);
          }

          if (resultado.datos?.tienePromocion) {
            const promo = await obtenerPromocionActivaDeSpot(
              resultado.datos.id || id,
              { signal: abortControllerRef.current.signal }
            );

            // Guard: skip promotion update if cancelled
            if (!isActive || promo.aborted) return;

            if (promo.exitoso) {
              if (isActive) {
                setPromocion(promo.datos);
              }
            }
          }
        } else {
          // Only show toast if still active
          if (isActive) {
            toast.error(resultado.mensaje);
          }
        }
      } catch (error) {
        // Only handle errors if still active and not an abort
        if (isActive && error.name !== "AbortError") {
          console.error("Error inesperado:", error);
          toast.error("Error al cargar el spot");
        }
      } finally {
        // Only update loading state if still active
        if (isActive) {
          setCargandoSpot(false);
        }
      }
    };

    cargarSpot();

    return () => {
      isActive = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [id]);

  return { spot, cargandoSpot, promocion, setPromocion };
};
