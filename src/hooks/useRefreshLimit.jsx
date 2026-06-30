import { useState, useEffect } from "react";

const REFRESH_LIMIT = 5;
const STORAGE_KEY = "app_refresh_metrics";
const BASE_COOLDOWN_MS = 5000;

// Guard a nivel de MÓDULO (no de componente). Sirve para que, si React
// StrictMode invoca dos veces la función inicializadora de useState en
// desarrollo, el conteo de refrescos no se duplique. Al vivir en el
// módulo, se "resetea" solo con una recarga real de la página, que es
// justo lo que queremos contar.
let yaContadoEnEsteCiclo = false;

const leerMetrics = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data
      ? JSON.parse(data)
      : { count: 0, blockCount: 0, blockedUntil: null };
  } catch {
    return { count: 0, blockCount: 0, blockedUntil: null };
  }
};

const guardarMetrics = (metrics) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(metrics));
};

/**
 * Calcula el estado inicial leyendo (y, si corresponde, actualizando)
 * localStorage. Se ejecuta de forma SÍNCRONA durante el render, como
 * inicializador perezoso de useState — no dentro de un efecto. Esto
 * elimina el warning "Calling setState synchronously within an effect"
 * y el render en cascada que provocaba (mount -> efecto -> setState ->
 * segundo render).
 */
const calcularEstadoInicial = () => {
  let metrics = leerMetrics();
  const now = Date.now();

  // Si el bloqueo anterior ya expiró (p. ej. el usuario volvió después
  // de mucho tiempo), lo limpiamos antes de seguir.
  if (metrics.blockedUntil && now >= metrics.blockedUntil) {
    metrics = { count: 0, blockCount: metrics.blockCount, blockedUntil: null };
    guardarMetrics(metrics);
  }

  // Si seguimos dentro de un bloqueo activo, no incrementamos el
  // contador de refrescos: solo reportamos cuánto falta.
  if (metrics.blockedUntil && now < metrics.blockedUntil) {
    return {
      isBlocked: true,
      remainingCooldown: Math.ceil((metrics.blockedUntil - now) / 1000),
    };
  }

  // Evita contar el mismo refresh dos veces por el doble-invoke de
  // StrictMode en desarrollo.
  if (yaContadoEnEsteCiclo) {
    return { isBlocked: false, remainingCooldown: 0 };
  }
  yaContadoEnEsteCiclo = true;

  const newCount = metrics.count + 1;
  let blockedUntil = null;
  let newBlockCount = metrics.blockCount;
  let resultado = { isBlocked: false, remainingCooldown: 0 };

  if (newCount >= REFRESH_LIMIT) {
    newBlockCount += 1;
    const dynamicCooldown = BASE_COOLDOWN_MS * newBlockCount;
    blockedUntil = now + dynamicCooldown;
    resultado = {
      isBlocked: true,
      remainingCooldown: Math.ceil(dynamicCooldown / 1000),
    };
  }

  guardarMetrics({ count: newCount, blockCount: newBlockCount, blockedUntil });
  return resultado;
};

export const useRefreshLimit = () => {
  const [status, setStatus] = useState(calcularEstadoInicial);

  // Este SÍ es un uso correcto de useEffect: nos suscribimos al paso
  // del tiempo (el reloj/timer es el sistema externo) y actualizamos
  // el estado de React desde el CALLBACK del intervalo, no desde el
  // cuerpo del efecto. Por eso no dispara el warning.
  useEffect(() => {
    if (!status.isBlocked) return;

    const interval = setInterval(() => {
      const metrics = leerMetrics();
      const now = Date.now();

      if (!metrics.blockedUntil || now >= metrics.blockedUntil) {
        if (metrics.blockedUntil) {
          guardarMetrics({
            count: 0,
            blockCount: metrics.blockCount,
            blockedUntil: null,
          });
        }
        setStatus({ isBlocked: false, remainingCooldown: 0 });
      } else {
        setStatus((prev) => ({
          ...prev,
          remainingCooldown: Math.ceil((metrics.blockedUntil - now) / 1000),
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status.isBlocked]);

  return status;
};
