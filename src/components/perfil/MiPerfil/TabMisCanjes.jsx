import { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { FaTicketAlt, FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import LoadingBlock from "./LoadingBlock";
import SinContenido from "./SinContenido";
import {
  obtenerMisCanjes,
  obtenerEtiquetaEstadoCanje,
  ESTADOS_CANJE,
  formatearFechaCanje,
  canjeEstaExpirado,
} from "@/services/canje.service";

const copiarCodigo = async (codigo) => {
  await navigator.clipboard.writeText(codigo);
  toast.success("Código copiado");
};

const TabMisCanjes = () => {
  const [canjes, setCanjes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [codigoVisible, setCodigoVisible] = useState({});

  useEffect(() => {
    let cancelado = false;
    const cargar = async () => {
      setCargando(true);
      const resultado = await obtenerMisCanjes();
      if (cancelado) return;
      if (resultado.exitoso) {
        setCanjes(resultado.datos || []);
      } else {
        toast.error(resultado.mensaje);
      }
      setCargando(false);
    };
    cargar();
    return () => {
      cancelado = true;
    };
    // oxlint-disable-next-line react-doctor/no-set-state-after-await-in-effect -- setters tras await bajo flag cancelado
  }, []);

  const toggleCodigo = (id) => {
    setCodigoVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (cargando) {
    return <LoadingBlock />;
  }

  if (canjes.length === 0) {
    return (
      <SinContenido
        icono={<FaTicketAlt size={48} />}
        titulo="No tienes canjes"
        descripcion="Canjea una promoción en la página de un local y aparecerá aquí con su código."
        textBoton="Explorar el mapa"
        rutaBoton="/mapa"
      />
    );
  }

  return (
    <div className="mis-canjes">
      <p className="mis-canjes-intro">
        Estos son tus códigos. Preséntalos en el local al momento de usar la
        promoción; el socio los valida para hacer efectivo el cobro.
      </p>

      {canjes.map((canje) => {
        const expirado = canjeEstaExpirado(canje);
        const variant =
          ESTADOS_CANJE.find((e) => e.valor === (expirado && canje.estado !== "USADO" ? "EXPIRADO" : canje.estado))
            ?.variant || "secondary";
        const mostrarCodigo = codigoVisible[canje.id];

        return (
          <div key={canje.id} className={`canje-item ${expirado ? "expirado" : ""}`}>
            <div className="canje-item-cabecera">
              <div className="canje-item-titulos">
                <h4 className="canje-item-titulo">
                  {canje.promocionTitulo || "Promoción"}
                </h4>
                {canje.spotNombre && (
                  <span className="canje-item-spot">{canje.spotNombre}</span>
                )}
              </div>
              <Badge bg={variant}>
                {obtenerEtiquetaEstadoCanje(canje.estado)}
              </Badge>
            </div>

            <div className="canje-item-codigo">
              <span className="canjear-label">Código:</span>
              <code className="canje-codigo-valor">
                {mostrarCodigo ? canje.codigo : "••••••••"}
              </code>
              <button
                type="button"
                className="btn-codigo-toggle"
                onClick={() => toggleCodigo(canje.id)}
                aria-label={
                  mostrarCodigo ? "Ocultar código" : "Mostrar código"
                }
              >
                {mostrarCodigo ? <FaEyeSlash /> : <FaEye />}
              </button>
              <button
                type="button"
                className="btn-codigo-toggle"
                onClick={() => copiarCodigo(canje.codigo)}
                aria-label="Copiar código"
              >
                <FaCopy />
              </button>
            </div>

            <div className="canje-item-fechas">
              {canje.fechaCanje && (
                <span>Canjeado: {formatearFechaCanje(canje.fechaCanje)}</span>
              )}
              {canje.fechaExpiracion && (
                <span>Vence: {formatearFechaCanje(canje.fechaExpiracion)}</span>
              )}
            </div>

            {expirado && canje.estado === "VIGENTE" && (
              <p className="canje-item-aviso">
                Este código ya venció. Puedes canjear de nuevo la promoción si
                sigue activa.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TabMisCanjes;