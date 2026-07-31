import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  obtenerSpotsGuardados,
  guardarSpot,
  quitarSpotGuardado,
} from "@/services/usuario.service";

let guardadosCache = null;
let cargandoCache = false;
const suscriptores = new Set();

const notificarSuscriptores = () => {
  suscriptores.forEach((cb) => cb());
};

const cargarGuardadosIds = async () => {
  if (guardadosCache !== null || cargandoCache) return;

  cargandoCache = true;
  notificarSuscriptores();

  try {
    const resultado = await obtenerSpotsGuardados();
    if (resultado.exitoso && Array.isArray(resultado.datos)) {
      guardadosCache = new Set(
        resultado.datos.map((s) => String(s.id ?? s?.id)),
      );
    } else {
      guardadosCache = new Set();
    }
  } catch {
    guardadosCache = new Set();
  }

  cargandoCache = false;
  notificarSuscriptores();
};

export const useGuardados = () => {
  const { logueado } = useAuth();
  const [ids, setIds] = useState(guardadosCache || new Set());
  const [cargando, setCargando] = useState(cargandoCache);

  useEffect(() => {
    const actualizar = () => {
      setIds(guardadosCache || new Set());
      setCargando(cargandoCache);
    };

    suscriptores.add(actualizar);
    return () => {
      suscriptores.delete(actualizar);
    };
  }, []);

  useEffect(() => {
    if (!logueado) {
      guardadosCache = null;
      notificarSuscriptores();
      return;
    }

    if (guardadosCache === null && !cargandoCache) {
      cargarGuardadosIds();
    }
  }, [logueado]);

  const isGuardado = useCallback(
    (id) => ids.has(String(id)),
    [ids],
  );

  const toggleGuardado = useCallback(
    async (id) => {
      if (!logueado) {
        return {
          exitoso: false,
          mensaje: "Inicia sesión para guardar spots",
        };
      }

      const spotId = String(id);
      const estaGuardado = ids.has(spotId);

      let resultado;

      if (estaGuardado) {
        resultado = await quitarSpotGuardado(id);
        if (resultado.exitoso && guardadosCache) {
          guardadosCache.delete(spotId);
          notificarSuscriptores();
        }
      } else {
        resultado = await guardarSpot(id);
        if (resultado.exitoso && guardadosCache) {
          guardadosCache.add(spotId);
          notificarSuscriptores();
        }
      }

      return resultado;
    },
    [ids, logueado],
  );

  const refreshGuardados = useCallback(async () => {
    guardadosCache = null;
    await cargarGuardadosIds();
  }, []);

  return { isGuardado, toggleGuardado, refreshGuardados, cargando };
};

export default useGuardados;
