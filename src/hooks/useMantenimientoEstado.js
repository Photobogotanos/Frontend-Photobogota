import { useState, useEffect, useCallback, useRef } from "react";
import { obtenerEstadoMantenimiento } from "@/services/mantenimiento.service";

const POLLING_INTERVAL_MS = 20000; // 20s: es info pública y liviana, no hace falta más frecuencia

/**
 * Consulta y mantiene actualizado el estado de mantenimiento del sistema.
 * Se usa tanto para el overlay global (bloquear a los usuarios que no son
 * ADMIN) como para el panel de administración (refrescar tras programar/cancelar).
 */
export function useMantenimientoEstado() {
  const [estado, setEstado] = useState({
    cargado: false,
    enMantenimiento: false,
    mensaje: "",
    fechaInicio: null,
    fechaFin: null,
    proximoInicio: null,
    proximoFin: null,
  });

  // Evita pisar un estado más reciente si dos consultas quedan en vuelo a la vez.
  const ultimaConsultaId = useRef(0);

  const consultar = useCallback(async () => {
    const idConsulta = ++ultimaConsultaId.current;
    const res = await obtenerEstadoMantenimiento();

    if (idConsulta !== ultimaConsultaId.current) return; // llegó una respuesta más nueva antes

    if (res.exitoso && res.data) {
      setEstado({
        cargado: true,
        enMantenimiento: !!res.data.enMantenimiento,
        mensaje: res.data.mensaje || "",
        fechaInicio: res.data.fechaInicio || null,
        fechaFin: res.data.fechaFin || null,
        proximoInicio: res.data.proximoInicio || null,
        proximoFin: res.data.proximoFin || null,
      });
    } else {
      // Si no se pudo consultar (ej. el propio backend está caído del todo),
      // no asumimos que está en mantenimiento: solo marcamos que ya se intentó.
      setEstado((prev) => ({ ...prev, cargado: true }));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch inicial al montar, patrón válido
    consultar();
    const interval = setInterval(consultar, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [consultar]);

  return { ...estado, refrescar: consultar };
}
